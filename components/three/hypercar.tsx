"use client"

import { useRef, useEffect, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"

interface HypercarProps {
  progress: number
}

/* ─── Easing ─── */
function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function phaseProgress(progress: number, start: number, duration: number) {
  return ease(Math.min(1, Math.max(0, (progress - start) / duration)))
}

/* ─── Classify meshes into assembly groups by spatial position ─── */
interface AssemblyPart {
  mesh: THREE.Object3D
  originalPosition: THREE.Vector3
  originalQuaternion: THREE.Quaternion
  originalScale: THREE.Vector3
  group: "chassis" | "engine" | "wheels" | "body" | "glass" | "details"
  explosionOffset: THREE.Vector3
  phaseStart: number
  phaseDuration: number
}

function classifyMesh(
  mesh: THREE.Object3D,
  center: THREE.Vector3,
  carBounds: THREE.Box3
): AssemblyPart["group"] {
  const name = mesh.name.toLowerCase()
  const pos = new THREE.Vector3()
  mesh.getWorldPosition(pos)
  const relY = pos.y - center.y
  const relX = Math.abs(pos.x - center.x)
  const carHeight = carBounds.max.y - carBounds.min.y
  const carWidth = carBounds.max.x - carBounds.min.x

  /* Name-based classification (most reliable) */
  if (name.match(/wheel|tire|tyre|rim|brake|caliper|disc|hub|axle|rotor/)) return "wheels"
  if (name.match(/glass|window|windshield|windscreen|visor|canopy/)) return "glass"
  if (name.match(/engine|motor|turbo|exhaust|manifold|cylinder|piston|intake|header|pipe|muffler/)) return "engine"
  if (name.match(/chassis|frame|subframe|floor|under|skid|suspension|spring|shock|arm|link|strut/)) return "chassis"
  if (name.match(/light|lamp|led|headlight|taillight|indicator|signal|lens|reflector|beam/)) return "details"
  if (name.match(/mirror|antenna|wiper|badge|logo|emblem|spoiler|wing|diffuser|splitter|vent|scoop|duct|grille|grill|bumper|fender|hood|bonnet|door|trunk|boot|roof|panel|body|quarter|skirt|lip|canard|aero/)) return "body"
  if (name.match(/seat|steering|dash|dashboard|console|interior|carpet|trim|pedal|shifter|gauge/)) return "engine"

  /* Fallback: position-based classification */
  if (relY < -carHeight * 0.3) return "chassis"
  if (relX > carWidth * 0.38 && relY < -carHeight * 0.1) return "wheels"
  if (relY > carHeight * 0.35) return "glass"
  if (relY > carHeight * 0.1 && relY < carHeight * 0.35) return "body"
  if (relX < carWidth * 0.15 && relY > -carHeight * 0.1 && relY < carHeight * 0.15) return "engine"
  return "body"
}

function getPhaseConfig(group: AssemblyPart["group"]): { start: number; duration: number } {
  switch (group) {
    case "chassis":  return { start: 0.0, duration: 0.18 }
    case "engine":   return { start: 0.12, duration: 0.18 }
    case "wheels":   return { start: 0.25, duration: 0.18 }
    case "body":     return { start: 0.38, duration: 0.22 }
    case "glass":    return { start: 0.55, duration: 0.15 }
    case "details":  return { start: 0.65, duration: 0.15 }
  }
}

function getExplosionOffset(
  mesh: THREE.Object3D,
  center: THREE.Vector3,
  group: AssemblyPart["group"]
): THREE.Vector3 {
  const pos = new THREE.Vector3()
  mesh.getWorldPosition(pos)
  const dir = pos.clone().sub(center)

  switch (group) {
    case "chassis":
      /* Rise up from below */
      return new THREE.Vector3(0, -3.5, 0)
    case "engine":
      /* Drop in from above */
      return new THREE.Vector3(0, 5, 0)
    case "wheels": {
      /* Slide in from sides */
      const sideDir = dir.x > 0 ? 1 : -1
      return new THREE.Vector3(sideDir * 5, -0.5, 0)
    }
    case "body": {
      /* Explode outward from center */
      const bodyDir = dir.clone().normalize()
      return new THREE.Vector3(
        bodyDir.x * 3.0,
        bodyDir.y * 1.5 + 1.5,
        bodyDir.z * 1.5
      )
    }
    case "glass":
      /* Float down from above */
      return new THREE.Vector3(0, 3.5, 0)
    case "details": {
      /* Scatter slightly outward */
      const detDir = dir.clone().normalize()
      return new THREE.Vector3(
        detDir.x * 2.0,
        detDir.y * 1.2 + 1.0,
        detDir.z * 2.0
      )
    }
  }
}

/* ─── Main Component ─── */
export default function Hypercar({ progress }: HypercarProps) {
  const { scene } = useGLTF("/models/mclaren-w1.glb")
  const groupRef = useRef<THREE.Group>(null)
  const partsRef = useRef<AssemblyPart[]>([])
  const modelRef = useRef<THREE.Group | null>(null)

  /* Clone scene and classify all meshes */
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)

    /* Compute overall bounding box */
    const box = new THREE.Box3().setFromObject(clone)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())

    /* Normalize: scale so longest axis is ~3 units, center at origin */
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 3.0 / maxDim
    clone.scale.setScalar(scale)
    clone.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale)
    clone.updateMatrixWorld(true)

    /* Recompute bounds after scaling */
    const scaledBox = new THREE.Box3().setFromObject(clone)
    const scaledCenter = scaledBox.getCenter(new THREE.Vector3())

    /* Enhance materials for better visibility */
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true

        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          materials.forEach((mat) => {
            if ((mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
              const stdMat = mat as THREE.MeshStandardMaterial
              stdMat.envMapIntensity = 1.8
              stdMat.needsUpdate = true
            }
          })
        }
      }
    })

    /* Classify meshes into assembly groups */
    const parts: AssemblyPart[] = []
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh || child.children.length === 0) {
        /* Only classify leaf nodes or meshes */
        if (!(child as THREE.Mesh).isMesh) return

        const group = classifyMesh(child, scaledCenter, scaledBox)
        const { start, duration } = getPhaseConfig(group)
        const offset = getExplosionOffset(child, scaledCenter, group)

        parts.push({
          mesh: child,
          originalPosition: child.position.clone(),
          originalQuaternion: child.quaternion.clone(),
          originalScale: child.scale.clone(),
          group,
          explosionOffset: offset,
          phaseStart: start,
          phaseDuration: duration,
        })
      }
    })

    partsRef.current = parts
    modelRef.current = clone

    return clone
  }, [scene])

  /* Set initial state: fully exploded */
  useEffect(() => {
    partsRef.current.forEach((part) => {
      const mat = (part.mesh as THREE.Mesh).material
      if (mat) {
        const materials = Array.isArray(mat) ? mat : [mat]
        materials.forEach((m) => {
          if ((m as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
            const stdMat = m as THREE.MeshStandardMaterial
            stdMat.transparent = true
            stdMat.opacity = 0
            stdMat.needsUpdate = true
          }
        })
      }
    })
  }, [])

  /* Animate on scroll */
  useFrame(() => {
    if (!groupRef.current) return

    partsRef.current.forEach((part) => {
      const p = phaseProgress(progress, part.phaseStart, part.phaseDuration)

      /* Interpolate position: from (original + explosionOffset) to (original) */
      const offsetX = part.explosionOffset.x * (1 - p)
      const offsetY = part.explosionOffset.y * (1 - p)
      const offsetZ = part.explosionOffset.z * (1 - p)

      part.mesh.position.set(
        part.originalPosition.x + offsetX,
        part.originalPosition.y + offsetY,
        part.originalPosition.z + offsetZ
      )

      /* Slight rotation during assembly for wheels */
      if (part.group === "wheels") {
        const spinAmount = (1 - p) * Math.PI * 4
        part.mesh.rotation.x = spinAmount
      }

      /* Opacity: fade in */
      const mat = (part.mesh as THREE.Mesh).material
      if (mat) {
        const materials = Array.isArray(mat) ? mat : [mat]
        materials.forEach((m) => {
          if ((m as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
            const stdMat = m as THREE.MeshStandardMaterial
            /* Quick fade-in at the start of each phase */
            const fadeP = Math.min(1, p * 3)
            stdMat.opacity = fadeP
            stdMat.transparent = fadeP < 0.99
            stdMat.depthWrite = fadeP > 0.5
            stdMat.needsUpdate = true
          }
        })
      }
    })

    /* Subtle idle float once mostly assembled */
    if (progress > 0.75) {
      const idleP = (progress - 0.75) / 0.25
      const float = Math.sin(Date.now() * 0.001) * 0.008 * idleP
      groupRef.current.position.y = float
    } else {
      groupRef.current.position.y = 0
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  )
}

useGLTF.preload("/models/mclaren-w1.glb")

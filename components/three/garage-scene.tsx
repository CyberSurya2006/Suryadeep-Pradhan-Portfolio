"use client"

import { useRef, useMemo, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, useGLTF } from "@react-three/drei"
import * as THREE from "three"

/* ─── Floating dust particles - optimized ─── */
function DustParticles({ count = 100 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const frameSkip = useRef(0)

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const spd = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14
      pos[i * 3 + 1] = Math.random() * 5 - 0.5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14
      spd[i] = 0.001 + Math.random() * 0.002
    }
    return [pos, spd]
  }, [count])

  useFrame((state) => {
    // Skip every other frame for dust particles (not critical)
    frameSkip.current++
    if (frameSkip.current % 2 !== 0) return
    
    if (!ref.current) return
    const posArray = ref.current.geometry.attributes.position.array as Float32Array
    const time = state.clock.elapsedTime * 0.12
    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 1] += speeds[i]
      posArray[i * 3] += Math.sin(time + i) * 0.0002
      if (posArray[i * 3 + 1] > 4.5) {
        posArray[i * 3 + 1] = -0.5
        posArray[i * 3] = (Math.random() - 0.5) * 14
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 14
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.012}
        color="#887755"
        transparent
        opacity={0.25}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/* ─── Garage floor with fade-in ─── */
function GarageFloor({ opacity }: { opacity: number }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#000000"
          metalness={0.05}
          roughness={0.98}
          envMapIntensity={0.01}
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  )
}

/* ─── Floor grid with fade-in - CRISP lines ─── */
function FloorGrid({ opacity }: { opacity: number }) {
  const gridRef = useRef<THREE.GridHelper>(null)
  const gridRef2 = useRef<THREE.GridHelper>(null)
  
  useFrame(() => {
    // Main grid
    if (gridRef.current) {
      const mat = gridRef.current.material as THREE.LineBasicMaterial
      if (mat) {
        mat.opacity = opacity * 0.4
        mat.transparent = true
        mat.depthWrite = false
        mat.needsUpdate = true
      }
    }
    // Secondary finer grid
    if (gridRef2.current) {
      const mat = gridRef2.current.material as THREE.LineBasicMaterial
      if (mat) {
        mat.opacity = opacity * 0.15
        mat.transparent = true
        mat.depthWrite = false
        mat.needsUpdate = true
      }
    }
  })

  return (
    <group position={[0, 0.005, 0]}>
      {/* Main grid - larger squares */}
      <gridHelper
        ref={gridRef}
        args={[80, 40, "#3a3a40", "#252528"]}
        rotation={[0, 0, 0]}
      />
      {/* Secondary grid - finer detail */}
      <gridHelper
        ref={gridRef2}
        args={[80, 160, "#1a1a1f", "#1a1a1f"]}
        rotation={[0, 0, 0]}
        position={[0, -0.001, 0]}
      />
    </group>
  )
}

/* ─── McLaren W1 Car Model - Translucent to solid with color control ─── */
function CarModel({ progress, fadeOut = 1, mouseX, mouseY }: { progress: number; fadeOut?: number; mouseX: number; mouseY: number }) {
  const { scene } = useGLTF("/models/mclaren-w1.glb")
  const groupRef = useRef<THREE.Group>(null)
  const materialsRef = useRef<{ mat: THREE.MeshStandardMaterial; originalColor: THREE.Color }[]>([])

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)
    
    const box = new THREE.Box3().setFromObject(clone)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 2.8 / maxDim
    clone.scale.setScalar(scale)
    clone.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale)
    clone.updateMatrixWorld(true)
    
    const materials: { mat: THREE.MeshStandardMaterial; originalColor: THREE.Color }[] = []
    
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true
        
        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          mats.forEach((mat) => {
            if ((mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
              const stdMat = mat as THREE.MeshStandardMaterial
              stdMat.transparent = true
              stdMat.opacity = 0
              stdMat.envMapIntensity = 2.5
              stdMat.needsUpdate = true
              // Store original color for saturation control
              materials.push({ mat: stdMat, originalColor: stdMat.color.clone() })
            }
          })
        }
      }
    })
    
    materialsRef.current = materials
    return clone
  }, [scene])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    
    /* Subtle hover reaction - smoother with delta time */
    const targetRotY = mouseX * 0.08
    const targetRotX = mouseY * 0.04
    const lerpSpeed = Math.min(delta * 3, 0.1)
    
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * lerpSpeed
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * lerpSpeed
    
    /* Subtle float */
    if (progress > 0.4) {
      const float = Math.sin(Date.now() * 0.001) * 0.01 * Math.min(1, (progress - 0.4) * 2)
      groupRef.current.position.y = float
    }
    
    /* 
     * OPACITY PHASES - Faster car reveal, all parts render together:
     * 0% - 2%: invisible (opacity 0)
     * 2% - 6%: quick fade in (opacity 0 -> 0.7) - ALL PARTS VISIBLE TOGETHER - FASTER
     * 6% - 50%: stay semi-transparent (opacity 0.7 -> 0.85)
     * 50% - 80%: become solid (opacity 0.85 -> 0.95)
     * 80% - 100%: fully solid (opacity 0.95 -> 1.0)
     */
    let targetOpacity = 0
    
    if (progress < 0.02) {
      targetOpacity = 0
    } else if (progress < 0.06) {
      /* Quick fade in - all parts appear together FASTER */
      const t = (progress - 0.02) / 0.04
      targetOpacity = t * 0.7
    } else if (progress < 0.50) {
      /* Semi-transparent phase */
      const t = (progress - 0.06) / 0.44
      targetOpacity = 0.7 + t * 0.15
    } else if (progress < 0.80) {
      /* Becoming solid */
      const t = (progress - 0.50) / 0.30
      targetOpacity = 0.85 + t * 0.1
    } else {
      /* Fully solid */
      const t = (progress - 0.80) / 0.20
      targetOpacity = 0.95 + t * 0.05
    }
    
    /* 
     * COLOR/SATURATION PHASES - Color reveals in JOURNEY section:
     * Journey section starts at roughly 70% of car progress
     * 0% - 65%: fully desaturated/grayscale (saturation = 0)
     * 65% - 90%: gradually fade in color during journey section (saturation 0 -> 1)
     * 90% - 100%: full color (saturation = 1)
     */
    let saturation: number
    if (progress < 0.65) {
      saturation = 0
    } else if (progress < 0.90) {
      // Smooth easing for color transition
      const t = (progress - 0.65) / 0.25
      saturation = t * t // Quadratic ease-in for smoother color reveal
    } else {
      saturation = 1
    }
    
    /* Apply to all materials with fadeOut multiplier */
    const finalOpacity = targetOpacity * fadeOut
    materialsRef.current.forEach(({ mat, originalColor }) => {
      mat.opacity = finalOpacity
      mat.depthWrite = finalOpacity > 0.5
      
      // Apply desaturation: lerp between grayscale and original color
      const gray = originalColor.r * 0.299 + originalColor.g * 0.587 + originalColor.b * 0.114
      mat.color.setRGB(
        gray + (originalColor.r - gray) * saturation,
        gray + (originalColor.g - gray) * saturation,
        gray + (originalColor.b - gray) * saturation
      )
      
      mat.needsUpdate = true
    })
  })

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  )
}

/* ─── Cinematic lighting rig ─── */
function LightingRig({ progress }: { progress: number }) {
  const buildUp = Math.min(1, Math.max(0, progress) * 2)

  return (
    <>
      {/* Main key light */}
      <spotLight
        position={[-2, 10, -3]}
        angle={0.4}
        penumbra={0.5}
        intensity={2.0 + buildUp * 4.0}
        color="#fff5e6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      {/* Secondary key */}
      <spotLight
        position={[3, 9, -1]}
        angle={0.35}
        penumbra={0.6}
        intensity={1.5 + buildUp * 3.0}
        color="#fff0dd"
        castShadow
      />

      {/* Front fill */}
      <spotLight
        position={[0, 4, -8]}
        angle={0.5}
        penumbra={0.7}
        intensity={1.2 + buildUp * 2.4}
        color="#ffe8cc"
      />

      {/* Side fills */}
      <spotLight position={[-7, 3, 0]} angle={0.5} penumbra={0.8} intensity={0.8 + buildUp * 1.6} color="#e0d4c0" />
      <spotLight position={[7, 3, 0]} angle={0.5} penumbra={0.8} intensity={0.7 + buildUp * 1.4} color="#d8c8b0" />

      {/* Rear kicker */}
      <spotLight position={[1, 6, 8]} angle={0.35} penumbra={0.5} intensity={1.2 + buildUp * 2.4} color="#e0a050" />

      {/* Cool accent rims */}
      <pointLight position={[-6, 1.5, 2]} color="#1a3366" intensity={0.4 + buildUp * 0.8} distance={12} />
      <pointLight position={[6, 1.5, 2]} color="#1a3366" intensity={0.4 + buildUp * 0.8} distance={12} />

      {/* Under-car warm bounce */}
      <pointLight position={[0, -0.3, 0]} color="#332010" intensity={0.4 + buildUp * 0.8} distance={4} />

      <ambientLight intensity={0.08 + buildUp * 0.12} color="#e8ddd0" />
      <hemisphereLight color="#f0e0cc" groundColor="#020205" intensity={0.1 + buildUp * 0.15} />
    </>
  )
}

/* ─── Cinematic Camera Controller ─── 
   VERY CLOSE UP start, camera orbits around the car
*/
function CameraController({ progress, fadeOut = 1, mouseX, mouseY }: { progress: number; fadeOut?: number; mouseX: number; mouseY: number }) {
  const { camera } = useThree()

  useFrame(() => {
    /* Cinematic camera path based on scroll progress */
    const p = Math.max(0, Math.min(1, progress))
    
    let targetX: number, targetY: number, targetZ: number
    let lookY = 0.5
    
    if (p < 0.20) {
      /* Phase 1: EXTREME CLOSE-UP from rear (0-20%) - almost touching the car */
      const t = p / 0.20
      const angle = Math.PI + t * 0.1 /* Barely move, stay behind */
      const radius = 2.5 + t * 1.0 /* Start VERY close (2.5), slowly pull back */
      const height = 0.4 + t * 0.3 /* Very low angle */
      
      targetX = Math.sin(angle) * radius
      targetY = height
      targetZ = Math.cos(angle) * radius
      lookY = 0.35 + t * 0.1
    } else if (p < 0.40) {
      /* Phase 2: Pull back and sweep to 3/4 rear (20-40%) */
      const t = (p - 0.20) / 0.20
      const angle = Math.PI + 0.1 + t * 0.5 /* Gradual sweep */
      const radius = 3.5 + t * 1.0 /* Continue pulling back */
      const height = 0.7 + t * 0.5
      
      targetX = Math.sin(angle) * radius
      targetY = height
      targetZ = Math.cos(angle) * radius
      lookY = 0.45 + t * 0.1
    } else if (p < 0.60) {
      /* Phase 3: Continue around to front-side (40-60%) */
      const t = (p - 0.40) / 0.20
      const angle = Math.PI + 0.6 + t * 0.8 /* Sweep to front */
      const radius = 4.5 + t * 0.3
      const height = 1.2 + t * 0.3
      
      targetX = Math.sin(angle) * radius
      targetY = height
      targetZ = Math.cos(angle) * radius
      lookY = 0.55
    } else if (p < 0.80) {
      /* Phase 4: Side profile shot (60-80%) */
      const t = (p - 0.60) / 0.20
      const angle = Math.PI + 1.4 + t * 0.5 /* Side view */
      const radius = 4.8
      const height = 1.5 + t * 0.3
      
      targetX = Math.sin(angle) * radius
      targetY = height
      targetZ = Math.cos(angle) * radius
      lookY = 0.55 + t * 0.1
    } else {
      /* Phase 5: Rise to elevated 3/4 shot (80-100%) */
      const t = (p - 0.80) / 0.20
      const angle = Math.PI + 1.9 + t * 0.4
      const radius = 4.8 - t * 0.5
      const height = 1.8 + t * 1.5 /* Rise up for dramatic reveal */
      
      targetX = Math.sin(angle) * radius
      targetY = height
      targetZ = Math.cos(angle) * radius
      lookY = 0.65 - t * 0.15
    }
    
    /* Add subtle mouse influence for interactive feel */
    const mouseInfluence = 0.2
    targetX += mouseX * mouseInfluence
    targetY += mouseY * mouseInfluence * 0.3
    
    /* When fading out (scrolling down to contact), bring camera closer */
    if (fadeOut < 1) {
      const zoomIn = 1 - fadeOut // 0 to 1 as we fade out
      const zoomFactor = 1 - (zoomIn * 0.4) // Reduce distance by up to 40%
      targetX *= zoomFactor
      targetZ *= zoomFactor
      targetY *= (1 - zoomIn * 0.2) // Also lower camera slightly
    }
    
    /* Smoother camera movement with optimized lerp */
    const lerpFactor = 0.06
    camera.position.x += (targetX - camera.position.x) * lerpFactor
    camera.position.y += (targetY - camera.position.y) * lerpFactor
    camera.position.z += (targetZ - camera.position.z) * lerpFactor
    
    camera.lookAt(0, lookY, 0)
  })

  return null
}

/* ═══ Main Scene ═══ */
interface GarageSceneProps {
  progress: number
  fadeOut?: number // 1 = fully visible, 0 = invisible
}

function SceneContent({ progress, fadeOut = 1, mouseX, mouseY }: GarageSceneProps & { mouseX: number; mouseY: number }) {
  /* Floor fades in first, and everything fades out with fadeOut */
  const floorOpacity = Math.min(1, Math.max(0, progress * 8)) * fadeOut
  
  return (
    <>
      <fog attach="fog" args={["#000000", 12, 35]} />
      <color attach="background" args={["#000000"]} />

      <CameraController progress={progress} fadeOut={fadeOut} mouseX={mouseX} mouseY={mouseY} />
      <LightingRig progress={progress} />

      <Environment preset="warehouse" environmentIntensity={0.5} backgroundIntensity={0} />

      <GarageFloor opacity={floorOpacity} />
      <FloorGrid opacity={floorOpacity} />
      <DustParticles count={150} />
      
      {/* Car appears after floor */}
      {progress > 0.02 && <CarModel progress={progress} fadeOut={fadeOut} mouseX={mouseX} mouseY={mouseY} />}
    </>
  )
}

export default function GarageScene({ progress, fadeOut = 1 }: GarageSceneProps) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    setMouse({ x, y })
  }

  return (
    <div 
      className="fixed inset-0 w-full h-screen" 
      style={{ zIndex: 0 }}
      onMouseMove={handleMouseMove}
    >
      <Canvas
        shadows
        camera={{ position: [0, 0.5, 2.5], fov: 42, near: 0.1, far: 60 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 2.2,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={[1, 1.5]}
        frameloop="always"
        performance={{ min: 0.5, max: 1 }}
        style={{ background: "#000000" }}
      >
        <SceneContent progress={progress} fadeOut={fadeOut} mouseX={mouse.x} mouseY={mouse.y} />
      </Canvas>
    </div>
  )
}

useGLTF.preload("/models/mclaren-w1.glb")

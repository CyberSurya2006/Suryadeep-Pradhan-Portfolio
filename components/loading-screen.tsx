"use client"

import { useState, useEffect, useRef } from "react"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

const loadingSteps = [
  "Initializing systems...",
  "Loading 3D engine...",
  "Preparing 3D models...",
  "Calibrating lighting...",
  "Rendering environment...",
  "Ready to launch",
]

interface LoadingScreenProps {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)
  const loaderRef = useRef<GLTFLoader | null>(null)

  useEffect(() => {
    const preloadModel = async () => {
      try {
        if (!loaderRef.current) {
          loaderRef.current = new GLTFLoader()
        }

        await new Promise<void>((resolve, reject) => {
          loaderRef.current!.load(
            "/models/mclaren-w1.glb",
            () => resolve(),
            undefined,
            () => reject()
          )
        })

        await new Promise(r => setTimeout(r, 800))
        setModelLoaded(true)
      } catch {
        setTimeout(() => setModelLoaded(true), 2000)
      }
    }
    preloadModel()
  }, [])

  useEffect(() => {
    const stepDuration = 500
    const totalSteps = loadingSteps.length

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1
        setProgress(Math.min(100, (next / totalSteps) * 100))

        if (next >= totalSteps) {
          clearInterval(interval)
          const checkAndComplete = () => {
            if (modelLoaded) {
              setIsExiting(true)
              setTimeout(onComplete, 600)
            } else {
              setTimeout(checkAndComplete, 100)
            }
          }
          setTimeout(checkAndComplete, 300)
        }
        return next
      })
    }, stepDuration)

    return () => clearInterval(interval)
  }, [onComplete, modelLoaded])

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-all duration-600 ${isExiting ? "opacity-0 scale-105" : "opacity-100 scale-100"
        }`}
    >
      <div className="mb-12 flex flex-col items-center gap-2">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-lg tracking-[0.3em] uppercase text-foreground">
            SURYADEEP PRADHAN
          </span>
        </div>
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
          Developer Portfolio
        </p>
      </div>

      <div className="w-64 mb-6">
        <div className="h-[2px] w-full bg-border/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-400 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="h-6 flex items-center">
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground transition-opacity duration-300">
          {loadingSteps[Math.min(currentStep, loadingSteps.length - 1)]}
        </p>
      </div>

      <p className="mt-4 font-mono text-2xl font-light text-primary">
        {Math.round(progress)}%
      </p>
    </div>
  )
}

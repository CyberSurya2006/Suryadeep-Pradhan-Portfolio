"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  hue: number
  wobbleOffset: number
  wobbleSpeed: number
}

export default function ParticleDust() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // Initialize particles - reduced count for smoother performance
    const particleCount = 60
    particlesRef.current = []
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.8,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: -Math.random() * 0.3 - 0.08,
        opacity: Math.random() * 0.5 + 0.2,
        hue: 25 + Math.random() * 20,
        wobbleOffset: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.002 + 0.001,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((p) => {
        // Update position with gentle drift
        p.x += p.speedX
        p.y += p.speedY

        // Natural floating wobble
        p.wobbleOffset += p.wobbleSpeed
        p.x += Math.sin(p.wobbleOffset) * 0.3

        // Wrap around edges
        if (p.y < -20) {
          p.y = canvas.height + 20
          p.x = Math.random() * canvas.width
          p.opacity = Math.random() * 0.5 + 0.2
        }
        if (p.x < -20) p.x = canvas.width + 20
        if (p.x > canvas.width + 20) p.x = -20

        // Pulsing opacity
        const pulseOpacity = p.opacity * (0.8 + Math.sin(Date.now() * 0.001 + p.wobbleOffset) * 0.2)

        // Outer glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4)
        gradient.addColorStop(0, `hsla(${p.hue}, 95%, 60%, ${pulseOpacity * 0.8})`)
        gradient.addColorStop(0.3, `hsla(${p.hue}, 90%, 55%, ${pulseOpacity * 0.4})`)
        gradient.addColorStop(0.6, `hsla(${p.hue}, 85%, 50%, ${pulseOpacity * 0.1})`)
        gradient.addColorStop(1, `hsla(${p.hue}, 80%, 45%, 0)`)
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Core particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${pulseOpacity})`
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 55 }}
    />
  )
}

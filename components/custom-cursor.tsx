"use client"

import { useEffect, useRef, useState } from "react"

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isHoveringText, setIsHoveringText] = useState(false)
  const mousePos = useRef({ x: 0, y: 0 })
  const cursorPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      
      // Instant position for dot
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${e.clientX}px`
        cursorDotRef.current.style.top = `${e.clientY}px`
      }
    }

    // Smooth follow animation for outer ring
    const animate = () => {
      if (cursorRef.current) {
        cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15
        cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15
        
        cursorRef.current.style.left = `${cursorPos.current.x}px`
        cursorRef.current.style.top = `${cursorPos.current.y}px`
      }
      requestAnimationFrame(animate)
    }

    // Detect hoverable elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isClickable = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor-hover]')
      const isText = target.closest('h1, h2, h3, h4, h5, h6, p, span, [data-cursor-text]')
      
      setIsHovering(!!isClickable)
      setIsHoveringText(!!isText && !isClickable)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseover", handleMouseOver)
    animate()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseover", handleMouseOver)
    }
  }, [])

  return (
    <>
      {/* Hide default cursor */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
        @media (max-width: 768px) {
          * {
            cursor: auto !important;
          }
        }
      `}</style>
      
      {/* Outer ring with blur/distortion effect */}
      <div
        ref={cursorRef}
        className={`fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out hidden md:block ${
          isHoveringText 
            ? "w-20 h-20 backdrop-blur-[2px] bg-primary/5 rounded-full mix-blend-difference" 
            : isHovering 
              ? "w-12 h-12" 
              : "w-8 h-8"
        }`}
        style={{
          border: isHoveringText 
            ? "1px solid rgba(232, 155, 54, 0.3)" 
            : isHovering 
              ? "2px solid rgba(232, 155, 54, 0.8)" 
              : "1px solid rgba(232, 155, 54, 0.5)",
          borderRadius: "50%",
          boxShadow: isHovering 
            ? "0 0 20px rgba(232, 155, 54, 0.3)" 
            : "0 0 10px rgba(232, 155, 54, 0.1)",
        }}
      />
      
      {/* Center dot */}
      <div
        ref={cursorDotRef}
        className={`fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-100 hidden md:block ${
          isHoveringText 
            ? "w-1 h-1 bg-primary/50" 
            : isHovering 
              ? "w-2 h-2 bg-primary scale-150" 
              : "w-1.5 h-1.5 bg-primary"
        }`}
      />
    </>
  )
}

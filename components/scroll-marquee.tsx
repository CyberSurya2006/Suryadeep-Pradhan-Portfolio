"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface ScrollMarqueeProps {
  topText?: string
  bottomText?: string
}

export default function ScrollMarquee({ 
  topText = "PRECISION ENGINEERING",
  bottomText = "CRAFTED WITH PURPOSE"
}: ScrollMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const topRowRef = useRef<HTMLDivElement>(null)
  const bottomRowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !topRowRef.current || !bottomRowRef.current) return

    const ctx = gsap.context(() => {
      // Top row moves right on scroll down
      gsap.to(topRowRef.current, {
        x: "15%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      })

      // Bottom row moves left on scroll down
      gsap.to(bottomRowRef.current, {
        x: "-25%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      })
    })

    return () => ctx.revert()
  }, [])

  // Repeat text more times for seamless looping
  const repeatedTopText = Array(8).fill(topText).join("   •   ")
  const repeatedBottomText = Array(8).fill(bottomText).join("   •   ")

  return (
    <div 
      ref={containerRef} 
      className="relative py-12 overflow-hidden select-none"
    >
      {/* Top row - moves right - more visible */}
      <div 
        ref={topRowRef}
        className="whitespace-nowrap text-[clamp(2rem,6vw,5rem)] font-bold tracking-wider -translate-x-[20%]"
        style={{ 
          fontFamily: "var(--font-sans)",
          color: "rgba(255, 255, 255, 0.12)",
        }}
      >
        {repeatedTopText}
      </div>
      
      {/* Bottom row - moves left - orange outline more visible */}
      <div 
        ref={bottomRowRef}
        className="whitespace-nowrap text-[clamp(2rem,6vw,5rem)] font-bold tracking-wider -translate-x-[5%] mt-4"
        style={{ 
          fontFamily: "var(--font-sans)",
          WebkitTextStroke: "1.5px rgba(232, 155, 54, 0.35)",
          color: "transparent",
        }}
      >
        {repeatedBottomText}
      </div>
    </div>
  )
}

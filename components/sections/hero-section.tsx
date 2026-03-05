"use client"

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { ChevronDown, X } from "lucide-react"
import Image from "next/image"

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const photoModalRef = useRef<HTMLDivElement>(null)
  
  const [showPhotoModal, setShowPhotoModal] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        nameRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out", delay: 0.3 }
      )
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power3.out", delay: 0.6 }
      )
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 1 }
      )
      gsap.fromTo(
        scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 1.8 }
      )
      gsap.to(scrollRef.current, {
        y: 8,
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: "power1.inOut",
        delay: 1.8,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Animate photo modal
  useEffect(() => {
    if (showPhotoModal && photoModalRef.current) {
      gsap.fromTo(
        photoModalRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power3.out" }
      )
    }
  }, [showPhotoModal])

  const handleNameClick = () => {
    setShowPhotoModal(true)
  }

  const closePhotoModal = () => {
    if (photoModalRef.current) {
      gsap.to(photoModalRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: "power3.in",
        onComplete: () => setShowPhotoModal(false)
      })
    }
  }

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen flex-col items-center justify-center"
    >
      {/* Full-screen photo modal */}
      {showPhotoModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md cursor-pointer"
          onClick={closePhotoModal}
        >
          <div 
            ref={photoModalRef}
            className="relative flex flex-col items-center gap-8 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              onClick={closePhotoModal}
              className="absolute -top-2 -right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-black/80 text-primary hover:bg-primary/20 transition-all duration-300"
            >
              <X className="h-5 w-5" />
            </button>
            
            {/* Photo with reveal animation */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-primary/40 shadow-2xl shadow-primary/30">
              <div className="relative w-72 h-80 md:w-80 md:h-96">
                <Image
                  src="/images/suryadeep.jpg"
                  alt="Suryadeep Pradhan"
                  fill
                  className="object-cover"
                  style={{ filter: "grayscale(100%) contrast(1.15) brightness(1.1)" }}
                  priority
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                {/* Orange accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
              </div>
            </div>
            
            {/* Name below photo */}
            <div className="text-center">
              <h3 className="font-mono text-xs tracking-[0.4em] uppercase text-primary/70 mb-2">
                THE ENGINEER
              </h3>
              <p className="font-sans text-2xl font-bold tracking-wide text-foreground">
                Suryadeep Pradhan
              </p>
              <p className="font-mono text-xs text-muted-foreground mt-2">
                Click anywhere to close
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center">
        {/* Greeting and Big Name */}
        <div className="flex flex-col items-center gap-3">
          <span className="font-mono text-xs tracking-[0.4em] uppercase text-muted-foreground">
            Hi, I am
          </span>
          <h2
            ref={nameRef}
            onClick={handleNameClick}
            className="font-sans text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-primary opacity-0 hover:text-primary/90 transition-all duration-300 cursor-pointer select-none"
            style={{ 
              fontFamily: "var(--font-sans)",
              textShadow: "0 0 80px rgba(232, 155, 54, 0.5), 0 0 120px rgba(232, 155, 54, 0.3)",
              letterSpacing: "-0.02em",
            }}
          >
            SURYADEEP PRADHAN
          </h2>
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary/50 hover:text-primary/70 transition-colors duration-300 cursor-pointer">
            [ CLICK TO REVEAL ]
          </span>
        </div>
        
        {/* Tagline */}
        <p className="font-mono text-[11px] tracking-[0.35em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 cursor-default mt-4">
          PERFORMANCE IS NOT ACCIDENTAL
        </p>
        
        {/* Main headline */}
        <h1
          ref={titleRef}
          className="mt-6 font-sans text-5xl font-light tracking-tight text-foreground opacity-0 md:text-7xl lg:text-8xl"
          style={{ letterSpacing: "-0.03em", lineHeight: "1.1" }}
        >
          <span className="hover:text-foreground/80 transition-colors duration-300 cursor-default">It is</span>{" "}
          <span className="font-semibold text-primary drop-shadow-[0_0_30px_rgba(232,165,10,0.3)] hover:drop-shadow-[0_0_40px_rgba(232,165,10,0.5)] transition-all duration-300 cursor-default">engineered</span>.
        </h1>
        
        {/* Role description */}
        <p
          ref={subtitleRef}
          className="mt-4 max-w-2xl font-sans text-lg font-light leading-relaxed text-foreground/70 opacity-0 md:text-xl"
        >
          <span className="hover:text-foreground transition-colors duration-300 cursor-default">Full Stack Developer</span>
          <span className="text-primary mx-3">|</span>
          <span className="hover:text-foreground transition-colors duration-300 cursor-default">System Architect</span>
          <span className="text-primary mx-3">|</span>
          <span className="hover:text-foreground transition-colors duration-300 cursor-default">Performance Optimizer</span>
        </p>
      </div>
      
      <div
        ref={scrollRef}
        className="absolute bottom-12 flex flex-col items-center gap-2 opacity-0"
      >
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300 cursor-default">
          Scroll to reveal assembly
        </span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </div>
    </section>
  )
}

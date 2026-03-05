"use client"

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const roles = [
  {
    title: "Full Stack Developer",
    subtitle: "End-to-end system delivery",
  },
  {
    title: "System Architect",
    subtitle: "Scalable infrastructure design",
  },
  {
    title: "Performance Optimizer",
    subtitle: "Speed and efficiency engineering",
  },
]

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the section while cards reveal
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=180%",
        pin: containerRef.current,
        pinSpacing: true,
      })

      // Line animation
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
        }
      )

      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 40%",
            scrub: 1,
          },
        }
      )

      // Text animation
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "top 30%",
            scrub: 1,
          },
        }
      )

      // Cards reveal one by one while pinned with slide up animation
      const cards = cardsRef.current?.children
      if (cards) {
        Array.from(cards).forEach((card, i) => {
          gsap.fromTo(
            card,
            { 
              opacity: 0, 
              y: 60, 
              scale: 0.9,
              rotateX: 15,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: `top+=${i * 18}% top`,
                end: `top+=${(i + 1) * 18}% top`,
                scrub: 1,
              },
            }
          )
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // 3D tilt effect on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (hoveredIndex !== index) return
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 30
    const rotateY = (centerX - x) / 30

    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    card.style.transform = "perspective(600px) rotateX(0) rotateY(0) scale(1)"
    setHoveredIndex(null)
  }

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-[230vh]"
    >
      <div
        ref={containerRef}
        className="flex min-h-screen items-start pt-16 md:pt-20 px-6 md:px-16 lg:px-24"
      >
        <div className="relative z-10 mx-auto w-full max-w-5xl">
          <div
            ref={lineRef}
            className="mb-8 h-px origin-left bg-primary/40"
            style={{ transform: "scaleX(0)" }}
          />
          <p className="mb-4 font-mono text-[11px] tracking-[0.35em] uppercase text-primary hover:text-primary/80 transition-colors duration-300 cursor-default">
            EVERY SYSTEM BEGINS WITH STRUCTURE
          </p>
          <h2
            ref={titleRef}
            className="mb-12 font-sans text-5xl font-semibold tracking-tight text-foreground opacity-0 md:text-6xl hover:text-foreground/90 transition-colors duration-300 cursor-default"
            style={{ letterSpacing: "-0.025em" }}
          >
            Foundation
          </h2>
          <div
            ref={textRef}
            className="grid gap-8 opacity-0 md:grid-cols-2"
          >
            <div className="flex flex-col gap-4">
              <p className="text-lg leading-relaxed text-foreground/90 md:text-xl hover:text-foreground transition-colors duration-300 cursor-default">
                I design scalable digital systems with precision and intention.
                Clean foundations. Strong architecture. Reliable execution.
              </p>
              <p className="text-lg leading-relaxed text-foreground/90 md:text-xl hover:text-foreground transition-colors duration-300 cursor-default">
                My development process focuses on performance, maintainability,
                and scalability — building systems that grow without breaking.
              </p>
            </div>
            <div ref={cardsRef} className="flex flex-col gap-4" style={{ perspective: "800px" }}>
              {roles.map((role, index) => (
                <div
                  key={role.title}
                  onMouseMove={(e) => handleMouseMove(e, index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={handleMouseLeave}
                  className="group flex items-center gap-4 rounded-lg border border-border/30 bg-card/20 p-5 backdrop-blur-sm cursor-default"
                  style={{
                    transition: "transform 0.15s ease-out, border-color 0.3s, background-color 0.3s",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Animated gradient overlay */}
                  <div 
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ transform: "translateZ(1px)" }}
                  />
                  
                  <div className="relative h-2 w-2 rounded-full bg-primary group-hover:scale-150 transition-transform duration-300" style={{ transform: "translateZ(10px)" }} />
                  <div className="relative" style={{ transform: "translateZ(15px)" }}>
                    <p className="font-sans text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                      {role.title}
                    </p>
                    <p className="font-mono text-xs text-foreground/70 group-hover:text-foreground/85 transition-colors duration-300">
                      {role.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

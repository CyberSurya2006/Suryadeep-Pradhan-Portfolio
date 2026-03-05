"use client"

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Monitor, Server, Database, BrainCircuit, Bug } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const skills = [
  {
    icon: Monitor,
    title: "Frontend Engineering",
    description: "React, Next.js, Tailwind, Animation Systems",
    detail: "Optimized rendering, smooth animations, accessibility-aware UI",
  },
  {
    icon: Server,
    title: "Backend Architecture",
    description: "Node.js, Express, REST APIs, Authentication",
    detail: "Scalable services, role-based systems, caching strategies",
  },
  {
    icon: Database,
    title: "Data Systems",
    description: "PostgreSQL, MongoDB, Query Optimization",
    detail: "Database indexing, migration pipelines, data integrity",
  },
  {
    icon: BrainCircuit,
    title: "AI Integration",
    description: "OpenAI APIs, Automation Pipelines",
    detail: "Intelligent workflows, ML-powered features, prompt engineering",
  },
  {
    icon: Bug,
    title: "Debugging & Optimization",
    description: "Error Tracking, Performance Fixes",
    detail: "Identifying issues and improving application reliability",
}
]

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the section while cards reveal
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=250%",
        pin: containerRef.current,
        pinSpacing: true,
      })

      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 40%",
            scrub: 1,
          },
        }
      )

      // Cards reveal one by one while pinned with stagger
      const cards = cardsRef.current?.children
      if (cards) {
        Array.from(cards).forEach((card, i) => {
          gsap.fromTo(
            card,
            { 
              opacity: 0, 
              y: 80, 
              scale: 0.85,
              rotateX: 20,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: `top+=${i * 15}% top`,
                end: `top+=${(i + 1) * 15}% top`,
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
    const rotateX = (y - centerY) / 35
    const rotateY = (centerX - x) / 35

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    card.style.transform = "perspective(800px) rotateX(0) rotateY(0) scale(1)"
    setHoveredIndex(null)
  }

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative min-h-[300vh]"
    >
      <div
        ref={containerRef}
        className="flex min-h-screen items-center px-6 py-20 md:px-16 lg:px-24"
      >
        <div className="relative z-10 mx-auto w-full max-w-5xl">
          <p className="mb-4 font-mono text-[11px] tracking-[0.35em] uppercase text-primary hover:text-primary/80 transition-colors duration-300 cursor-default">
            THE ENGINE THAT POWERS EVERYTHING
          </p>
          <h2
            ref={titleRef}
            className="mb-12 font-sans text-5xl font-semibold tracking-tight text-foreground opacity-0 md:text-6xl hover:text-foreground/90 transition-colors duration-300 cursor-default"
            style={{ letterSpacing: "-0.025em" }}
          >
            Core Systems
          </h2>
          <div
            ref={cardsRef}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            style={{ perspective: "1000px" }}
          >
            {skills.map((skill, index) => {
              const Icon = skill.icon
              return (
                <div
                  key={skill.title}
                  onMouseMove={(e) => handleMouseMove(e, index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={handleMouseLeave}
                  className="group relative overflow-hidden rounded-lg border border-border/30 bg-card/20 p-5 backdrop-blur-sm cursor-default"
                  style={{
                    transition: "transform 0.15s ease-out, border-color 0.3s, background-color 0.3s",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Animated gradient overlay */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-primary/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ transform: "translateZ(1px)" }}
                  />
                  
                  {/* Glowing border effect */}
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      boxShadow: "inset 0 0 15px rgba(232, 165, 10, 0.08)",
                    }}
                  />

                  <div className="relative flex flex-col gap-4" style={{ transform: "translateZ(20px)" }}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border/40 bg-secondary/50 group-hover:border-primary/50 group-hover:bg-primary/15 transition-all duration-300 group-hover:scale-110">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="font-sans text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {skill.title}
                      </h3>
                    </div>
                    <p className="font-mono text-xs leading-relaxed text-foreground/90 group-hover:text-foreground transition-colors duration-300">
                      {skill.description}
                    </p>
                    <div className="h-px bg-border/30 group-hover:bg-primary/30 transition-colors duration-300" />
                    <p className="text-xs leading-relaxed text-foreground/75 group-hover:text-foreground/90 transition-colors duration-300">
                      {skill.detail}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { GraduationCap, Search, Briefcase } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const milestones = [
  {
    id: 1,
    icon: GraduationCap,
    label: "STUDENT",
    title: "Student Foundation",
    role: "Computer Science BTech",
    description: "Built core fundamentals in systems, logic, and architecture.",
    year: "2025",
    tech: ["Python", "Java", "C++", "DSA"],
  },
  {
    id: 2,
    icon: Search,
    label: "EXPLORATION",
    title: "Exploration Phase",
    role: "Self-Learning & Projects",
    description: "Exploring web technologies, AI/ML, and building side projects.",
    year: "2025",
    tech: ["React", "Next.js", "TensorFlow"],
  },
  {
    id: 3,
    icon: Briefcase,
    label: "FREELANCING",
    title: "Freelance Phase",
    role: "Creative Developer",
    description: "Working with clients building performant web experiences.",
    year: "2026",
    tech: ["Full Stack", "UI/UX", "APIs"],
  },
]

export default function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const milestonesRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [trackProgress, setTrackProgress] = useState(0)

  // Use refs for tracking to avoid re-renders during scroll
  const lastActiveIndex = useRef(0)
  const rafId = useRef<number>(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the section
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=250%",
        pin: containerRef.current,
        pinSpacing: true,
        onUpdate: (self) => {
          // Use RAF to batch state updates and prevent jitter
          cancelAnimationFrame(rafId.current)
          rafId.current = requestAnimationFrame(() => {
            const progress = self.progress
            setTrackProgress(progress)

            // Determine active milestone
            const milestoneProgress = progress * milestones.length
            const newIndex = Math.min(Math.floor(milestoneProgress), milestones.length - 1)
            if (newIndex !== lastActiveIndex.current) {
              lastActiveIndex.current = newIndex
              setActiveIndex(newIndex)
            }
          })
        },
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

      // Milestone cards reveal with smooth timeline
      const cards = milestonesRef.current?.children
      if (cards) {
        const cardsTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 20%",
            end: "top -50%",
            scrub: 2,
          }
        })
        
        Array.from(cards).forEach((card, i) => {
          gsap.set(card, { opacity: 0, y: 60, scale: 0.9 })
          
          cardsTl.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
          }, i * 0.15)
        })
      }
    }, sectionRef)

    return () => {
      cancelAnimationFrame(rafId.current)
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative min-h-[300vh]"
    >
      <div
        ref={containerRef}
        className="flex min-h-screen flex-col justify-center px-6 py-20 md:px-16 lg:px-24"
      >
        <div className="relative z-10 mx-auto w-full max-w-6xl">
          {/* Header */}
          <div className="mb-16 flex items-end justify-between">
            <div>
              <p className="mb-4 font-mono text-[11px] tracking-[0.35em] uppercase text-primary">
                MY JOURNEY
              </p>
              <h2
                ref={titleRef}
                className="font-sans text-5xl font-semibold tracking-tight text-foreground opacity-0 md:text-6xl"
                style={{ letterSpacing: "-0.025em" }}
              >
                Built. Tested. Refined.
              </h2>
              <p className="mt-4 text-lg text-foreground/70">
                A timeline engineered through experience.
              </p>
            </div>
            <p className="hidden font-mono text-xs text-foreground/50 md:block">
              Scroll to progress &rarr;
            </p>
          </div>

          {/* Progress Track */}
          <div ref={trackRef} className="relative mb-20 h-32">
            {/* Background track line */}
            <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-foreground/10" />
            
            {/* Animated progress line */}
            <div 
              className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 transition-all duration-100"
              style={{ 
                width: `${trackProgress * 100}%`,
                background: "linear-gradient(90deg, #e8a50a 0%, #e8a50a 90%, transparent 100%)",
                boxShadow: "0 0 20px rgba(232, 165, 10, 0.6), 0 0 40px rgba(232, 165, 10, 0.3)"
              }}
            />

            {/* Milestone nodes */}
            {milestones.map((milestone, i) => {
              const position = ((i + 0.5) / milestones.length) * 100
              const isPassed = trackProgress * 100 >= position
              const isActive = i === activeIndex
              return (
                <div
                  key={milestone.id}
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{ left: `${position}%` }}
                >
                  {/* Year label above */}
                  <span className={`absolute -top-10 font-mono text-sm font-medium transition-all duration-500 whitespace-nowrap ${
                    isPassed ? "text-primary" : "text-foreground/30"
                  }`}>
                    {milestone.year}
                  </span>
                  
                  {/* Node - circular with border */}
                  <div
                    className={`relative h-5 w-5 rounded-full border-2 transition-all duration-500 ${
                      isPassed 
                        ? "border-primary bg-background" 
                        : "border-foreground/20 bg-background"
                    }`}
                    style={{
                      boxShadow: isPassed ? "0 0 20px rgba(232, 165, 10, 0.5)" : "none"
                    }}
                  >
                    {/* Inner dot when passed */}
                    {isPassed && (
                      <div className="absolute inset-[4px] rounded-full bg-primary" />
                    )}
                    {/* Pulse effect for active */}
                    {isActive && (
                      <div className="absolute inset-[-6px] animate-ping rounded-full bg-primary/20" style={{ animationDuration: "2s" }} />
                    )}
                  </div>
                  
                  {/* Label below */}
                  <span className={`absolute top-10 font-mono text-[10px] tracking-[0.15em] uppercase transition-all duration-500 whitespace-nowrap ${
                    isPassed ? "text-foreground/70" : "text-foreground/30"
                  }`}>
                    {milestone.label}
                  </span>
                </div>
              )
            })}

            {/* Moving indicator - centered on the line */}
            <div 
              className="absolute top-1/2 transition-all duration-75 pointer-events-none"
              style={{ 
                left: `${trackProgress * 100}%`,
                transform: "translateX(-50%) translateY(-50%)"
              }}
            >
              {/* Large outer glow */}
              <div className="absolute inset-[-16px] rounded-full bg-primary/10 blur-lg" />
              {/* Medium glow ring */}
              <div className="absolute inset-[-8px] rounded-full border border-primary/30" />
              {/* Main indicator circle */}
              <div 
                className="relative h-7 w-7 rounded-full border-2 border-primary bg-background"
                style={{
                  boxShadow: "0 0 30px rgba(232, 165, 10, 0.8), 0 0 60px rgba(232, 165, 10, 0.4)"
                }}
              >
                {/* Inner pulsing core */}
                <div className="absolute inset-[6px] rounded-full bg-primary animate-pulse" />
              </div>
            </div>
          </div>

          {/* Milestone cards */}
          <div ref={milestonesRef} className="grid gap-5 md:grid-cols-3">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon
              const isActive = index <= activeIndex
              return (
                <div
                  key={milestone.id}
                  className={`group relative overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-500 cursor-default hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 ${
                    isActive 
                      ? "border-primary/40 bg-card/30 hover:border-primary/60" 
                      : "border-border/20 bg-card/10 hover:border-border/40"
                  }`}
                >
                  {/* Glow effect when active */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                  )}

                  <div className="relative p-5">
                    {/* Icon and year */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 ${
                        isActive 
                          ? "border-primary/50 bg-primary/15" 
                          : "border-border/30 bg-secondary/20"
                        } border`}>
                        <Icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-foreground/40"}`} />
                      </div>
                      <span className={`font-mono text-xs ${isActive ? "text-primary" : "text-foreground/30"}`}>
                        {milestone.year}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className={`mb-1 font-sans text-base font-semibold transition-colors duration-300 ${
                      isActive ? "text-foreground" : "text-foreground/40"
                    }`}>
                      {milestone.title}
                    </h3>
                    <p className={`mb-3 font-mono text-[10px] ${isActive ? "text-primary/70" : "text-foreground/25"}`}>
                      {milestone.role}
                    </p>

                    {/* Description */}
                    <p className={`mb-4 text-xs leading-relaxed ${
                      isActive ? "text-foreground/70" : "text-foreground/30"
                    }`}>
                      {milestone.description}
                    </p>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-1.5">
                      {milestone.tech.map((t) => (
                        <span
                          key={t}
                          className={`rounded-full border px-2 py-0.5 font-mono text-[8px] transition-all duration-300 ${
                            isActive 
                              ? "border-border/30 bg-secondary/30 text-foreground/60" 
                              : "border-border/10 bg-secondary/10 text-foreground/20"
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Progress meter */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className="font-mono text-xs text-foreground/40">PROGRESS</span>
            <div className="h-1 w-24 overflow-hidden rounded-full bg-border/20">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-200"
                style={{ width: `${((activeIndex + 1) / milestones.length) * 100}%` }}
              />
            </div>
            <span className="font-mono text-xs text-primary">{activeIndex + 1}/{milestones.length}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

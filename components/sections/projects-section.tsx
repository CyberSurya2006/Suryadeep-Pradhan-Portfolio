"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowUpRight, Search, FileText, Zap } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    id: "01",
    icon: Search,
    title: "ReunifyAI",
    description:
      "AI-powered lost and found platform for real-world recovery. Uses computer vision and smart matching to reunite people with their belongings.",
    tech: ["TypeScript", "GeminiAPI", "Leaflet", "Supabase"],
    link: "https://reunify-eight.vercel.app/",
  },
  {
    id: "02",
    icon: FileText,
    title: "MedexplainAI",
    description:
      "Unlock instant medical report clarity using AI. Transforms complex medical terminology into easy-to-understand explanations.",
    tech: ["React", "GeminiAPI", "Tailwind CSS", "PostgreSQL"],
    link: "https://med-explain-ai-five.vercel.app/",
  },
  {
    id: "03",
    icon: Zap,
    title: "AI Automation Hub",
    description:
      "Intelligent workflow automation platform that streamlines repetitive tasks using AI agents and natural language commands.",
    tech: ["Next.js", "LangChain", "FastAPI", "Redis"],
    link: "https://github.com/CyberSurya2006",
  },
]

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Header reveal
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
        }
      )

      // Pin the section
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${projects.length * 60}%`,
        pin: containerRef.current,
        pinSpacing: true,
        scrub: 1,
      })

      // Cards animation
      cardsRef.current.forEach((card, i) => {
        if (!card) return

        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 80,
            scale: 0.92,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `top+=${i * 30}% top`,
              end: `top+=${i * 30 + 25}% top`,
              scrub: 1,
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative"
      style={{ minHeight: "220vh" }}
    >
      <div
        ref={containerRef}
        className="flex min-h-screen flex-col justify-center px-6 py-20 md:px-16 lg:px-24"
      >
        <div className="relative z-10 mx-auto w-full max-w-6xl">

          {/* Header */}
          <div ref={headerRef} className="mb-12 opacity-0">
            <p className="mb-3 font-mono text-[11px] tracking-[0.35em] uppercase text-primary">
              WIRED INTO THE INTELLIGENCE NETWORK
            </p>

            <h2
              className="font-sans text-4xl font-semibold tracking-tight text-foreground md:text-6xl"
              style={{ letterSpacing: "-0.025em" }}
            >
              Projects
            </h2>

            <p className="mt-4 text-lg text-foreground/60 max-w-xl">
              Systems built with precision engineering and intelligent design.
            </p>
          </div>

          {/* Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {projects.map((project, index) => {
              const Icon = project.icon

              return (
                <a
                  key={project.id}
                  ref={(el) => {
                    cardsRef.current[index] = el
                  }}
                  href={project.link}
                  target={project.link !== "#" ? "_blank" : undefined}
                  rel={project.link !== "#" ? "noopener noreferrer" : undefined}
                  className="group relative overflow-hidden rounded-2xl border border-border/30 bg-card/30 backdrop-blur-md transition-all duration-500 hover:border-primary/60 hover:bg-card/50 block"
                >
                  {/* Card number */}
                  <div className="absolute right-6 top-6 font-mono text-6xl font-bold text-foreground/5 group-hover:text-primary/10 transition-colors duration-500">
                    {project.id}
                  </div>

                  <div className="relative p-8">

                    {/* Icon */}
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-border/40 bg-secondary/50 group-hover:border-primary/50 group-hover:bg-primary/15 transition-all duration-500">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>

                    {/* Title */}
                    <h3 className="font-sans text-2xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-3">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-foreground/70 mb-6 min-h-[80px]">
                      {project.description}
                    </p>

                    {/* Tech */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-border/30 bg-secondary/30 px-3 py-1 font-mono text-[10px] tracking-wide text-foreground/60 group-hover:border-primary/30 group-hover:text-foreground/80 transition-all duration-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* View */}
                    <div className="flex items-center gap-2 text-sm text-foreground/50 group-hover:text-primary transition-colors duration-300">
                      <span className="font-mono text-xs">
                        View Project
                      </span>

                      <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Bottom gradient */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
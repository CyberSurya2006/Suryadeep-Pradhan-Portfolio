"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Github, Linkedin, Mail, ArrowUpRight, FileText, Download } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 40 },
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
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative flex min-h-screen items-center justify-center px-6 py-24 md:px-16"
    >
      <div
        ref={contentRef}
        className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-10 text-center opacity-0"
      >
        <div className="flex flex-col items-center gap-6">
          <p className="font-mono text-[11px] tracking-[0.35em] uppercase text-primary hover:text-primary/80 transition-colors duration-300 cursor-default">
            IGNITION SEQUENCE
          </p>
          <h2
            className="font-sans text-5xl font-semibold tracking-tight text-foreground md:text-7xl hover:text-foreground/90 transition-colors duration-300 cursor-default"
            style={{ letterSpacing: "-0.025em", lineHeight: "1.15" }}
          >
            <span className="hover:text-foreground/80 transition-colors duration-300">Ready to build</span>
            <br />
            <span className="hover:text-foreground/80 transition-colors duration-300">something</span>{" "}
            <span className="text-primary drop-shadow-[0_0_30px_rgba(232,165,10,0.2)] hover:drop-shadow-[0_0_40px_rgba(232,165,10,0.5)] transition-all duration-300">powerful</span>?
          </h2>
          <p className="mt-2 max-w-2xl text-lg leading-relaxed text-foreground/70 md:text-xl hover:text-foreground transition-colors duration-300 cursor-default">
            Building systems that scale. Engineering experiences that perform.
            Delivering products that endure.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="mailto:suryadeep.pradhan2006@gmail.com"
            className="group flex items-center gap-2 rounded-lg border border-primary bg-primary/15 px-6 py-3 font-sans text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary/25 hover:border-primary/80 hover:scale-105"
          >
            <Mail className="h-4 w-4" />
            Get in touch
            <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href="https://github.com/CyberSurya2006"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-lg border border-primary/30 px-6 py-3 font-sans text-sm font-medium text-foreground/70 transition-all duration-300 hover:border-primary/60 hover:text-primary hover:scale-105"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/suryadeep-pradhan-6459b5387/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-lg border border-primary/30 px-6 py-3 font-sans text-sm font-medium text-foreground/70 transition-all duration-300 hover:border-primary/60 hover:text-primary hover:scale-105"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </a>
          <a
            href="/resume.pdf"
            download="Suryadeep_Pradhan_Resume.pdf"
            className="group flex items-center gap-2 rounded-lg border border-primary/30 px-6 py-3 font-sans text-sm font-medium text-foreground/70 transition-all duration-300 hover:border-primary/60 hover:text-primary hover:scale-105"
          >
            <FileText className="h-4 w-4" />
            Resume
            <Download className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-100" />
          </a>
        </div>

        {/* Footer line */}
        <div className="mt-16 flex w-full flex-col items-center gap-4 border-t border-primary/15 pt-8">
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-foreground/50 hover:text-foreground/80 transition-colors duration-300 cursor-default">
            ENGINEERED WITH PRECISION
          </p>
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-foreground/30 hover:text-primary transition-colors duration-300 cursor-default">
            Suryadeep Pradhan | 2024
          </p>
        </div>
      </div>
    </section>
  )
}

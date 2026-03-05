"use client"

import { useRef, useState, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Navigation from "./navigation"
import ScrollProgress from "./scroll-progress"
import HeroSection from "./sections/hero-section"
import AboutSection from "./sections/about-section"
import SkillsSection from "./sections/skills-section"
import ProjectsSection from "./sections/projects-section"
import JourneySection from "./sections/journey-section"
import ContactSection from "./sections/contact-section"
import LoadingScreen from "./loading-screen"
import MusicPlayer from "./music-player"
import ParticleDust from "./particle-dust"
import GarageScene from "./three/garage-scene"
import CustomCursor from "./custom-cursor"
import ScrollMarquee from "./scroll-marquee"

gsap.registerPlugin(ScrollTrigger)

export default function Portfolio() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const carSectionRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [carProgress, setCarProgress] = useState(0)
  const [carFadeOut, setCarFadeOut] = useState(1) // 1 = fully visible, 0 = invisible
  const [isLoading, setIsLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const [showCar, setShowCar] = useState(false)

  useEffect(() => {
    if (!isReady) return

    // Prevent any scroll position changes during initialization
    const currentScroll = window.scrollY
    
    /* Smoother scroll settings */
    ScrollTrigger.config({
      limitCallbacks: true,
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    })

    // Disable scroll refresh temporarily to prevent reset
    ScrollTrigger.normalizeScroll(false)

    /* Main scroll progress for overall page - smoother scrub */
    const mainTrigger = ScrollTrigger.create({
      trigger: scrollContainerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 2,
      onUpdate: (self) => {
        setScrollProgress(self.progress)
      },
    })

    /* Car scene progress - starts at Foundation section - smoother scrub */
    const carTrigger = ScrollTrigger.create({
      trigger: carSectionRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: 1.8,
      onUpdate: (self) => {
        const prog = self.progress
        setCarProgress(prog)
        setShowCar(prog > 0 && prog < 1)
        
        // Smooth fade out in last 10% of car section
        if (prog > 0.90) {
          setCarFadeOut(Math.max(0, 1 - (prog - 0.90) / 0.10))
        } else {
          setCarFadeOut(1)
        }
      },
      onEnter: () => setShowCar(true),
      onLeaveBack: () => setShowCar(false),
    })

    // Single refresh after everything is set up, preserve scroll position
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh(true)
      // Restore scroll position if it changed
      if (window.scrollY !== currentScroll && currentScroll > 0) {
        window.scrollTo(0, currentScroll)
      }
    }, 150)

    return () => {
      mainTrigger.kill()
      carTrigger.kill()
      clearTimeout(refreshTimeout)
    }
  }, [isReady])

  const handleLoadingComplete = () => {
    setIsLoading(false)
    // Reset scroll position once at the start
    window.scrollTo(0, 0)
    // Small delay to let DOM settle before initializing ScrollTrigger
    requestAnimationFrame(() => {
      setIsReady(true)
    })
  }

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />
  }

  return (
    <div ref={scrollContainerRef} className="relative">
      {/* Custom cursor with distortion effect */}
      <CustomCursor />
      
      {/* Fixed 3D scene - only shows when in car section */}
      {showCar && <GarageScene progress={carProgress} fadeOut={carFadeOut} />}

      {/* Orange particle dust overlay */}
      <ParticleDust />

      {/* Fixed UI overlays */}
      <Navigation progress={scrollProgress} />
      <ScrollProgress progress={scrollProgress} />
      <MusicPlayer />

      {/* Top logo/name */}
      <div className="fixed left-6 top-6 z-50 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-foreground/70 hover:text-foreground transition-colors duration-300">
          Suryadeep Pradhan
        </span>
      </div>

      {/* Scrollable content overlay */}
      <div className="relative z-10">
        {/* Hero - plain black background */}
        <HeroSection />
        
        {/* Scrolling text marquee between hero and car section */}
        <ScrollMarquee 
          topText="PRECISION ENGINEERING" 
          bottomText="CRAFTED WITH PURPOSE"
        />
        
        {/* Spacer before car section */}
        <div className="h-[20vh]" />
        
        {/* Car section wrapper - 3D car shows throughout these sections */}
        <div ref={carSectionRef}>
          <AboutSection />
          <div className="h-[40vh]" />
          <SkillsSection />
          <div className="h-[40vh]" />
          <ProjectsSection />
          <div className="h-[40vh]" />
          <JourneySection />
        </div>
        
        <div className="h-[30vh]" />
        <ContactSection />
      </div>
    </div>
  )
}

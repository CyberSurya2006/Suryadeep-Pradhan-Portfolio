"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Volume2, VolumeX } from "lucide-react"

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hasAttemptedPlay = useRef(false)

  // Initialize audio on mount and attempt autoplay
  useEffect(() => {
    const audio = new Audio("/audio/background-music.mp3")
    audio.loop = true
    audio.volume = 0.12
    audio.preload = "auto"
    audioRef.current = audio

    // Function to attempt playing
    const attemptPlay = () => {
      if (hasAttemptedPlay.current) return
      hasAttemptedPlay.current = true
      
      audio.play().then(() => {
        setIsPlaying(true)
      }).catch(() => {
        // Browser blocked autoplay - start on first user interaction
        setIsPlaying(false)
        
        const startOnInteraction = () => {
          if (audioRef.current) {
            audioRef.current.play().then(() => {
              setIsPlaying(true)
            }).catch(() => {})
          }
          // Remove all listeners after first successful interaction
          document.removeEventListener("click", startOnInteraction)
          document.removeEventListener("touchstart", startOnInteraction)
          document.removeEventListener("scroll", startOnInteraction)
        }
        
        document.addEventListener("click", startOnInteraction, { once: true })
        document.addEventListener("touchstart", startOnInteraction, { once: true })
        document.addEventListener("scroll", startOnInteraction, { once: true })
      })
    }

    // Try to play immediately if audio is ready
    if (audio.readyState >= 3) {
      attemptPlay()
    } else {
      audio.addEventListener("canplaythrough", attemptPlay, { once: true })
    }

    // Handle tab visibility - pause when hidden, resume when visible
    const handleVisibilityChange = () => {
      if (audioRef.current) {
        if (document.hidden) {
          audioRef.current.pause()
        } else if (isPlaying) {
          audioRef.current.play().catch(() => {})
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      audio.pause()
      audio.src = ""
    }
  }, [])

  // Sync playing state with visibility
  useEffect(() => {
    const handleVisibility = () => {
      if (audioRef.current && !document.hidden && isPlaying) {
        audioRef.current.play().catch(() => {})
      }
    }
    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [isPlaying])

  const toggleMusic = useCallback(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {})
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  return (
    <button
      onClick={toggleMusic}
      className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 backdrop-blur-sm ${
        isPlaying
          ? "border-primary/50 bg-primary/20 text-primary"
          : "border-border/40 bg-card/30 text-muted-foreground hover:border-primary/30 hover:text-primary"
      } cursor-pointer hover:scale-105`}
      aria-label={isPlaying ? "Mute music" : "Play music"}
    >
      {isPlaying ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      {isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute h-full w-full animate-ping rounded-full border border-primary/20" />
        </div>
      )}
    </button>
  )
}

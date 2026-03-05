"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
]

interface NavigationProps {
  progress: number
}

export default function Navigation({ progress }: NavigationProps) {
  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState("")

  useEffect(() => {
    setVisible(progress > 0.05)
  }, [progress])

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) =>
        document.querySelector(item.href)
      )
      const scrollY = window.scrollY + window.innerHeight / 3

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && (section as HTMLElement).offsetTop <= scrollY) {
          setActive(navItems[i].href)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        "fixed right-6 top-1/2 z-50 flex -translate-y-1/2 flex-col items-end gap-4 transition-all duration-700",
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
      )}
    >
      {navItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="group flex items-center gap-3"
          onClick={(e) => {
            e.preventDefault()
            document.querySelector(item.href)?.scrollIntoView({
              behavior: "smooth",
            })
          }}
        >
          <span
            className={cn(
              "font-mono text-[10px] tracking-[0.2em] uppercase transition-all duration-300",
              active === item.href
                ? "text-primary opacity-100"
                : "text-muted-foreground opacity-0 group-hover:opacity-100"
            )}
          >
            {item.label}
          </span>
          <div
            className={cn(
              "h-0.5 transition-all duration-300",
              active === item.href
                ? "w-8 bg-primary"
                : "w-4 bg-muted-foreground/30 group-hover:w-6 group-hover:bg-muted-foreground"
            )}
          />
        </a>
      ))}
    </nav>
  )
}

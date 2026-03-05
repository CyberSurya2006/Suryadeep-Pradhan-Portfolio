"use client"

import dynamic from "next/dynamic"

const Portfolio = dynamic(() => import("@/components/portfolio"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-primary" />
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">
          Loading systems
        </p>
      </div>
    </div>
  ),
})

export default function Page() {
  return (
    <main>
      <Portfolio />
    </main>
  )
}

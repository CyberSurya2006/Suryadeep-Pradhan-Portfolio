"use client"

interface ScrollProgressProps {
  progress: number
}

export default function ScrollProgress({ progress }: ScrollProgressProps) {
  const percentage = Math.round(progress * 100)

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
      {/* Circular progress */}
      <div className="relative h-10 w-10">
        <svg
          className="h-10 w-10 -rotate-90"
          viewBox="0 0 40 40"
          aria-hidden="true"
        >
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-border/30"
          />
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray={`${2 * Math.PI * 16}`}
            strokeDashoffset={`${2 * Math.PI * 16 * (1 - progress)}`}
            strokeLinecap="round"
            className="text-primary transition-all duration-100"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-mono text-[9px] text-muted-foreground">
          {percentage}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground">
          Assembly
        </span>
        <span className="font-mono text-[10px] text-primary">
          {progress < 0.05
            ? "STANDBY"
            : progress < 0.15
              ? "CHASSIS"
              : progress < 0.28
                ? "POWERTRAIN"
                : progress < 0.42
                  ? "WHEELS"
                  : progress < 0.58
                    ? "BODYWORK"
                    : progress < 0.72
                      ? "GLASS"
                      : progress < 0.85
                        ? "DETAILS"
                        : "COMPLETE"}
        </span>
      </div>
    </div>
  )
}

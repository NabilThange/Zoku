"use client"

import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

interface AnimatedGridPatternProps {
  numSquares?: number
  maxOpacity?: number
  duration?: number
  repeatDelay?: number
  width?: number
  height?: number
  strokeDasharray?: number[]
  className?: string
}

export function AnimatedGridPattern({
  numSquares = 30,
  maxOpacity = 0.1,
  duration = 3,
  repeatDelay = 1,
  width = 50,
  height = 50,
  strokeDasharray = [2, 8],
  className,
}: AnimatedGridPatternProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const squares: Array<{
      x: number
      y: number
      size: number
      opacity: number
      animationOffset: number
    }> = []

    // Initialize squares with grid-like positioning
    const cols = Math.ceil((canvas.width / window.devicePixelRatio) / width)
    const rows = Math.ceil((canvas.height / window.devicePixelRatio) / height)
    
    for (let i = 0; i < numSquares; i++) {
      const gridX = (i % cols) * width + (Math.random() - 0.5) * width * 0.5
      const gridY = Math.floor(i / cols) * height + (Math.random() - 0.5) * height * 0.5
      
      squares.push({
        x: gridX,
        y: gridY,
        size: Math.random() * 15 + 5, // Smaller squares for grid effect
        opacity: 0,
        animationOffset: Math.random() * (duration + repeatDelay) * 1000,
      })
    }

    const startTime = Date.now()

    const animate = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime

      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio)

      squares.forEach((square) => {
        const cycleTime = (duration + repeatDelay) * 1000
        const localTime = (elapsed + square.animationOffset) % cycleTime
        const animationProgress = Math.min(localTime / (duration * 1000), 1)

        if (localTime < duration * 1000) {
          // Fade in and out with sine wave for smooth animation
          square.opacity = maxOpacity * Math.sin(animationProgress * Math.PI)
        } else {
          square.opacity = 0
        }

        // Draw dashed squares if strokeDasharray is provided
        if (strokeDasharray && strokeDasharray.length > 0) {
          ctx.setLineDash(strokeDasharray)
          ctx.strokeStyle = `rgba(255, 107, 53, ${square.opacity})`
          ctx.lineWidth = 1
          ctx.strokeRect(square.x, square.y, square.size, square.size)
        } else {
          // Draw filled squares
          ctx.fillStyle = `rgba(255, 107, 53, ${square.opacity})`
          ctx.fillRect(square.x, square.y, square.size, square.size)
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [numSquares, maxOpacity, duration, repeatDelay, width, height, strokeDasharray])

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 h-full w-full pointer-events-none", className)}
      style={{ width: "100%", height: "100%" }}
    />
  )
}

export function AnimatedGridPatternDemo() {
  return (
    <div className="relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-lg border bg-background p-20">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
      />
    </div>
  )
}

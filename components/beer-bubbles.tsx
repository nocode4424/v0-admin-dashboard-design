"use client"

import { useEffect, useRef } from "react"

export function BeerBubbles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const bubbles: Bubble[] = []
    const bubbleCount = Math.floor(canvas.width / 10)

    class Bubble {
      x: number
      y: number
      radius: number
      speed: number
      opacity: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = canvas.height + Math.random() * 100
        this.radius = Math.random() * 8 + 2
        this.speed = Math.random() * 3 + 1
        this.opacity = Math.random() * 0.5 + 0.1
      }

      draw() {
        if (!ctx) return

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 220, 150, ${this.opacity})`
        ctx.fill()
      }

      update() {
        this.y -= this.speed

        if (this.y < -this.radius * 2) {
          this.y = canvas.height + this.radius
          this.x = Math.random() * canvas.width
        }

        this.draw()
      }
    }

    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push(new Bubble())
    }

    function animate() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      bubbles.forEach((bubble) => {
        bubble.update()
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" aria-hidden="true" />
  )
}

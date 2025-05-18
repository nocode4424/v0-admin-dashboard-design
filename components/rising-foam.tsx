"use client"

import { useEffect, useRef } from "react"

export function RisingFoam() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    class Bubble {
      x: number
      y: number
      radius: number
      speed: number
      opacity: number
      wobble: number
      wobbleSpeed: number
      wobbleDirection: number
      maxY: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = canvas.height + Math.random() * 100
        this.radius = Math.random() * 15 + 5
        this.speed = Math.random() * 2 + 1
        this.opacity = Math.random() * 0.4 + 0.2
        this.wobble = 0
        this.wobbleSpeed = Math.random() * 0.03 + 0.01
        this.wobbleDirection = Math.random() > 0.5 ? 1 : -1
        // Make bubbles stop at different heights to create foam effect at top
        this.maxY = Math.random() * 100 + 50
      }

      draw() {
        if (!ctx) return

        // Apply wobble effect
        this.wobble += this.wobbleSpeed * this.wobbleDirection
        if (Math.abs(this.wobble) > 1) {
          this.wobbleDirection *= -1
        }

        const wobbleX = this.x + Math.sin(this.wobble) * 3

        ctx.beginPath()
        ctx.arc(wobbleX, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 250, 240, ${this.opacity})`
        ctx.fill()
      }

      update() {
        // Only move up if not at max height
        if (this.y > this.maxY) {
          this.y -= this.speed
        }

        // If bubble reaches its max height, make it slightly wobble in place
        if (this.y <= this.maxY) {
          this.y = this.maxY + Math.sin(Date.now() * 0.001 + this.x) * 2
        }

        this.draw()
      }
    }

    const bubbles: Bubble[] = []
    const bubbleCount = Math.floor(canvas.width / 5) // More bubbles for denser foam

    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push(new Bubble())
    }

    function animate() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      bubbles.forEach((bubble) => {
        bubble.update()
      })

      // Add new bubbles occasionally
      if (Math.random() > 0.9) {
        bubbles.push(new Bubble())

        // Remove a bubble if there are too many (performance)
        if (bubbles.length > bubbleCount * 1.5) {
          bubbles.shift()
        }
      }

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

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-10" aria-hidden="true" />
}

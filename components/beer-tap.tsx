"use client"

import { useEffect, useRef } from "react"

export function BeerTap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = 300

    // Beer colors
    const beerColor = "#f59e0b"
    const foamColor = "#fef3c7"

    // Beer flow parameters
    let flowWidth = canvas.width * 0.1
    let flowHeight = 0
    let maxFlowHeight = canvas.height * 0.7
    let foamHeight = 0
    let maxFoamHeight = canvas.height * 0.3
    const isPouring = true

    // Foam bubbles
    const bubbles: Bubble[] = []

    class Bubble {
      x: number
      y: number
      radius: number
      speed: number

      constructor(x: number, y: number) {
        this.x = x + (Math.random() * flowWidth - flowWidth / 2)
        this.y = y
        this.radius = Math.random() * 5 + 2
        this.speed = Math.random() * 2 + 0.5
      }

      draw() {
        if (!ctx) return

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 243, 199, 0.7)"
        ctx.fill()
      }

      update() {
        this.y -= this.speed

        if (this.y < canvas.height - maxFlowHeight - maxFoamHeight) {
          return false
        }

        this.draw()
        return true
      }
    }

    function drawBeerFlow() {
      if (!ctx) return

      // Draw beer stream
      ctx.fillStyle = beerColor
      ctx.beginPath()
      ctx.rect(canvas.width / 2 - flowWidth / 2, 0, flowWidth, flowHeight)
      ctx.fill()

      // Draw foam
      ctx.fillStyle = foamColor
      ctx.beginPath()
      ctx.ellipse(canvas.width / 2, flowHeight, flowWidth * 0.7, foamHeight, 0, 0, Math.PI * 2)
      ctx.fill()

      // Add bubbles occasionally
      if (Math.random() > 0.7 && isPouring) {
        bubbles.push(new Bubble(canvas.width / 2, flowHeight - 10))
      }

      // Update and draw bubbles
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const stillActive = bubbles[i].update()
        if (!stillActive) {
          bubbles.splice(i, 1)
        }
      }
    }

    function animate() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Make beer always pour
      if (flowHeight < maxFlowHeight) {
        flowHeight += 5
      } else {
        // Reset flow height to create continuous effect
        flowHeight = maxFlowHeight * 0.7
      }

      // Keep foam growing
      if (foamHeight < maxFoamHeight) {
        foamHeight += 0.5
      }

      drawBeerFlow()

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = 300
      flowWidth = canvas.width * 0.1
      maxFlowHeight = canvas.height * 0.7
      maxFoamHeight = canvas.height * 0.3
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-[300px]" aria-hidden="true" />
}

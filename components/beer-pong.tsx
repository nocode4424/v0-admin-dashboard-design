"use client"

import { useEffect, useRef, useState } from "react"

export function BeerPong() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    // Beer pong table
    const tableWidth = canvas.width * 0.9
    const tableHeight = canvas.height * 0.6
    const tableX = (canvas.width - tableWidth) / 2
    const tableY = canvas.height - tableHeight - 20

    // Cups
    const cupRadius = tableWidth / 20
    const cups: Cup[] = []

    // Ball
    let ball: Ball | null = null

    class Cup {
      x: number
      y: number
      radius: number
      color: string
      hit: boolean

      constructor(x: number, y: number, radius: number, color: string) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.hit = false
      }

      draw() {
        if (!ctx) return

        if (!this.hit) {
          // Cup body
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI, true)
          ctx.lineTo(this.x - this.radius * 0.8, this.y + this.radius * 1.2)
          ctx.arc(this.x, this.y + this.radius * 1.2, this.radius * 0.8, Math.PI, 0, true)
          ctx.lineTo(this.x + this.radius, this.y)
          ctx.fillStyle = this.color
          ctx.fill()
          ctx.strokeStyle = "#f59e0b"
          ctx.lineWidth = 2
          ctx.stroke()

          // Beer liquid
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.radius * 0.9, 0, Math.PI, true)
          ctx.fillStyle = "#fbbf24"
          ctx.fill()
        }
      }

      checkCollision(ballX: number, ballY: number, ballRadius: number) {
        if (this.hit) return false

        const distance = Math.sqrt(Math.pow(this.x - ballX, 2) + Math.pow(this.y - ballY, 2))
        return distance < this.radius + ballRadius
      }
    }

    class Ball {
      x: number
      y: number
      radius: number
      velocityX: number
      velocityY: number
      gravity: number
      bounce: number

      constructor(x: number, y: number, radius: number) {
        this.x = x
        this.y = y
        this.radius = radius
        this.velocityX = (Math.random() - 0.5) * 10
        this.velocityY = -15
        this.gravity = 0.5
        this.bounce = 0.7
      }

      draw() {
        if (!ctx) return

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = "#f97316"
        ctx.fill()
        ctx.strokeStyle = "#ea580c"
        ctx.lineWidth = 2
        ctx.stroke()
      }

      update() {
        // Apply gravity
        this.velocityY += this.gravity

        // Update position
        this.x += this.velocityX
        this.y += this.velocityY

        // Check for wall collisions
        if (this.x - this.radius < tableX) {
          this.x = tableX + this.radius
          this.velocityX *= -this.bounce
        } else if (this.x + this.radius > tableX + tableWidth) {
          this.x = tableX + tableWidth - this.radius
          this.velocityX *= -this.bounce
        }

        // Check for floor collision
        if (this.y + this.radius > tableY + tableHeight) {
          this.y = tableY + tableHeight - this.radius
          this.velocityY *= -this.bounce
          this.velocityX *= 0.9 // Friction
        }

        // Check for cup collisions
        cups.forEach((cup) => {
          if (cup.checkCollision(this.x, this.y, this.radius)) {
            cup.hit = true
            this.velocityY = 0
            this.velocityX = 0
            this.gravity = 0
          }
        })

        // Check if ball is out of bounds or stopped
        if (
          this.y > canvas.height + this.radius ||
          (Math.abs(this.velocityX) < 0.1 && Math.abs(this.velocityY) < 0.1 && this.y > tableY)
        ) {
          return false
        }

        this.draw()
        return true
      }
    }

    function setupCups() {
      cups.length = 0

      // Triangle formation for cups
      const startX = tableX + tableWidth * 0.7
      const startY = tableY + tableHeight * 0.3
      const rows = 3

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col <= row; col++) {
          const x = startX - row * cupRadius * 2.2 + col * cupRadius * 2.2
          const y = startY + row * cupRadius * 2.2
          cups.push(new Cup(x, y, cupRadius, "#ef4444"))
        }
      }
    }

    function drawTable() {
      if (!ctx) return

      // Table
      ctx.fillStyle = "#78350f"
      ctx.fillRect(tableX, tableY, tableWidth, tableHeight)

      // Table border
      ctx.strokeStyle = "#92400e"
      ctx.lineWidth = 6
      ctx.strokeRect(tableX, tableY, tableWidth, tableHeight)

      // Center line
      ctx.beginPath()
      ctx.moveTo(canvas.width / 2, tableY)
      ctx.lineTo(canvas.width / 2, tableY + tableHeight)
      ctx.strokeStyle = "#f59e0b"
      ctx.lineWidth = 2
      ctx.stroke()
    }

    function throwBall() {
      if (isPlaying) return

      setIsPlaying(true)
      ball = new Ball(tableX + tableWidth * 0.3, tableY + tableHeight - 20, cupRadius * 0.6)
    }

    function animate() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      drawTable()
      cups.forEach((cup) => cup.draw())

      if (ball) {
        const ballActive = ball.update()
        if (!ballActive) {
          ball = null
          setIsPlaying(false)

          // Check if all cups are hit
          const allHit = cups.every((cup) => cup.hit)
          if (allHit) {
            setTimeout(() => {
              setupCups()
            }, 1500)
          }
        }
      }

      requestAnimationFrame(animate)
    }

    setupCups()
    animate()

    canvas.addEventListener("click", throwBall)

    const handleResize = () => {
      if (!canvas) return
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
      setupCups()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      canvas.removeEventListener("click", throwBall)
      window.removeEventListener("resize", handleResize)
    }
  }, [isPlaying])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-pointer"
      aria-label="Interactive Beer Pong Game - Click to throw the ball"
    />
  )
}

"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface FloatingHopsProps {
  count?: number
}

export function FloatingHops({ count = 20 }: FloatingHopsProps) {
  const [hops, setHops] = useState<
    Array<{ id: number; x: number; y: number; rotation: number; size: number; delay: number }>
  >([])

  useEffect(() => {
    const newHops = []
    for (let i = 0; i < count; i++) {
      newHops.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        size: Math.random() * 30 + 20,
        delay: Math.random() * 5,
      })
    }
    setHops(newHops)
  }, [count])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {hops.map((hop) => (
        <motion.div
          key={hop.id}
          className="absolute"
          style={{
            left: `${hop.x}%`,
            top: `${hop.y}%`,
            width: hop.size,
            height: hop.size,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [hop.rotation, hop.rotation + 20, hop.rotation],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Number.POSITIVE_INFINITY,
            delay: hop.delay,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-amber-500 opacity-30">
            <path
              d="M50 0 C60 20 80 40 100 50 C80 60 60 80 50 100 C40 80 20 60 0 50 C20 40 40 20 50 0"
              fill="currentColor"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

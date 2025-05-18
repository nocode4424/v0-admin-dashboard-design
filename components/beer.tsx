"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface BeerProps {
  name: string
  type: string
  abv: number
  ibu: number
  color: string
  description: string
}

export function Beer({ name, type, abv, ibu, color, description }: BeerProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="relative bg-amber-800 rounded-lg overflow-hidden p-6 h-full"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        <div className="relative mb-4 pb-[120%]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-3/4 h-full max-h-48">
              {/* Beer Glass */}
              <div className="absolute bottom-0 left-0 right-0 rounded-b-lg rounded-t-xl overflow-hidden border-2 border-amber-200 h-full">
                {/* Beer Liquid */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0"
                  style={{ backgroundColor: color }}
                  initial={{ height: "70%" }}
                  animate={{ height: isHovered ? "85%" : "70%" }}
                  transition={{ duration: 1 }}
                >
                  {/* Beer Bubbles */}
                  {isHovered && (
                    <>
                      <motion.div
                        className="absolute w-2 h-2 rounded-full bg-amber-100 opacity-70"
                        animate={{
                          y: [0, -40, -80],
                          opacity: [0.7, 0.5, 0],
                          x: [5, 10, 15],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "loop",
                          delay: 0.2,
                        }}
                        style={{ bottom: "20%", left: "30%" }}
                      />
                      <motion.div
                        className="absolute w-3 h-3 rounded-full bg-amber-100 opacity-70"
                        animate={{
                          y: [0, -60, -120],
                          opacity: [0.7, 0.5, 0],
                          x: [-5, -10, -15],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "loop",
                          delay: 0.5,
                        }}
                        style={{ bottom: "40%", right: "30%" }}
                      />
                      <motion.div
                        className="absolute w-2 h-2 rounded-full bg-amber-100 opacity-70"
                        animate={{
                          y: [0, -50, -100],
                          opacity: [0.7, 0.5, 0],
                        }}
                        transition={{
                          duration: 1.8,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "loop",
                          delay: 0.8,
                        }}
                        style={{ bottom: "30%", left: "50%" }}
                      />
                    </>
                  )}
                </motion.div>

                {/* Beer Foam */}
                <motion.div
                  className="absolute left-0 right-0 bg-amber-100"
                  initial={{ height: "15%", top: "15%" }}
                  animate={{
                    height: isHovered ? "20%" : "15%",
                    top: isHovered ? "0%" : "15%",
                  }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-amber-100 mb-1">{name}</h3>
        <p className="text-amber-200 mb-2">{type}</p>
        <div className="flex justify-between mb-3 text-amber-300">
          <span>ABV: {abv}%</span>
          <span>IBU: {ibu}</span>
        </div>
        <p className="text-amber-200 text-sm mt-auto">{description}</p>
      </div>
    </motion.div>
  )
}

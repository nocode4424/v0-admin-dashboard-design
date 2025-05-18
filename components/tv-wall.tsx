"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

export function TvWall() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  const tvs = [
    { size: "lg", content: "football", delay: 0 },
    { size: "md", content: "basketball", delay: 0.2 },
    { size: "sm", content: "baseball", delay: 0.4 },
    { size: "md", content: "hockey", delay: 0.6 },
    { size: "lg", content: "soccer", delay: 0.8 },
    { size: "sm", content: "golf", delay: 1 },
    { size: "md", content: "tennis", delay: 1.2 },
    { size: "lg", content: "racing", delay: 1.4 },
    { size: "sm", content: "boxing", delay: 1.6 },
    { size: "md", content: "football", delay: 1.8 },
    { size: "lg", content: "basketball", delay: 2 },
    { size: "sm", content: "baseball", delay: 2.2 },
    { size: "md", content: "hockey", delay: 2.4 },
    { size: "lg", content: "soccer", delay: 2.6 },
    { size: "sm", content: "golf", delay: 2.8 },
    { size: "md", content: "tennis", delay: 3 },
    { size: "lg", content: "racing", delay: 3.2 },
    { size: "sm", content: "boxing", delay: 3.4 },
    { size: "md", content: "football", delay: 3.6 },
    { size: "lg", content: "basketball", delay: 3.8 },
    { size: "sm", content: "baseball", delay: 4 },
    { size: "md", content: "hockey", delay: 4.2 },
    { size: "lg", content: "soccer", delay: 4.4 },
    { size: "sm", content: "golf", delay: 4.6 },
    { size: "md", content: "tennis", delay: 4.8 },
    { size: "lg", content: "racing", delay: 5 },
    { size: "sm", content: "boxing", delay: 5.2 },
    { size: "md", content: "football", delay: 5.4 },
    { size: "lg", content: "basketball", delay: 5.6 },
    { size: "sm", content: "baseball", delay: 5.8 },
  ]

  const getSizeClass = (size: string) => {
    switch (size) {
      case "sm":
        return "col-span-1 row-span-1"
      case "md":
        return "col-span-2 row-span-1"
      case "lg":
        return "col-span-2 row-span-2"
      default:
        return "col-span-1 row-span-1"
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-900/0 via-amber-900/20 to-amber-900/80 z-10 pointer-events-none" />
      <div className="grid grid-cols-6 md:grid-cols-12 gap-2 md:gap-4">
        {tvs.map((tv, index) => (
          <div
            key={index}
            className={`${getSizeClass(tv.size)} relative overflow-hidden rounded-lg border-4 border-amber-950 shadow-lg transform ${isVisible ? "animate-tv-on" : "opacity-0"}`}
            style={{
              animationDelay: `${tv.delay}s`,
              aspectRatio: tv.size === "lg" ? "16/9" : "4/3",
            }}
          >
            <div className="absolute inset-0 bg-black">
              <Image
                src={`/abstract-geometric-shapes.png?height=300&width=400&query=${tv.content} game`}
                alt={`TV showing ${tv.content}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div className="absolute bottom-2 left-2 right-2 text-white text-xs md:text-sm font-bold">
              {tv.content.charAt(0).toUpperCase() + tv.content.slice(1)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

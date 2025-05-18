"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu } from "lucide-react"
import Image from "next/image"

export function FoamNavigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Home", href: "#" },
    { name: "Our Beers", href: "#beers" },
    { name: "Sports", href: "#sports" },
    { name: "Events", href: "#events" },
    { name: "Find Us", href: "#location" },
  ]

  return (
    <>
      {/* Foam bubbles that rise up */}
      <div className="fixed inset-x-0 top-0 h-20 z-50 pointer-events-none overflow-hidden">
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-0 rounded-full bg-amber-50"
              initial={{
                x: `${Math.random() * 100}%`,
                y: "100%",
                opacity: 0.7,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                y: "-100%",
                opacity: [0.7, 0.9, 0.7],
                scale: [Math.random() * 0.5 + 0.5, Math.random() * 0.7 + 0.8],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 5,
                ease: "easeInOut",
              }}
              style={{
                width: `${Math.random() * 30 + 20}px`,
                height: `${Math.random() * 30 + 20}px`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Foam navigation bar */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${isScrolled ? "h-16" : "h-24"}`}>
        {/* Foam top layer */}
        <div className="absolute inset-x-0 top-0 h-full overflow-hidden">
          <div className="absolute inset-x-0 -bottom-5 h-24">
            {/* Main foam layer */}
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
              <path
                d="M0,0 C150,40 350,0 500,30 C650,60 750,20 900,40 C1050,60 1150,10 1200,30 L1200,120 L0,120 Z"
                className="fill-amber-50"
              ></path>
            </svg>

            {/* Secondary foam details */}
            <svg
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              className="absolute bottom-0 w-full h-full opacity-70"
            >
              <path
                d="M0,30 C100,10 200,50 300,30 C400,10 500,40 600,20 C700,0 800,30 900,10 C1000,30 1100,0 1200,20 L1200,120 L0,120 Z"
                className="fill-amber-100"
              ></path>
            </svg>

            {/* Bubble details in foam */}
            <div className="absolute inset-0">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-amber-100"
                  style={{
                    width: `${Math.random() * 15 + 5}px`,
                    height: `${Math.random() * 15 + 5}px`,
                    top: `${Math.random() * 60 + 40}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.5 + 0.3,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Navigation content */}
        <nav
          className={`relative z-10 h-full flex items-center justify-between container mx-auto px-4 transition-all duration-500 ${
            isScrolled ? "pt-1" : "pt-3"
          }`}
        >
          <div className="flex items-center">
            <Link href="#" className="flex items-center">
              <Image
                src="/images/brewery-logo.jpg"
                alt="Double Branch Brewery Logo"
                width={isScrolled ? 40 : 50}
                height={isScrolled ? 40 : 50}
                className="rounded-full mr-3 transition-all duration-500"
              />
              <span className="text-amber-900 font-bold text-2xl">DOUBLE BRANCH</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-amber-900 font-semibold hover:text-amber-600 transition-colors relative group"
              >
                {item.name}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-amber-900 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
        </nav>

        {/* Mobile navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-amber-50 absolute top-full left-0 right-0 z-20 border-t border-amber-200 shadow-lg"
            >
              <div className="container mx-auto px-4 py-3">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block py-2 text-amber-900 font-medium hover:text-amber-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer for fixed header */}
      <div className={`h-24 transition-all duration-500 ${isScrolled ? "h-16" : "h-24"}`}></div>
    </>
  )
}

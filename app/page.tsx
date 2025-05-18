import Image from "next/image"
import { BeerTap } from "@/components/beer-tap"
import { BeerBubbles } from "@/components/beer-bubbles"
import { TvWall } from "@/components/tv-wall"
import { BeerMenu } from "@/components/beer-menu"
import { FloatingHops } from "@/components/floating-hops"
import { BreweryEvents } from "@/components/brewery-events"
import { Button } from "@/components/ui/button"
import { BeerPong } from "@/components/beer-pong"
import { FoamNavigation } from "@/components/foam-navigation"
import { RisingFoam } from "@/components/rising-foam"
import { FoamDivider } from "@/components/foam-divider"

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <FoamNavigation />
      <RisingFoam />
      {/* Hero Section with animated beer pour */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-amber-900">
        <BeerBubbles />
        <div className="container relative z-10 px-4 py-32 text-center">
          <div className="mb-6">
            <Image
              src="/images/brewery-logo.jpg"
              alt="Double Branch Brewery Logo"
              width={200}
              height={200}
              className="mx-auto rounded-full"
            />
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold text-amber-100 mb-6 animate-pulse-slow">
            <span className="block transform rotate-[-2deg] hover:rotate-[2deg] transition-transform duration-300">
              DOUBLE
            </span>
            <span className="block transform rotate-[2deg] hover:rotate-[-2deg] transition-transform duration-300">
              BRANCH
            </span>
            <span className="block text-amber-300 transform rotate-[-1deg] hover:rotate-[1deg] transition-transform duration-300">
              BREWERY
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-amber-200 mb-8 max-w-2xl mx-auto">
            Wesley Chapel's most FUN brewery with 35 amazing beers and almost as many TVs!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-amber-950 text-lg px-8 py-6 rounded-full animate-pulse"
            >
              View Our Beers
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-amber-500 text-amber-100 hover:bg-amber-800 text-lg px-8 py-6 rounded-full"
            >
              Find Us
            </Button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <BeerTap />
        </div>
        <FloatingHops />
        <FoamDivider position="bottom" />
      </section>

      {/* Beer Showcase */}
      <section id="beers" className="relative py-24 bg-amber-950">
        <FoamDivider position="top" />
        <div className="container px-4">
          <h2 className="text-5xl font-bold text-center text-amber-100 mb-16">
            <span className="inline-block transform hover:rotate-2 transition-transform duration-300 border-b-4 border-amber-500 pb-2">
              35 AMAZING BEERS
            </span>
          </h2>
          <BeerMenu />
          <div className="mt-16 text-center">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-amber-950 text-lg px-8 py-6 rounded-full">
              Download Full Beer Menu
            </Button>
          </div>
        </div>
        <FoamDivider position="bottom" />
      </section>

      {/* TV Wall Section */}
      <section id="sports" className="py-24 bg-amber-900 relative overflow-hidden">
        <div className="container px-4">
          <h2 className="text-5xl font-bold text-center text-amber-100 mb-16">
            <span className="inline-block transform hover:rotate-[-2deg] transition-transform duration-300 border-b-4 border-amber-500 pb-2">
              SPORTS PARADISE
            </span>
          </h2>
          <p className="text-xl text-amber-200 text-center mb-12 max-w-2xl mx-auto">
            Never miss a game with our wall of TVs! We show all major sporting events.
          </p>
          <TvWall />
          <div className="mt-16 text-center">
            <h3 className="text-3xl font-bold text-amber-100 mb-6">Upcoming Games</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-amber-800 p-6 rounded-lg transform hover:scale-105 transition-transform duration-300">
                <p className="text-amber-200 font-bold">SATURDAY</p>
                <p className="text-xl text-amber-100">Tampa Bay Lightning vs. Florida Panthers</p>
                <p className="text-amber-300">7:00 PM</p>
              </div>
              <div className="bg-amber-800 p-6 rounded-lg transform hover:scale-105 transition-transform duration-300">
                <p className="text-amber-200 font-bold">SUNDAY</p>
                <p className="text-xl text-amber-100">Tampa Bay Buccaneers vs. New Orleans Saints</p>
                <p className="text-amber-300">1:00 PM</p>
              </div>
              <div className="bg-amber-800 p-6 rounded-lg transform hover:scale-105 transition-transform duration-300">
                <p className="text-amber-200 font-bold">MONDAY</p>
                <p className="text-xl text-amber-100">Tampa Bay Rays vs. New York Yankees</p>
                <p className="text-amber-300">7:30 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fun Activities Section */}
      <section className="py-24 bg-amber-800 relative">
        <FloatingHops count={10} />
        <div className="container px-4">
          <h2 className="text-5xl font-bold text-center text-amber-100 mb-16">
            <span className="inline-block transform hover:rotate-2 transition-transform duration-300 border-b-4 border-amber-500 pb-2">
              FUN & GAMES
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-3xl font-bold text-amber-100 mb-4">Beer Pong Tournaments</h3>
              <p className="text-xl text-amber-200 mb-6">
                Join our weekly beer pong tournaments every Thursday night! Winners get bragging rights and brewery
                swag.
              </p>
              <Button className="bg-amber-500 hover:bg-amber-600 text-amber-950">Sign Up For Tournament</Button>
            </div>
            <div className="relative h-80">
              <BeerPong />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-amber-700 p-6 rounded-lg transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-bold text-amber-100 mb-3">Trivia Night</h3>
              <p className="text-amber-200">Test your knowledge every Tuesday at 7PM with our themed trivia nights!</p>
            </div>
            <div className="bg-amber-700 p-6 rounded-lg transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-bold text-amber-100 mb-3">Live Music</h3>
              <p className="text-amber-200">Local bands and musicians every Friday and Saturday night from 8PM-11PM.</p>
            </div>
            <div className="bg-amber-700 p-6 rounded-lg transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-bold text-amber-100 mb-3">Brewery Tours</h3>
              <p className="text-amber-200">
                See how the magic happens with our behind-the-scenes brewery tours every Sunday at 2PM.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Calendar */}
      <section id="events" className="py-24 bg-amber-950">
        <div className="container px-4">
          <h2 className="text-5xl font-bold text-center text-amber-100 mb-16">
            <span className="inline-block transform hover:rotate-[-2deg] transition-transform duration-300 border-b-4 border-amber-500 pb-2">
              UPCOMING EVENTS
            </span>
          </h2>
          <BreweryEvents />
        </div>
      </section>

      {/* Contact & Location */}
      <section id="location" className="py-24 bg-amber-900 relative">
        <BeerBubbles />
        <div className="container px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-amber-100 mb-6">Find Us</h2>
              <p className="text-xl text-amber-200 mb-4">
                Double Branch Brewery
                <br />
                1234 Beer Ave
                <br />
                Wesley Chapel, FL 33544
              </p>
              <p className="text-xl text-amber-200 mb-6">
                <strong>Hours:</strong>
                <br />
                Monday-Thursday: 2PM-10PM
                <br />
                Friday-Saturday: 12PM-12AM
                <br />
                Sunday: 12PM-8PM
              </p>
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-amber-950">
                Get Directions
              </Button>
            </div>
            <div className="bg-amber-800 p-4 rounded-lg">
              <div className="aspect-video relative rounded overflow-hidden">
                <Image
                  src="/wesley-chapel-florida-map.png"
                  alt="Map of Double Branch Brewery location"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-950 text-amber-200 py-12">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Image
                src="/images/brewery-logo.jpg"
                alt="Double Branch Brewery Logo"
                width={100}
                height={100}
                className="rounded-full"
              />
            </div>
            <div className="text-center md:text-right">
              <p className="mb-2">© 2025 Double Branch Brewery. All rights reserved.</p>
              <p>Please drink responsibly.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

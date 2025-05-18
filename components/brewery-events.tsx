"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, Music, Award, Beer, Users } from "lucide-react"

const events = [
  {
    id: 1,
    title: "Live Music: The Brew Crew Band",
    date: "Friday, May 24",
    time: "8:00 PM - 11:00 PM",
    description: "Local rock band playing all your favorite hits!",
    type: "music",
  },
  {
    id: 2,
    title: "Beer Release: Tropical Thunder IPA",
    date: "Saturday, May 25",
    time: "12:00 PM",
    description: "Be the first to try our new tropical fruit infused IPA!",
    type: "release",
  },
  {
    id: 3,
    title: "Trivia Night: Sports Edition",
    date: "Tuesday, May 28",
    time: "7:00 PM - 9:00 PM",
    description: "Test your sports knowledge and win brewery swag!",
    type: "trivia",
  },
  {
    id: 4,
    title: "Beer & Food Pairing",
    date: "Thursday, May 30",
    time: "6:00 PM - 8:00 PM",
    description: "Five-course tasting menu paired with our signature beers.",
    type: "food",
  },
  {
    id: 5,
    title: "Live Music: Acoustic Session",
    date: "Friday, May 31",
    time: "8:00 PM - 11:00 PM",
    description: "Relaxing acoustic covers of your favorite songs.",
    type: "music",
  },
  {
    id: 6,
    title: "Brewery Tour & Tasting",
    date: "Sunday, June 2",
    time: "2:00 PM - 4:00 PM",
    description: "Behind-the-scenes tour with special tastings from the tanks!",
    type: "tour",
  },
]

export function BreweryEvents() {
  const [activeEvent, setActiveEvent] = useState<number | null>(null)

  const getEventIcon = (type: string) => {
    switch (type) {
      case "music":
        return <Music className="h-6 w-6" />
      case "release":
        return <Beer className="h-6 w-6" />
      case "trivia":
        return <Award className="h-6 w-6" />
      case "food":
        return <Users className="h-6 w-6" />
      case "tour":
        return <Users className="h-6 w-6" />
      default:
        return <Beer className="h-6 w-6" />
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {events.map((event) => (
        <motion.div
          key={event.id}
          className={`bg-amber-800 rounded-lg p-6 cursor-pointer transition-all duration-300 ${
            activeEvent === event.id ? "ring-4 ring-amber-500" : ""
          }`}
          whileHover={{ scale: 1.03 }}
          onClick={() => setActiveEvent(activeEvent === event.id ? null : event.id)}
        >
          <div className="flex items-start gap-4">
            <div className="bg-amber-700 p-3 rounded-full text-amber-200">{getEventIcon(event.type)}</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-amber-100 mb-2">{event.title}</h3>
              <div className="flex items-center text-amber-300 mb-1">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center text-amber-300 mb-3">
                <Clock className="h-4 w-4 mr-2" />
                <span>{event.time}</span>
              </div>
              <p className="text-amber-200">{event.description}</p>

              {activeEvent === event.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-amber-700"
                >
                  <button className="bg-amber-600 hover:bg-amber-500 text-amber-950 font-bold py-2 px-4 rounded-full">
                    RSVP to Event
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

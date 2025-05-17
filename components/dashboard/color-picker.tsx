"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ColorPickerProps {
  id: string
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ id, color, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          className="h-10 w-10 rounded-md border"
          style={{ backgroundColor: color }}
          aria-label="Pick a color"
        />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="grid gap-2">
          <div className="grid grid-cols-5 gap-2">
            {[
              "#000000",
              "#ef4444",
              "#f97316",
              "#eab308",
              "#22c55e",
              "#3b82f6",
              "#6366f1",
              "#a855f7",
              "#ec4899",
              "#f43f5e",
              "#ffffff",
              "#f87171",
              "#fdba74",
              "#fde047",
              "#86efac",
              "#93c5fd",
              "#a5b4fc",
              "#c4b5fd",
              "#f9a8d4",
              "#fda4af",
            ].map((presetColor) => (
              <button
                key={presetColor}
                className="h-6 w-6 rounded-md border"
                style={{ backgroundColor: presetColor }}
                onClick={() => {
                  onChange(presetColor)
                  setIsOpen(false)
                }}
                aria-label={`Select color ${presetColor}`}
              />
            ))}
          </div>
          <input type="color" value={color} onChange={(e) => onChange(e.target.value)} className="h-8 w-full" />
        </div>
      </PopoverContent>
    </Popover>
  )
}

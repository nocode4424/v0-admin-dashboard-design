import Image from "next/image"

export function FoamDivider({ position = "top", className = "" }: { position?: "top" | "bottom"; className?: string }) {
  return (
    <div
      className={`absolute left-0 right-0 h-24 overflow-hidden ${
        position === "top" ? "top-0 transform rotate-180" : "bottom-0"
      } ${className}`}
    >
      <div className="relative w-full h-full">
        <Image src="/images/beer-foam.jpg" alt="" fill className="object-cover opacity-90" aria-hidden="true" />
        <div
          className={`absolute inset-0 ${
            position === "top"
              ? "bg-gradient-to-b from-transparent to-amber-900"
              : "bg-gradient-to-t from-transparent to-amber-900"
          }`}
        />
      </div>
    </div>
  )
}

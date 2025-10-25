"use client"

import { WavyBackground } from "@aceternity/ui"

export default function WavyBackgroundComponent() {
  return (
    <WavyBackground className="absolute inset-0 pointer-events-none" containerClassName="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
    </WavyBackground>
  )
}

"use client"
import type { ReactNode } from "react"
import { Card } from "@/components/ui/card"

interface SpotlightCardProps {
  children: ReactNode
  className?: string
}

export default function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  return (
    <Card
      className={`relative overflow-hidden backdrop-blur-md border border-border/50 bg-card/40 hover:bg-card/60 transition-colors ${className}`}
    >
      <div className="relative z-10">{children}</div>
    </Card>
  )
}

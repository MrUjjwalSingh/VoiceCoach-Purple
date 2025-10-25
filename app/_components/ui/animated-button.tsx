"use client"

import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"

interface AnimatedButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function AnimatedButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
}: AnimatedButtonProps) {
  const variantMap = {
    primary: "default",
    secondary: "secondary",
    outline: "outline",
  } as const

  const sizeMap = {
    sm: "sm",
    md: "default",
    lg: "lg",
  } as const

  return (
    <Button
      onClick={onClick}
      variant={variantMap[variant]}
      size={sizeMap[size]}
      className={`rounded-full ${className}`}
    >
      {children}
    </Button>
  )
}

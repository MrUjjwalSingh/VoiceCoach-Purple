"use client"

import { motion } from "framer-motion"

interface SpotlightProps {
  className?: string
  fill?: string
}

export function Spotlight({ className = "", fill = "rgba(99, 102, 241, 0.3)" }: SpotlightProps) {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      animate={{
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    >
      <div
        className="w-96 h-96 rounded-full blur-3xl"
        style={{
          background: fill,
          filter: "blur(80px)",
        }}
      />
    </motion.div>
  )
}

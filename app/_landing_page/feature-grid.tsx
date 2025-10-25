"use client"

import { motion } from "framer-motion"
import { HoverEffect } from "../_components/ui/hover-effect"

const features = [
  {
    title: "Real-Time Analysis",
    description: "Get instant feedback on filler words, pacing, and speech patterns as you speak.",
    link: "#",
  },
  {
    title: "Detailed Metrics",
    description: "Track your progress with comprehensive analytics and improvement suggestions.",
    link: "#",
  },
  {
    title: "AI Coach",
    description: "Personalized coaching tips to help you eliminate bad habits and speak with confidence.",
    link: "#",
  },
]

export default function FeatureGrid() {
  return (
    <section id="features" className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to become a confident speaker
          </p>
        </motion.div>

        <HoverEffect items={features} />
      </div>
    </section>
  )
}

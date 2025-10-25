"use client"

import { motion } from "framer-motion"
import { Upload, Zap, TrendingUp } from "lucide-react"
import { WavyBackground } from "../_components/ui/wavy-background-effect"

const steps = [
  {
    icon: Upload,
    title: "Upload Your Speech",
    description: "Record or upload an audio file of your presentation or speech.",
  },
  {
    icon: Zap,
    title: "AI Analysis",
    description: "Our AI analyzes filler words, pacing, clarity, and engagement patterns.",
  },
  {
    icon: TrendingUp,
    title: "Get Insights",
    description: "Receive detailed feedback and actionable tips to improve your speaking.",
  },
]

export default function HowItWorks() {
  return (
    <WavyBackground
      colors={["#8b5cf6", "#a78bfa", "#c084fc", "#d8b4fe", "#e9d5ff"]}
      waveWidth={50}
      backgroundFill="#0a0a0f"
      blur={10}
      speed="fast"
      waveOpacity={0.2}
      containerClassName="py-20"
      className="relative z-10"
    >
      <section id="how-it-works" className="relative px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Three simple steps to better speaking</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="glass p-8 rounded-lg h-full">
                    <div className="absolute -top-6 left-8 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <span className="text-primary-foreground font-bold">{index + 1}</span>
                    </div>
                    <div className="mt-6 mb-4 inline-block p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent" />
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </WavyBackground>
  )
}

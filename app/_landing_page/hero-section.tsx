"use client"

import { Spotlight } from "../_components/ui/spotlight"
import AnimatedButton from "../_components/ui/animated-button"
import { motion } from "framer-motion"
import Link from "next/link"

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <section className="relative min-h-screen bg-background overflow-hidden">
      <Spotlight className="top-20 left-10" fill="rgba(139, 92, 246, 0.3)" />
      <Spotlight className="top-40 right-20" fill="rgba(168, 123, 250, 0.2)" />
      <Spotlight className="bottom-20 left-1/2" fill="rgba(192, 132, 252, 0.25)" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center min-h-screen flex items-center justify-center">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block px-4 py-2 rounded-full glass text-sm font-medium text-primary bg-primary/10 border border-primary/20 backdrop-blur-md">
              ✨ AI-Powered Speech Analysis
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Stop Saying <span className="gradient-text">"Um."</span>
            <br />
            Start Sounding Confident.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed font-medium bg-gradient-to-r from-foreground/90 to-foreground/70 bg-clip-text text-transparent drop-shadow-lg"
          >
            Our AI coach analyzes your speech for filler words, pacing, and clarity. Get instant feedback and become a
            better communicator.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <AnimatedButton size="lg">Analyze Your First Speech (Free)</AnimatedButton>
            </Link>
            <AnimatedButton variant="outline" size="lg">
              Watch Demo
            </AnimatedButton>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-16 pt-16 border-t border-border">
            <p className="text-foreground/80 text-sm mb-6 font-medium">Trusted by speakers at</p>
            <div className="flex flex-wrap justify-center gap-8 items-center opacity-80">
              {["TED", "Google", "Microsoft", "Stanford"].map((company) => (
                <span key={company} className="font-semibold text-foreground drop-shadow-sm">
                  {company}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

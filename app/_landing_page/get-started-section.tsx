"use client"

import { motion } from "framer-motion"
import AnimatedButton from "../_components/ui/animated-button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function GetStartedSection() {
  return (
    <section className="relative py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="p-12 md:p-16 rounded-2xl text-center backdrop-blur-md border border-border/50 bg-card/40">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Sound Confident?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of speakers who have improved their communication skills with VoiceCoach.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <AnimatedButton size="lg">Start Free Trial</AnimatedButton>
              </Link>
              <AnimatedButton variant="outline" size="lg">
                Schedule Demo
              </AnimatedButton>
            </div>
            <p className="text-muted-foreground text-sm mt-8">No credit card required. Get started in seconds.</p>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

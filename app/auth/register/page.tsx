"use client"

import { motion } from "framer-motion"
import { Spotlight } from "../../_components/ui/spotlight"
import RegisterForm from "../../_components/auth/register-form"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <Spotlight className="top-20 left-10" fill="rgba(139, 92, 246, 0.6)" />
      <Spotlight className="top-40 right-20" fill="rgba(168, 123, 250, 0.5)" />
      <Spotlight className="bottom-20 left-1/2" fill="rgba(192, 132, 252, 0.55)" />
      
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/15" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-8"
          >
            <Link href="/" className="inline-block mb-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center gap-2 mb-4"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary" />
                <span className="font-bold text-xl gradient-text">VoiceCoach</span>
              </motion.div>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
            <p className="text-muted-foreground">Join VoiceCoach and start improving your speech</p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <RegisterForm />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

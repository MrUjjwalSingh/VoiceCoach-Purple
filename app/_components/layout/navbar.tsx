"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation" // Import useRouter

// --- Navbar component now manages its own state ---
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // State is now managed inside
  const router = useRouter()

  // Check login state on component mount
  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    try {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user_email")
    } catch (e) {
      // ignore
    }
    setIsLoggedIn(false) // Update state
    setIsOpen(false) // Close mobile menu if open
    router.push("/auth/login") // Redirect to login
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass sticky top-0 z-50 border-b bg-background/90 backdrop-blur-md border-primary/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
              <span className="font-bold text-lg gradient-text">
                VoiceCoach
              </span>
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {/* Removed Features button */}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              // --- Logged In (Desktop) ---
              <>
                <button
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  Logout
                </button>
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/50 transition"
                  >
                    Dashboard
                  </motion.button>
                </Link>
              </>
            ) : (
              // --- Logged Out (Desktop) ---
              <>
                <Link href="/auth/login">
                  <button className="text-foreground hover:text-muted-foreground transition">
                    Sign In
                  </button>
                </Link>
                <Link href="/auth/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/50 transition"
                  >
                    Get Started
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-4 space-y-4"
          >
            {/* Removed Features button */}
            {isLoggedIn ? (
              // --- Logged In (Mobile) ---
              <>
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-6 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium"
                  >
                    Dashboard
                  </motion.button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-muted-foreground hover:text-foreground transition px-1" // Added padding for tap area
                >
                  Logout
                </button>
              </>
            ) : (
              // --- Logged Out (Mobile) ---
              <>
                <Link href="/auth/login">
                  <button className="w-full text-left text-foreground hover:text-muted-foreground transition">
                    Sign In
                  </button>
                </Link>
                <Link href="/auth/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-6 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium"
                  >
                    Get Started
                  </motion.button>
                </Link>
              </>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { authAPI } from "@/lib/axios-util"
import { setAuthToken } from "@/lib/auth-utils"
import { useRouter } from "next/navigation"

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      const response = await authAPI.login(formData.email, formData.password)
      
      if (response.success && response.data?.token) {
        // Store JWT token in localStorage
        setAuthToken(response.data.token, formData.email)
        
        // Redirect to Dashboard
        router.push("/dashboard")
      } else {
        setError(response.error || "Login failed. Please try again.")
      }
    } catch (err: any) {
      setError("Network error. Please check your connection.")
    } finally {
      setIsLoading(false)
    }
    
  }

  return (
    <Card className="glass border border-primary/20 p-8 space-y-6 backdrop-blur-md bg-card/60 shadow-2xl shadow-primary/20">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-input/60 border border-primary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 focus:bg-input/80 transition backdrop-blur-sm"
          />
        </motion.div>

        {/* Password Input */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-input/60 border border-primary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 focus:bg-input/80 transition backdrop-blur-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </motion.div>

        {/* Remember Me & Forgot Password */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between text-sm"
        >
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-border/50" />
            <span className="text-muted-foreground">Remember me</span>
          </label>
          <Link href="#" className="text-primary hover:text-secondary transition">
            Forgot password?
          </Link>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-xl hover:shadow-primary/60 hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-medium py-2 rounded-lg transition disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </motion.div>
      </form>


      {/* Sign Up Link */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center text-muted-foreground"
      >
        Don't have an account?{" "}
        <Link href="/auth/register" className="text-primary hover:text-secondary transition font-medium">
          Sign up
        </Link>
      </motion.p>
    </Card>
  )
}

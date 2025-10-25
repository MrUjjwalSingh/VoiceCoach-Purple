"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Eye, EyeOff, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import axios from "axios"
import { useRouter } from "next/navigation";



export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return}
    
    setIsLoading(true)
    // Simulate API call
    try{
     const res = await axios.post("http://localhost:5000/api/auth/register", {
      username: formData.fullName,
      email: formData.email,
      password: formData.password, // include password in API call
    })   
    const response = res.data;
    if (response.success) {
       router.push("/auth/login");
    }
    else {
      alert(response.message || "Registration failed");
    }
  }catch (err: any) {
    alert(err.response?.data?.message || "Server error");
  } finally {
    setIsLoading(false);
  }
  }

  const passwordStrength = formData.password.length >= 8 ? "strong" : formData.password.length >= 4 ? "medium" : "weak"

  return (
    <Card className="glass border border-primary/20 p-8 space-y-6 backdrop-blur-md bg-card/60 shadow-2xl shadow-primary/20">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name Input */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-input/60 border border-primary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 focus:bg-input/80 transition backdrop-blur-sm"
          />
        </motion.div>

        {/* Email Input */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
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
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
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
          {/* Password Strength Indicator */}
          <div className="mt-2 flex gap-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition ${
                  passwordStrength === "strong"
                    ? "bg-green-500"
                    : passwordStrength === "medium"
                      ? i <= 2
                        ? "bg-yellow-500"
                        : "bg-border/50"
                      : i === 1
                        ? "bg-red-500"
                        : "bg-border/50"
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Confirm Password Input */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-input/60 border border-primary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 focus:bg-input/80 transition backdrop-blur-sm"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {formData.confirmPassword && (
            <div className="mt-2 flex items-center gap-2">
              {formData.password === formData.confirmPassword ? (
                <>
                  <Check size={16} className="text-green-500" />
                  <span className="text-sm text-green-500">Passwords match</span>
                </>
              ) : (
                <>
                  <span className="text-sm text-red-500">Passwords do not match</span>
                </>
              )}
            </div>
          )}
        </motion.div>

        {/* Terms & Conditions */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-border/50 mt-1" required />
            <span className="text-sm text-muted-foreground">
              I agree to the{" "}
              <Link href="#" className="text-primary hover:text-secondary transition">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-primary hover:text-secondary transition">
                Privacy Policy
              </Link>
            </span>
          </label>
        </motion.div>

        {/* Submit Button */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-xl hover:shadow-primary/60 hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-medium py-2 rounded-lg transition disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </motion.div>
      </form>


      {/* Sign In Link */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center text-muted-foreground"
      >
        Already have an account?{" "}
        <Link href="/auth/login" className="text-primary hover:text-secondary transition font-medium">
          Sign in
        </Link>
      </motion.p>
    </Card>
  )
}

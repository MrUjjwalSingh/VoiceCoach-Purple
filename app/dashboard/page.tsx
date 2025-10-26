"use client"

import { motion } from "framer-motion"
import Navbar from "../_components/layout/navbar"
import Footer from "../_components/layout/footer"
import { ProtectedRoute } from "@/lib/protected-route"
import { Spotlight } from "../_components/ui/spotlight"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  User,
  Home,
  BarChart2,
  PieChart,
  FileText,
  LogOut,
  Clock,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useEffect, useState } from "react"
import { getUserEmail } from "@/lib/auth-utils"
import UnifiedSidebar from "../_components/layout/unified-sidebar"

export default function DashboardPage() {
  const router = useRouter()

  // sample WPM analytics data (replace with real data fetching)
  const wpm = 148
  const pacingStatus =
    wpm > 160 ? "Very fast" : wpm < 100 ? "Very slow" : "Within range"
  const strategicPauses =
    "Add short pauses after key points and before transitions to emphasize structure."
  const feedback = [
    `✅ Pacing: Your overall speed (${wpm} WPM) is within range.`,
    "🛑 Monotony Alert: Your delivery is flat (Score 86.0/100). Vary your tone and pitch.",
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* subtle background accents */}
        <Spotlight className="top-12 left-8" fill="rgba(139, 92, 246, 0.12)" />
        <Spotlight
          className="top-40 right-16"
          fill="rgba(168, 123, 250, 0.10)"
        />

        {/* --- Unified Sidebar --- */}
        <UnifiedSidebar />

        {/* --- Main Content Area --- */}
           <div className="relative flex flex-col min-h-screen pl-72">
             {/* Original background overlay (now inside the wrapper) */}
             <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-primary/20 -z-10" />

          <Navbar />

          {/* UPDATED: Removed transition classes from main */}
          <main className="flex-1 p-8">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
               <h2 className="text-2xl font-bold text-foreground mb-1">
                 Dashboard Overview
               </h2>
               <p className="text-sm text-muted-foreground mb-6">
                 Your analytics at a glance
               </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cards - Update all text colors */}
                <Card className="p-6 bg-purple-500/10 backdrop-blur-sm border-purple-400/20">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-200">
                      Speech Performance Trend
                    </h3>
                    <span className="text-xs text-slate-400">
                      Last 8 Weeks
                    </span>
                  </div>
                  <div className="h-44">
                    <svg viewBox="0 0 200 80" className="w-full h-full">
                      <defs>
                        <linearGradient id="lg1" x1="0" x2="0" y1="0" y2="1">
                           <stop offset="0%" stopColor="rgba(139,92,246,0.28)" />
                          <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                      </defs>
                      <polyline
                        fill="none"
                        stroke="#8B5CF6"
                        strokeWidth="2.5"
                        points="0,60 30,50 55,56 80,38 110,44 140,32 170,28 200,14"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <polygon
                        points="0,60 30,50 55,56 80,38 110,44 140,32 170,28 200,14 200,80 0,80"
                        fill="url(#lg1)"
                      />
                    </svg>
                  </div>
                </Card>

                {/* Bars */}
                 <Card className="p-6 bg-purple-500/10 backdrop-blur-sm border-purple-400/20">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-200">
                      Presentations Analysis
                    </h3>
                    <span className="text-xs text-slate-400">
                      Completed vs Practiced
                    </span>
                  </div>
                  <div className="h-44 flex items-end gap-6 px-2">
                    <div className="flex-1 flex flex-col items-center">
                      <div
                        className="w-12 bg-primary rounded-t-md"
                        style={{ height: "52%" }}
                      />
                      <div className="text-xs text-slate-400 mt-2">
                        Completed
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div
                        className="w-12 bg-secondary rounded-t-md"
                        style={{ height: "78%" }}
                      />
                      <div className="text-xs text-slate-400 mt-2">
                        Practiced
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div
                        className="w-12 bg-slate-400 rounded-t-md"
                        style={{ height: "30%" }}
                      />
                      <div className="text-xs text-slate-400 mt-2">
                        Sessions
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Donut */}
                 <Card className="p-6 bg-purple-500/10 backdrop-blur-sm border-purple-400/20">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-200">
                      Most Used Keywords
                    </h3>
                    <span className="text-xs text-slate-400">
                      By frequency
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <svg viewBox="0 0 36 36" className="w-28 h-28">
                      <circle
                        r="16"
                        cx="18"
                        cy="18"
                        fill="transparent"
                        stroke="#ECEBFF"
                        strokeWidth="8"
                      />
                      <circle
                        r="16"
                        cx="18"
                        cy="18"
                        fill="transparent"
                        stroke="#8B5CF6"
                        strokeWidth="8"
                        strokeDasharray="60 40"
                        strokeLinecap="round"
                        transform="rotate(-90 18 18)"
                      />
                      <circle
                        r="16"
                        cx="18"
                        cy="18"
                        fill="transparent"
                        stroke="#60A5FA"
                        strokeWidth="8"
                        strokeDasharray="24 76"
                        strokeLinecap="round"
                        transform="rotate(20 18 18)"
                      />
                    </svg>
                    <div className="flex-1">
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-3">
                          <span className="w-3 h-3 rounded-full bg-primary inline-block" />
                          <span className="text-slate-200">Strategy</span>
                          <span className="text-slate-400 ml-auto">
                            42%
                          </span>
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="w-3 h-3 rounded-full bg-secondary inline-block" />
                          <span className="text-slate-200">Growth</span>
                          <span className="text-slate-400 ml-auto">
                            28%
                          </span>
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="w-3 h-3 rounded-full bg-slate-400 inline-block" />
                          <span className="text-slate-200">Innovation</span>
                          <span className="text-slate-400 ml-auto">
                            30%
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card>

                {/* Words Per Minute Card */}
                 <Card className="p-6 bg-purple-500/10 backdrop-blur-sm border-purple-400/20">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-200">
                      Words Per Minute
                    </h3>
                    <span className="text-xs text-slate-400">
                      Real-time
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <div className="text-xs text-slate-400">
                        Total WPM
                      </div>
                      <div className="text-4xl font-bold text-slate-200">
                        {wpm}
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <span
                          className={
                            "px-2 py-1 text-xs rounded " +
                            (pacingStatus === "Within range"
                              ? "bg-green-600/15 text-green-300"
                              : "bg-red-600/10 text-red-300")
                          }
                        >
                          {pacingStatus}
                        </span>
                        <span className="text-sm text-slate-400">
                          • {strategicPauses}
                        </span>
                      </div>
                    </div>
                    <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-secondary/10">
                      <Activity size={28} className="text-primary" />
                    </div>
                  </div>
                </Card>

                {/* Summary Card */}
                 <Card className="p-6 bg-purple-500/10 backdrop-blur-sm border-purple-400/20">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-200">
                      Summary
                    </h3>
                    <span className="text-xs text-slate-400">
                      Overview
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-primary/5 to-secondary/4 rounded-lg">
                      <div className="text-sm text-slate-400">
                        Total Presentations
                      </div>
                      <div className="text-2xl font-bold text-slate-200">
                        15
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-primary/5 to-secondary/4 rounded-lg">
                      <div className="text-sm text-slate-400">
                        Average Score
                      </div>
                      <div className="text-2xl font-bold text-slate-200">
                        4.7 / 5.0
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Feedback Section */}
              <div className="mt-6">
                 <Card className="p-6 bg-purple-500/10 backdrop-blur-sm border-purple-400/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-200">
                      Feedback
                    </h3>
                    <span className="text-xs text-slate-400">
                      Automated insights
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {feedback.map((fb, i) => (
                      <li
                        key={i}
                        className="p-3 bg-muted/5 rounded-md text-slate-200"
                      >
                        {fb}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </motion.div>
          </main>

        <Footer />
        </div>
      </div>
    </ProtectedRoute>
  )
}

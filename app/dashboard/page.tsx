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
  Loader2,
} from "lucide-react"
import { useEffect, useState } from "react"
import { getUserEmail } from "@/lib/auth-utils"
import UnifiedSidebar from "../_components/layout/unified-sidebar"
import { api } from "@/lib/axios-util"

// API Response Interface
interface DashboardData {
  averages: {
    clarity_score: number;
    overall_wpm: number;
    filler_count: number;
    strategic_pauses: number;
    hesitation_gaps: number;
    relevance_score: number;
    acoustic_metrics: {
      pitch_monotony_score: number;
    };
  } | null;
  totalRecordings: number;
  analyzedRecordings: number;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data: {
    averages: {
      clarity_score: number;
      overall_wpm: number;
      filler_count: number;
      strategic_pauses: number;
      hesitation_gaps: number;
      relevance_score: number;
      acoustic_metrics: {
        pitch_monotony_score: number;
      };
    } | null;
    totalRecordings: number;
    analyzedRecordings: number;
  };
}

export default function DashboardPage() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await api.get('/dashboard')
        const data = response.data
        
        console.log('Dashboard API response:', data)
        
        if (data.success && data.data) {
          // Transform the API response to match our DashboardData interface
          const transformedData: DashboardData = {
            averages: data.data.averages,
            totalRecordings: data.data.totalRecordings,
            analyzedRecordings: data.data.analyzedRecordings
          }
          console.log('Transformed dashboard data:', transformedData)
          setDashboardData(transformedData)
        } else {
          setError(data.message || 'Failed to fetch dashboard data')
        }
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err)
        console.error('Error details:', {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data
        })
        setError(err.response?.data?.message || err.message || 'Failed to load dashboard data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Calculate derived values
  const wpm = dashboardData?.averages?.overall_wpm || 0
  const pacingStatus =
    wpm > 160 ? "Very fast" : wpm < 100 ? "Very slow" : "Within range"
  const strategicPauses =
    "Add short pauses after key points and before transitions to emphasize structure."
  const feedback = [
    `✅ Pacing: Your overall speed (${wpm} WPM) is within range.`,
    "🛑 Monotony Alert: Your delivery is flat (Score 86.0/100). Vary your tone and pitch.",
  ]

  // Check if no recordings exist
  const hasNoRecordings = dashboardData?.totalRecordings === 0

  // Loading state
  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-black text-foreground flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center space-y-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <Loader2 className="w-12 h-12 text-purple-400" />
            </motion.div>
            <h2 className="text-xl font-semibold text-white">Loading Dashboard...</h2>
            <p className="text-slate-400">Please wait while we fetch your data</p>
          </motion.div>
        </div>
      </ProtectedRoute>
    )
  }

  // Error state
  if (error || !dashboardData) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-black text-foreground flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h2 className="text-2xl font-semibold text-white">Error Loading Dashboard</h2>
            <p className="text-slate-400">{error || 'No data available'}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Retry
            </button>
          </motion.div>
        </div>
      </ProtectedRoute>
    )
  }

  // No recordings state
  if (hasNoRecordings) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-black relative overflow-hidden">
          <Spotlight className="top-12 left-8" fill="rgba(139, 92, 246, 0.12)" />
          <Spotlight className="top-40 right-16" fill="rgba(168, 123, 250, 0.10)" />
          
          <UnifiedSidebar />
          
          <div className="relative flex flex-col min-h-screen pl-72">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-primary/20 -z-10" />
            <Navbar />
            
            <main className="flex-1 p-8 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6 max-w-2xl"
              >
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full flex items-center justify-center">
                  <Activity className="w-12 h-12 text-purple-400" />
                </div>
                <h1 className="text-4xl font-bold text-white">No Recordings Yet</h1>
                <p className="text-lg text-slate-400">
                  Upload your first recording to start analyzing your presentation skills and see detailed insights.
                </p>
                <div className="space-y-4">
                  <Link
                    href="/presentation-analysis"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-purple-500/50"
                  >
                    <Activity className="w-5 h-5 mr-2" />
                    Upload Recording
                  </Link>
                  <p className="text-sm text-slate-500">
                    Your analytics will appear here once you upload recordings
                  </p>
                </div>
              </motion.div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

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

                {/* Recording Statistics */}
                 <Card className="p-6 bg-purple-500/10 backdrop-blur-sm border-purple-400/20">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-200">
                      Recording Statistics
                    </h3>
                    <span className="text-xs text-slate-400">
                      Total vs Analyzed
                    </span>
                  </div>
                  <div className="h-44 flex items-end gap-6 px-2">
                    <div className="flex-1 flex flex-col items-center">
                      <div
                        className="w-12 bg-primary rounded-t-md"
                        style={{ height: dashboardData.totalRecordings > 0 ? "100%" : "10%" }}
                      />
                      <div className="text-xs text-slate-400 mt-2">
                        Total: {dashboardData.totalRecordings}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div
                        className="w-12 bg-secondary rounded-t-md"
                        style={{ height: dashboardData.analyzedRecordings > 0 ? "100%" : "10%" }}
                      />
                      <div className="text-xs text-slate-400 mt-2">
                        Analyzed: {dashboardData.analyzedRecordings}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div
                        className="w-12 bg-green-500 rounded-t-md"
                        style={{ 
                          height: dashboardData.totalRecordings > 0 
                            ? `${(dashboardData.analyzedRecordings / dashboardData.totalRecordings) * 100}%` 
                            : "10%"
                        }}
                      />
                      <div className="text-xs text-slate-400 mt-2">
                        Success Rate
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
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Clarity Score</span>
                      <span className="text-lg font-bold text-purple-400">
                        {dashboardData.averages ? Math.round(dashboardData.averages.clarity_score) : 0}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">WPM Average</span>
                      <span className="text-lg font-bold text-blue-400">
                        {dashboardData.averages ? Math.round(dashboardData.averages.overall_wpm) : 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Strategic Pauses</span>
                      <span className="text-lg font-bold text-green-400">
                        {dashboardData.averages ? Math.round(dashboardData.averages.strategic_pauses) : 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Pitch Variety</span>
                      <span className="text-lg font-bold text-yellow-400">
                        {dashboardData.averages ? Math.round(dashboardData.averages.acoustic_metrics.pitch_monotony_score) : 0}%
                      </span>
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

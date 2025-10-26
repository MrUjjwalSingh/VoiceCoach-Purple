"use client"

import type React from "react"

import {Variants, motion } from "framer-motion"
import { Spotlight } from "../../_components/ui/spotlight"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Volume2,
  FastForward,
  PauseCircle,
  AlertCircle,
  Target,
  ArrowLeft,
  Award,
  MicOff,
  Waves,
  CheckCircle2,
  Lightbulb,
  TrendingUp,
  Zap,
} from "lucide-react"
import { useRouter } from "next/navigation"

// --- Animation Variants ---
const containerVariants : Variants= {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

const itemVariants : Variants= {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

const floatingVariants : Variants= {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  hover: {
    y: -8,
    transition: { duration: 0.3, ease: "easeOut" },
  },
}

// Simple Linear Progress Bar
interface ProgressBarProps {
  value: number
  label: string
  colorClass: string
}

const ProgressBar = ({ value, label, colorClass }: ProgressBarProps) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}%</span>
    </div>
    <div className="w-full bg-muted-foreground/20 rounded-full h-2.5 overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${colorClass}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      ></motion.div>
    </div>
  </div>
)

// Enhanced MetricCard Component
type MetricVariant = "primary" | "success" | "warning" | "info"

interface MetricCardProps {
  icon: React.ElementType
  label: string
  value: string | number
  subValue?: string
  variant?: MetricVariant
}

const MetricCard = ({ icon: Icon, label, value, subValue, variant = "primary" }: MetricCardProps) => {
  const variantClasses = {
    primary: "text-purple-400 bg-purple-500/10",
    success: "text-green-400 bg-green-500/10",
    warning: "text-yellow-400 bg-yellow-500/10",
    info: "text-cyan-400 bg-cyan-500/10",
  }
  const classes = variantClasses[variant]

  return (
    <motion.div variants={floatingVariants} whileHover="hover" className="group">
      <Card className="p-5 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-md border border-slate-700/50 hover:border-purple-500/40 transition-all duration-300 shadow-lg hover:shadow-purple-500/10">
        <div className="flex items-center space-x-4">
          <motion.div className={`p-3 rounded-lg ${classes} transition-all duration-300`} whileHover={{ scale: 1.1 }}>
            <Icon className="w-5 h-5" />
          </motion.div>
          <div>
            <div className="text-sm text-muted-foreground font-medium">{label}</div>
            <div className="text-2xl font-bold text-foreground">{value}</div>
            {subValue && <div className="text-xs text-muted-foreground mt-0.5">{subValue}</div>}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

const InsightItem = ({ insight, index }: { insight: any; index: number }) => {
  const isPositive = insight.type === "positive"

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
      className="group"
    >
      <div
        className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${
          isPositive
            ? "bg-green-500/5 border-green-500/20 hover:border-green-500/40 hover:bg-green-500/10"
            : "bg-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/40 hover:bg-yellow-500/10"
        }`}
      >
        <div className="flex items-start gap-3">
          <motion.div
            className={`p-2 rounded-full mt-0.5 flex-shrink-0 ${isPositive ? "bg-green-500/20" : "bg-yellow-500/20"}`}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            {isPositive ? (
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            ) : (
              <Lightbulb className="w-4 h-4 text-yellow-400" />
            )}
          </motion.div>
          <div className="flex-1">
            <p className="text-sm text-foreground leading-relaxed">{insight.text}</p>
            <p className="text-xs text-muted-foreground mt-1.5">
              {isPositive ? "✓ Keep it up!" : "💡 Tip for improvement"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Main Page Component
export default function ResultPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  const analysisResult = {
    id: params.id,
    topic: "Marketing Strategy 2024",
    date: "2024-02-20T10:30:00",
    clarityScore: 91,
    wpm: 144.1,
    fillerCount: 3,
    strategicPauses: 8,
    hesitationGaps: 2,
    relevanceScore: "High",
    volumeStatus: "Consistent",
    pitchMonotonyScore: 75,
    insights: [
      {
        id: 1,
        text: "Excellent pacing, right in the ideal 140-160 WPM range.",
        type: "positive",
      },
      {
        id: 2,
        text: "Very few filler words ('um', 'ah') detected. Great job!",
        type: "positive",
      },
      {
        id: 3,
        text: "Try to add more variation in pitch to keep listeners engaged.",
        type: "suggestion",
      },
    ],
  }

  const { clarityScore, pitchMonotonyScore } = analysisResult

  const getScoreColorClass = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="min-h-screen bg-black text-foreground relative overflow-hidden">
      <Spotlight className="top-0 left-0" fill="rgba(168, 85, 247, 0.15)" />
      <Spotlight className="bottom-40 right-0" fill="rgba(147, 51, 234, 0.1)" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 max-w-7xl">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* --- Header --- */}
          <motion.div variants={itemVariants} className="mb-12">
            <motion.div whileHover={{ x: -4 }} transition={{ duration: 0.2 }}>
              <Button
                onClick={() => router.back()}
                variant="ghost"
                className="flex items-center text-muted-foreground hover:text-purple-400 hover:bg-purple-500/10 mb-6 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Analyses
              </Button>
            </motion.div>
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-foreground mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {analysisResult.topic}
            </motion.h1>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Analyzed on:{" "}
              {new Date(analysisResult.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </motion.p>
          </motion.div>

          {/* --- Main Dashboard Grid --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* --- Left Column (Summary & Insights) --- */}
            <motion.div variants={itemVariants} className="lg:col-span-1 space-y-8">
              {/* --- Summary Card --- */}
              <section>
                <motion.h2
                  className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Award className="w-5 h-5 text-purple-400" />
                  Overall Performance
                </motion.h2>
                <motion.div variants={floatingVariants} whileHover="hover">
                  <Card className="p-6 bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:border-purple-500/40 shadow-xl hover:shadow-purple-500/15 transition-all duration-300 space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-foreground">Clarity Score</span>
                      <motion.span
                        className="text-4xl font-bold text-purple-400"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                      >
                        {analysisResult.clarityScore}
                        <span className="text-2xl text-muted-foreground">%</span>
                      </motion.span>
                    </div>
                    <ProgressBar
                      value={clarityScore}
                      label="Overall Clarity"
                      colorClass={getScoreColorClass(clarityScore)}
                    />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This score reflects your message's overall clarity, pacing, and confidence.
                    </p>
                  </Card>
                </motion.div>
              </section>

              {/* --- Key Insights Card --- */}
              <section>
                <motion.h2
                  className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Zap className="w-5 h-5 text-purple-400" />
                  Key Insights
                </motion.h2>
                <div className="space-y-3">
                  {analysisResult.insights.map((insight, idx) => (
                    <InsightItem key={insight.id} insight={insight} index={idx} />
                  ))}
                </div>
              </section>
            </motion.div>

            {/* --- Right Column (Detailed Metrics) --- */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-10">
              {/* --- Core Performance Metrics --- */}
              <section>
                <motion.h2
                  className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  Core Performance
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MetricCard
                    icon={FastForward}
                    label="Words Per Minute"
                    value={analysisResult.wpm}
                    subValue="Ideal: 140-160"
                    variant="primary"
                  />
                  <MetricCard
                    icon={MicOff}
                    label="Filler Count"
                    value={analysisResult.fillerCount}
                    subValue="Lower is better"
                    variant="success"
                  />
                  <MetricCard
                    icon={PauseCircle}
                    label="Strategic Pauses"
                    value={analysisResult.strategicPauses}
                    subValue="Pauses for emphasis"
                    variant="primary"
                  />
                  <MetricCard
                    icon={AlertCircle}
                    label="Hesitation Gaps"
                    value={analysisResult.hesitationGaps}
                    subValue="e.g., 'um', 'ah'"
                    variant="warning"
                  />
                </div>
              </section>

              {/* --- Acoustic Metrics --- */}
              <section>
                <motion.h2
                  className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Waves className="w-5 h-5 text-purple-400" />
                  Acoustic Metrics
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MetricCard
                    icon={Volume2}
                    label="Volume Status"
                    value={analysisResult.volumeStatus}
                    subValue="Clarity of audio"
                    variant="info"
                  />
                  <MetricCard
                    icon={Target}
                    label="Relevance Score"
                    value={analysisResult.relevanceScore}
                    subValue="Topic relevance"
                    variant="primary"
                  />
                  <motion.div variants={floatingVariants} whileHover="hover" className="md:col-span-2">
                    <Card className="p-5 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-md border border-slate-700/50 hover:border-purple-500/40 transition-all duration-300 shadow-lg hover:shadow-purple-500/10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <motion.div
                            className="p-3 rounded-lg text-purple-400 bg-purple-500/10 transition-all duration-300"
                            whileHover={{ scale: 1.1 }}
                          >
                            <Waves className="w-5 h-5" />
                          </motion.div>
                          <span className="text-lg font-medium text-foreground">Pitch Variety</span>
                        </div>
                        <motion.div
                          className="text-3xl font-bold text-purple-400"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.6, duration: 0.6 }}
                        >
                          {analysisResult.pitchMonotonyScore}
                          <span className="text-xl text-muted-foreground">%</span>
                        </motion.div>
                      </div>
                      <ProgressBar
                        value={pitchMonotonyScore}
                        label="Vocal Dynamics"
                        colorClass={getScoreColorClass(pitchMonotonyScore)}
                      />
                      <div className="text-xs text-muted-foreground mt-3">
                        Higher score indicates more varied pitch and engaging delivery.
                      </div>
                    </Card>
                  </motion.div>
                </div>
              </section>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

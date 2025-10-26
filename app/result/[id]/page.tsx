"use client"

import type React from "react"
import { useState, useEffect, use } from "react"

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
  Loader2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/axios-util"
import { PacingChart } from "./components/pacing-chart"

// --- API Response Interface ---
interface TranscriptEntry {
  text: string;
  start: number;
  end: number;
  tags: string[];
}

interface RecordingData {
  _id: string;
  userId: string;
  filePath: string;
  results: {
    acoustic_metrics: {
      avg_volume_status: string;
      pitch_monotony_score: number;
    };
    clarity_score: number;
    overall_wpm: number;
    filler_count: number;
    strategic_pauses: number;
    hesitation_gaps: number;
    relevance_score: string | null;
    suggested_content: string[];
    vague_phrases_found: string[];
    feedback: string[];
    _id: string;
  };
  metadata: {
    filename: string;
    duration: number;
    file_size: number;
    format: string;
    _id: string;
  };
  transcription: {
    transcript: TranscriptEntry[];
  };
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  recording: RecordingData;
}

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
export default function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [recordingData, setRecordingData] = useState<RecordingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Unwrap the params promise
  const resolvedParams = use(params)

  // Fetch recording data from API
  useEffect(() => {
    const fetchRecordingData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await api.get(`/recording/get/${resolvedParams.id}`)
        const data: ApiResponse = response.data
        
        if (data.success && data.recording) {
          setRecordingData(data.recording)
        } else {
          setError('Failed to fetch recording data')
        }
      } catch (err: any) {
        console.error('Error fetching recording data:', err)
        setError(err.response?.data?.message || 'Failed to load recording data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecordingData()
  }, [resolvedParams.id])

  // Loading state
  if (isLoading) {
    return (
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
          <h2 className="text-xl font-semibold text-white">Loading Analysis Results...</h2>
          <p className="text-slate-400">Please wait while we fetch your data</p>
        </motion.div>
      </div>
    )
  }

  // Error state
  if (error || !recordingData) {
    return (
      <div className="min-h-screen bg-black text-foreground flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
          <h2 className="text-2xl font-semibold text-white">Error Loading Results</h2>
          <p className="text-slate-400">{String(error) || 'No data available'}</p>
          <Button
            onClick={() => router.back()}
            className="mt-4"
          >
            Go Back
          </Button>
        </motion.div>
      </div>
    )
  }

  // Transform API data to match component expectations
  const analysisResult = {
    id: String(recordingData._id),
    topic: String(recordingData.metadata.filename),
    date: String(recordingData.createdAt),
    clarityScore: Number(recordingData.results.clarity_score) || 0,
    wpm: Number(recordingData.results.overall_wpm) || 0,
    fillerCount: Number(recordingData.results.filler_count) || 0,
    strategicPauses: Number(recordingData.results.strategic_pauses) || 0,
    hesitationGaps: Number(recordingData.results.hesitation_gaps) || 0,
    relevanceScore: String(recordingData.results.relevance_score || "N/A"),
    volumeStatus: String(recordingData.results.acoustic_metrics.avg_volume_status),
    pitchMonotonyScore: Number(recordingData.results.acoustic_metrics.pitch_monotony_score) || 0,
    insights: (recordingData.results.feedback || []).slice(0, 2).map((feedback, index) => ({
      id: index + 1,
      text: String(feedback),
      type: String(feedback).includes('⚠️') ? "suggestion" : "positive",
    })),
    suggestedContent: (recordingData.results.suggested_content || []).map((content, index) => ({
      id: index + 1,
      text: String(content),
      type: "suggestion",
    })),
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

              {/* --- Suggested Content Card --- */}
              <section>
                <motion.h2
                  className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Lightbulb className="w-5 h-5 text-purple-400" />
                  Suggested Content
                </motion.h2>
                <div className="space-y-3">
                  {analysisResult.suggestedContent.length > 0 ? (
                    analysisResult.suggestedContent.map((content, idx) => (
                      <InsightItem key={content.id} insight={content} index={idx} />
                    ))
                  ) : (
                    <div className="p-4 rounded-lg border border-slate-700/50 bg-slate-900/30 text-center">
                      <p className="text-slate-400 text-sm">No content suggestions available</p>
                    </div>
                  )}
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

              {/* --- Pacing Analysis --- */}
              <section>
                <motion.h2
                  className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <FastForward className="w-5 h-5 text-purple-400" />
                  Pacing Analysis
                </motion.h2>
                <motion.div variants={floatingVariants} whileHover="hover">
                  <Card className="p-6 bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:border-purple-500/40 shadow-xl hover:shadow-purple-500/15 transition-all duration-300">
                    {recordingData?.transcription?.transcript && recordingData.transcription.transcript.length > 0 ? (
                      <PacingChart
                        transcript={recordingData.transcription.transcript}
                        averageWPM={analysisResult.wpm}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12">
                        <AlertCircle className="w-12 h-12 text-slate-400 mb-4" />
                        <p className="text-slate-400">No transcript data available for pacing analysis</p>
                      </div>
                    )}
                  </Card>
                </motion.div>
              </section>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"
import { Variants, motion } from "framer-motion"
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
  BarChartHorizontal, // New icon for the chart
} from "lucide-react"
import { useRouter } from "next/navigation"

// --- Import the new components ---
// Adjust paths as needed

import { PacingChart } from "@/components/PacingChart"

// --- Animation Variants ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

const floatingVariants: Variants = {
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

const MetricCard = ({
  icon: Icon,
  label,
  value,
  subValue,
  variant = "primary",
}: MetricCardProps) => {
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
          <motion.div
            className={`p-3 rounded-lg ${classes} transition-all duration-300`}
            whileHover={{ scale: 1.1 }}
          >
            <Icon className="w-5 h-5" />
          </motion.div>
          <div>
            <div className="text-sm text-muted-foreground font-medium">
              {label}
            </div>
            <div className="text-2xl font-bold text-foreground">{value}</div>
            {subValue && (
              <div className="text-xs text-muted-foreground mt-0.5">
                {subValue}
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// Updated InsightItem to parse new feedback format
const InsightItem = ({
  feedbackText,
  index,
}: {
  feedbackText: string
  index: number
}) => {
  let type: "positive" | "suggestion" | "content" = "suggestion"
  let text = feedbackText

  if (text.startsWith("✅") || text.startsWith("⭐")) {
    type = "positive"
  } else if (text.startsWith("🛑")) {
    type = "suggestion"
  } else if (text.startsWith("🧠") || text.startsWith("📚") || text.trim().startsWith("-")) {
    type = "content"
    // Clean up content suggestions
    text = text.replace(/(\n?🧠|\n?📚|   - )/g, "").trim()
  }

  // Clean up emojis/prefixes
  text = text
    .replace(
      /^(✅|⭐|🛑|🧠|📚|   - ) /g,
      "",
    )
    .trim()

  const isPositive = type === "positive"

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
        } ${type === "content" && "bg-cyan-500/5 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-cyan-500/10"}`}
      >
        <div className="flex items-start gap-3">
          <motion.div
            className={`p-2 rounded-full mt-0.5 flex-shrink-0 ${
              isPositive
                ? "bg-green-500/20"
                : type === "content"
                  ? "bg-cyan-500/20"
                  : "bg-yellow-500/20"
            }`}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            {isPositive ? (
              <CheckCircle2
                className={`w-4 h-4 ${isPositive ? "text-green-400" : "text-yellow-400"}`}
              />
            ) : (
              <Lightbulb
                className={`w-4 h-4 ${type === "content" ? "text-cyan-400" : "text-yellow-400"}`}
              />
            )}
          </motion.div>
          <div className="flex-1">
            <p className="text-sm text-foreground leading-relaxed">{text}</p>
            <p className="text-xs text-muted-foreground mt-1.5">
              {isPositive
                ? "✓ Keep it up!"
                : type === "content"
                  ? "💡 Content Suggestion"
                  : "💡 Tip for improvement"}
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

  // --- MOCK DATA updated from your API response ---
  // In a real app, you would fetch this data
  const apiResponse = {
    success: true,
    message: "Recording created successfully",
    recording: {
      userId: "68fdab11407c5d83eb7558c3",
      filePath:
        "https://res.cloudinary.com/dx400fn4k/video/upload/v1761473849/voicecoach/recordings/esfcqzo5fxordgjebhmp.wav",
      results: {
        clarity_score: 88,
        overall_wpm: 150.3,
        filler_count: 0,
        strategic_pauses: 28,
        hesitation_gaps: 0,
        acoustic_metrics: {
          avg_volume_status: "Normal",
          pitch_monotony_score: 93,
        },
        relevance_score: 1,
        feedback: [
          "✅ Pacing: Your overall speed (150 WPM) is within range.",
          "⭐ Pause Success: Found 28 strategic pauses. Use these more!",
          "🛑 Monotony Alert: Your delivery is flat (Score 93.0/100). Vary your tone and pitch.",
          "\n🧠 **Content Relevance Score**: 1/10",
          "🛑 **Content Warning**: Your presentation may lack focus on the core topic. Review your structure.",
          "\n📚 **Recommended Content to Add**",
          "   - Include information about famous French landmarks like the Eiffel Tower, Louvre Museum, or Notre Dame Cathedral.",
          "   - Discuss key aspects of French culture, such as its renowned cuisine, art, or fashion.",
          "   - Provide details on France's geography, major cities, or historical significance.",
        ],
        _id: "68fdf546bc4548fd1bf79747",
      },
      transcription: {
        transcript: [
          { text: "बहुत", start: 0, end: 0.52, tags: [], _id: "..." },
          { text: "बड़ा", start: 0.52, end: 0.46, tags: ["long_pause"], _id: "..." },
          { text: "जानवर", start: 0.98, end: 0.29, tags: ["long_pause"], _id: "..." },
          { text: "है।", start: 1.27, end: 0.29, tags: ["long_pause"], _id: "..." },
          { text: "हाथी", start: 1.56, end: 0.49, tags: ["strategic_pause"], _id: "..." },
          { text: "के", start: 2.05, end: 0.31, tags: ["strategic_pause"], _id: "..." },
          { text: "एक", start: 2.36, end: 0.39, tags: ["strategic_pause"], _id: "..." },
          { text: "सून", start: 2.75, end: 0.33, tags: ["strategic_pause"], _id: "..." },
          { text: "और", start: 3.08, end: 0.46, tags: ["strategic_pause"], _id: "..." },
          { text: "चार", start: 3.54, end: 0.49, tags: ["strategic_pause"], _id: "..." },
          { text: "पैर", start: 4.03, end: 0.36, tags: ["strategic_pause"], _id: "..." },
          { text: "होते", start: 4.39, end: 0.46, tags: ["strategic_pause"], _id: "..." },
          { text: "हैं", start: 4.85, end: 0.42, tags: ["strategic_pause"], _id: "..." },
          { text: "और", start: 5.27, end: 0.42, tags: ["strategic_pause"], _id: "..." },
          { text: "एक", start: 5.68, end: 0.43, tags: ["strategic_pause"], _id: "..." },
          { text: "पूछ", start: 6.11, end: 0.44, tags: ["strategic_pause"], _id: "..." },
          { text: "होती", start: 6.55, end: 0.3, tags: ["strategic_pause"], _id: "..." },
          { text: "है।", start: 6.85, end: 0.45, tags: ["strategic_pause"], _id: "..." },
          { text: "और", start: 7.3, end: 0.33, tags: ["strategic_pause"], _id: "..." },
          { text: "दोसी", start: 7.64, end: 0.43, tags: ["strategic_pause"], _id: "..." },
          { text: "बहुत", start: 8.07, end: 0.46, tags: ["strategic_pause"], _id: "..." },
          { text: "बड़ा", start: 8.53, end: 0.3, tags: ["strategic_pause"], _id: "..." },
          { text: "बहन", start: 8.83, end: 0.32, tags: ["strategic_pause"], _id: "..." },
          { text: "का", start: 9.15, end: 0.38, tags: ["strategic_pause"], _id: "..." },
          { text: "लोड़ा", start: 9.53, end: 0.48, tags: ["strategic_pause"], _id: "..." },
          { text: "है।", start: 10.01, end: 0.49, tags: ["strategic_pause"], _id: "..." },
          { text: "उसके", start: 10.5, end: 0.49, tags: ["strategic_pause"], _id: "..." },
          { text: "पास", start: 10.99, end: 0.52, tags: ["strategic_pause"], _id: "..." },
          { text: "दो", start: 11.51, end: 0.39, tags: ["strategic_pause"], _id: "..." },
          { text: "तूटे", start: 11.9, end: 0.29, tags: ["strategic_pause"], _id: "..." },
          { text: "हुए", start: 12.19, end: 0.29, tags: ["strategic_pause"], _id: "..." },
          { text: "दांत", start: 12.48, end: 0.34, tags: ["strategic_pause"], _id: "..." },
          { text: "है।", start: 12.82, end: 0.35, tags: [], _id: "..." },
        ],
        _id: "68fdf546bc4548fd1bf79749",
      },
      _id: "68fdf546bc4548fd1bf79746",
      createdAt: "2025-10-26T10:17:42.134Z",
      updatedAt: "2025-10-26T10:17:42.134Z",
    },
  }
  // --- END MOCK DATA ---

  // Flatten the data for easier access in the component
  const analysisResult = {
    id: params.id,
    topic: "Presentation on France", // Topic from API is missing, so we mock it
    date: apiResponse.recording.createdAt,
    cloudinaryAudioUrl: apiResponse.recording.filePath,
    clarityScore: apiResponse.recording.results.clarity_score,
    wpm: apiResponse.recording.results.overall_wpm,
    fillerCount: apiResponse.recording.results.filler_count,
    strategicPauses: apiResponse.recording.results.strategic_pauses,
    hesitationGaps: apiResponse.recording.results.hesitation_gaps,
    relevanceScore: `${apiResponse.recording.results.relevance_score}/10`,
    volumeStatus: apiResponse.recording.results.acoustic_metrics.avg_volume_status,
    pitchMonotonyScore:
      apiResponse.recording.results.acoustic_metrics.pitch_monotony_score,
    feedback: apiResponse.recording.results.feedback,
    transcript: apiResponse.recording.transcription.transcript,
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
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
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
            <motion.div
              variants={itemVariants}
              className="lg:col-span-1 space-y-8"
            >
              {/* --- UPDATED AUDIO PLAYER SECTION --- */}
              <section>
                <motion.h2
                  className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Waves className="w-5 h-5 text-purple-400" />
                  Audio Playback
                </motion.h2>
                <motion.div variants={floatingVariants} whileHover="hover">
                  <Card className="p-4 bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:border-purple-500/40 shadow-xl hover:shadow-purple-500/15 transition-all duration-300">
                    {/* Simple native audio player (removed WaveformPlayer dependency) */}
                    <audio
                      controls
                      src={analysisResult.cloudinaryAudioUrl}
                      className="w-full rounded-md bg-black/40"
                    >
                      Your browser does not support the audio element.
                    </audio>
                  </Card>
                </motion.div>
              </section>
              {/* --- END AUDIO PLAYER SECTION --- */}

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
                      <span className="text-lg font-medium text-foreground">
                        Clarity Score
                      </span>
                      <motion.span
                        className="text-4xl font-bold text-purple-400"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                      >
                        {analysisResult.clarityScore}
                        <span className="text-2xl text-muted-foreground">
                          %
                        </span>
                      </motion.span>
                    </div>
                    <ProgressBar
                      value={clarityScore}
                      label="Overall Clarity"
                      colorClass={getScoreColorClass(clarityScore)}
                    />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This score reflects your message's overall clarity,
                      pacing, and confidence.
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
                  {analysisResult.feedback.map((fb, idx) => (
                    <InsightItem
                      key={idx}
                      feedbackText={fb}
                      index={idx}
                    />
                  ))}
                </div>
              </section>
            </motion.div>

            {/* --- Right Column (Detailed Metrics & NEW CHART) --- */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 space-y-10"
            >
              {/* --- NEW PACING CHART SECTION --- */}
              <section>
                <motion.h2
                  className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <BarChartHorizontal className="w-5 h-5 text-purple-400" />
                  Pacing Over Time
                </motion.h2>
                <motion.div variants={floatingVariants} whileHover="hover">
                  <Card className="p-6 pt-10 bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:border-purple-500/40 shadow-xl hover:shadow-purple-500/15 transition-all duration-300">
                    <PacingChart
                      transcript={analysisResult.transcript}
                      averageWPM={analysisResult.wpm}
                    />
                  </Card>
                </motion.div>
              </section>
              {/* --- END PACING CHART SECTION --- */}

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
                    subValue="Overall Average"
                    variant="primary"
                  />
                  <MetricCard
                    icon={MicOff}
                    label="Filler Count"
                    value={analysisResult.fillerCount}
                    subValue="Lower is better"
                    variant={
                      analysisResult.fillerCount === 0 ? "success" : "warning"
                    }
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
                    variant={
                      analysisResult.hesitationGaps === 0 ? "success" : "warning"
                    }
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
                    subValue="Audio clarity"
                    variant="info"
                  />
                  <MetricCard
                    icon={Target}
                    label="Relevance Score"
                    value={analysisResult.relevanceScore}
                    subValue="Topic relevance"
                    variant={
                      apiResponse.recording.results.relevance_score > 5
                        ? "success"
                        : "warning"
                    }
                  />
                  <motion.div
                    variants={floatingVariants}
                    whileHover="hover"
                    className="md:col-span-2"
                  >
                    <Card className="p-5 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-md border border-slate-700/50 hover:border-purple-500/40 transition-all duration-300 shadow-lg hover:shadow-purple-500/10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <motion.div
                            className="p-3 rounded-lg text-purple-400 bg-purple-500/10 transition-all duration-300"
                            whileHover={{ scale: 1.1 }}
                          >
                            <Waves className="w-5 h-5" />
                          </motion.div>
                          <span className="text-lg font-medium text-foreground">
                            Pitch Variety
                          </span>
                        </div>
                        <motion.div
                          className="text-3xl font-bold text-purple-400"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.6, duration: 0.6 }}
                        >
                          {analysisResult.pitchMonotonyScore}
                          <span className="text-xl text-muted-foreground">
                            %
                          </span>
                        </motion.div>
                      </div>
                      <ProgressBar
                        value={pitchMonotonyScore}
                        label="Vocal Dynamics"
                        colorClass={getScoreColorClass(pitchMonotonyScore)}
                      />
                      <div className="text-xs text-muted-foreground mt-3">
                        Higher score indicates more varied pitch and engaging
                        delivery.
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
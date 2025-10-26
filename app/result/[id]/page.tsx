"use client"

import { motion } from "framer-motion"
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
} from "lucide-react"
import { useRouter } from "next/navigation"

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

// --- !! NEW VISUAL COMPONENT !! ---

// Simple Linear Progress Bar
interface ProgressBarProps {
  value: number // 0-100
  label: string
  colorClass: string // Tailwind color class for the bar fill
}

const ProgressBar = ({ value, label, colorClass }: ProgressBarProps) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}%</span>
    </div>
    <div className="w-full bg-muted-foreground/20 rounded-full h-2">
      <motion.div
        className={`h-full rounded-full ${colorClass}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.0, ease: "easeOut" }}
      ></motion.div>
    </div>
  </div>
)

// --- Enhanced MetricCard Component ---
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
  // Color mapping to fix Tailwind Purge issue
  const variantClasses = {
    // UPDATED: Changed 'primary' to blue-500
    primary: "text-blue-500 bg-blue-500/10",
    success: "text-green-400 bg-green-500/10",
    warning: "text-yellow-400 bg-yellow-500/10",
    // UPDATED: Changed 'info' to sky-400 to avoid clash
    info: "text-sky-400 bg-sky-500/10",
  }
  const classes = variantClasses[variant]

  return (
    // UPDATED: Card styles
    <Card className="p-5 bg-blue-500/20 backdrop-blur-md border border-blue-500/50">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${classes}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-2xl font-bold text-foreground">{value}</div>
          {subValue && (
            <div className="text-xs text-muted-foreground">{subValue}</div>
          )}
        </div>
      </div>
    </Card>
  )
}

// --- Main Page Component ---
export default function ResultPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  // --- Sample data (same as before) ---
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

  // Helper to determine color class based on score
  const getScoreColorClass = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="min-h-screen bg-black text-foreground relative overflow-hidden">
      {/* UPDATED: Spotlight colors */}
      <Spotlight className="top-0 left-0" fill="rgba(59, 130, 246, 0.3)" />
      <Spotlight className="bottom-40 right-0" fill="rgba(56, 189, 248, 0.2)" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* --- Header --- */}
          <motion.div variants={itemVariants} className="mb-10">
            <Button
              onClick={() => router.back()}
              variant="ghost"
              className="flex items-center text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Analyses
            </Button>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              {analysisResult.topic}
            </h1>
            <p className="text-muted-foreground">
              Analyzed on:{" "}
              {new Date(analysisResult.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </motion.div>

          {/* --- Main Dashboard Grid --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* --- Left Column (Summary & Insights) --- */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-1 space-y-8"
            >
              {/* --- Summary Card (with ProgressBar) --- */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Overall Performance
                </h2>
                {/* UPDATED: Card styles */}
                <Card className="p-6 bg-blue-500/20 backdrop-blur-md border border-blue-500/50 shadow-xl space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* UPDATED: Icon color */}
                      <Award className="w-6 h-6 text-blue-500" />
                      <span className="text-lg font-medium text-foreground">
                        Clarity Score
                      </span>
                    </div>
                    <span className="text-4xl font-bold text-foreground">
                      {analysisResult.clarityScore}
                      <span className="text-2xl text-muted-foreground">%</span>
                    </span>
                  </div>
                  <ProgressBar
                    value={clarityScore}
                    label="Overall Clarity"
                    colorClass={getScoreColorClass(clarityScore)}
                  />
                  <p className="text-sm text-muted-foreground">
                    This score reflects your message's overall clarity, pacing,
                    and confidence.
                  </p>
                </Card>
              </section>

              {/* --- Key Insights Card --- */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Key Insights
                </h2>
                {/* UPDATED: Card styles */}
                <Card className="p-6 bg-blue-500/20 backdrop-blur-md border border-blue-500/50 space-y-4">
                  {analysisResult.insights.map((insight) => (
                    <div
                      key={insight.id}
                      className="flex items-start space-x-3"
                    >
                      <div
                        className={`p-1 rounded-full mt-1 ${
                          insight.type === "positive"
                            ? "bg-green-500/20"
                            : "bg-yellow-500/20"
                        }`}
                      >
                        {insight.type === "positive" ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : (
                          <Lightbulb className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {insight.text}
                      </p>
                    </div>
                  ))}
                </Card>
              </section>
            </motion.div>

            {/* --- Right Column (Detailed Metrics) --- */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 space-y-10"
            >
              {/* --- Core Performance Metrics --- */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Core Performance
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <MetricCard
                    icon={Target}
                    label="Relevance Score"
                    value={analysisResult.relevanceScore}
                    subValue="Topic relevance"
                    variant="primary"
                  />
                </div>
              </section>

              {/* --- Acoustic Metrics (with ProgressBar) --- */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Acoustic Metrics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MetricCard
                    icon={Volume2}
                    label="Volume Status"
                    value={analysisResult.volumeStatus}
                    subValue="Clarity of audio"
                    variant="info"
                  />
                  {/* Pitch Variety now uses ProgressBar */}
                  {/* UPDATED: Card styles */}
                  <Card className="p-5 bg-blue-500/20 backdrop-blur-md border border-blue-500/50">
                    <div className="flex items-center space-x-4 mb-4">
                      {/* UPDATED: Icon colors */}
                      <div className="p-3 rounded-lg text-blue-500 bg-blue-500/10">
                        <Waves className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Pitch Variety
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                          {analysisResult.pitchMonotonyScore}
                          <span className="text-2xl text-muted-foreground">
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                    <ProgressBar
                      value={pitchMonotonyScore}
                      label="Vocal Dynamics"
                      colorClass={getScoreColorClass(pitchMonotonyScore)}
                    />
                    <div className="text-xs text-muted-foreground mt-2">
                      Higher score indicates more varied pitch.
                    </div>
                  </Card>
                </div>
              </section>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
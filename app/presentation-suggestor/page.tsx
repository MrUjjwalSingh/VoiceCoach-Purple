"use client"

import { type Variants, motion } from "framer-motion"
import { useState, type FormEvent, useEffect } from "react"
import { Spotlight } from "../_components/ui/spotlight"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Presentation, Wand2, ImageIcon, Check, Clock, MoreVertical, X, Lightbulb, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import UnifiedSidebar from "../_components/layout/unified-sidebar"
import { api } from "@/lib/axios-util"

// Define Slide, PresentationData, and PastPresentation types
type Slide = {
  _id?: string
  slide_title: string
  main_points: string[]
  visual_suggestion: string
}

type PresentationData = {
  topic: string
  time_limit_minutes: number
  slides: Slide[]
  template_suggestion: string
}

type PastPresentation = {
  _id: string
  topic: string
  time_limit_minutes: number
  slides: Slide[]
  template_suggestion: string
}

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
}

const slideCardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

const floatingVariants: Variants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
}

const pulseVariants = {
  animate: {
    boxShadow: ["0 0 0 0 rgba(168, 85, 247, 0.4)", "0 0 0 10px rgba(168, 85, 247, 0)"],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
    },
  },
}

// --- Slide Card Component ---
const SlideCard = ({ slide, index }: { slide: Slide; index: number }) => (
  <motion.div
    variants={slideCardVariants}
    className="group relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
  >
    <div className="flex items-start justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center">
          <span className="text-sm font-bold text-purple-400">{index + 1}</span>
        </div>
        <h4 className="font-semibold text-white text-lg leading-tight max-w-xs">{slide.slide_title}</h4>
      </div>
    </div>

    {/* Key Points Section */}
    <div className="mb-5 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full" />
        <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Key Points</h5>
      </div>
      <ul className="space-y-2 pl-5">
        {slide.main_points.map((point, pIndex) => (
          <motion.li
            key={pIndex}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: pIndex * 0.05 }}
            className="text-slate-300 text-sm leading-relaxed flex items-start gap-2"
          >
            <span className="text-purple-400 font-bold mt-0.5">•</span>
            <span>{point}</span>
          </motion.li>
        ))}
      </ul>
    </div>

    {/* Visual Suggestion Section */}
    <div className="pt-4 border-t border-slate-700/50">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="w-4 h-4 text-purple-400" />
        <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Visual Suggestion</h5>
      </div>
      <p className="text-slate-400 text-sm leading-relaxed pl-6">{slide.visual_suggestion}</p>
    </div>
  </motion.div>
)

// --- Header ---
const Header = () => (
  <motion.header
    className="h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 flex items-center px-6 flex-shrink-0"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h1 className="text-base font-semibold text-white">Presentation Analysis</h1>
    <div className="flex-1" />
    <motion.div whileHover={{ scale: 1.05 }}>
      <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800/50">
        Profile
      </Button>
    </motion.div>
  </motion.header>
)

// --- Page Component ---
export default function PresentationGeneratorPage() {
  const router = useRouter()
  const [topic, setTopic] = useState("")
  const [timeLimit, setTimeLimit] = useState("5")
  const [isLoading, setIsLoading] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [generatedSlides, setGeneratedSlides] = useState<Slide[] | null>(null)
  const [presentationData, setPresentationData] = useState<PresentationData | null>(null)
  const [pastPresentations, setPastPresentations] = useState<PastPresentation[]>([])
  const [isLoadingPastPresentations, setIsLoadingPastPresentations] = useState(false)
  const [selectedPresentation, setSelectedPresentation] = useState<PastPresentation | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Declare functions here
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!topic) return

    setIsLoading(true)
    setGeneratedSlides(null)
    setPresentationData(null)

    try {
      // Make API call to presentation creation endpoint
      const response = await api.post('/presentation/create', {
        topic: topic,
        timelimit: timeLimit,
      })

      const data = response.data
      
      if (data.success && data.presentation) {
        setPresentationData(data.presentation)
        setGeneratedSlides(data.presentation.slides)
        // Refresh past presentations after creating a new one
        fetchPastPresentations()
      } else {
        console.error('Failed to generate presentation:', data.message)
        // Show error message instead of fallback
        alert('Failed to generate presentation. Please try again.')
      }
    } catch (error) {
      console.error('Error generating presentation:', error)
      // Show error message instead of fallback
      alert('Error generating presentation. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (!generatedSlides) return

    const formattedText = generatedSlides
      .map((slide) => {
        const points = slide.main_points
          .map((point) => `  - ${point}`)
          .join("\n")
        return `
## ${slide.slide_title}
**Key Points:**
${points}

**Visual Suggestion:**
${slide.visual_suggestion}
--------------------
      `
      })
      .join("\n")

    navigator.clipboard.writeText(formattedText.trim())
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleReset = () => {
    setTopic("")
    setTimeLimit("5")
    setGeneratedSlides(null)
    setPresentationData(null)
    setIsCopied(false)
  }

  const handleViewPresentation = (presentation: PastPresentation) => {
    setSelectedPresentation(presentation)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedPresentation(null)
  }

  const fetchPastPresentations = async () => {
    setIsLoadingPastPresentations(true)
    try {
      const response = await api.get('/presentation/get')
      const data = response.data
      
      if (data.success && data.data) {
        setPastPresentations(data.data)
      }
    } catch (error) {
      console.error('Error fetching past presentations:', error)
    } finally {
      setIsLoadingPastPresentations(false)
    }
  }

  useEffect(() => {
    fetchPastPresentations()
  }, [])

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <UnifiedSidebar />

      <div className="flex-1 flex flex-col pl-72">
        <Header />

        <main className="flex-1 relative overflow-y-auto overflow-x-hidden">
          {/* Decorative Spotlights */}
          <Spotlight className="top-0 left-0" fill="rgba(168, 85, 247, 0.15)" />
          <Spotlight className="top-1/3 right-1/4" fill="rgba(147, 51, 234, 0.1)" />

          {/* Main Section */}
          <div className="relative z-10 container mx-auto px-4 sm:px-6 py-16 max-w-5xl">
            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-12"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full" />
                <span className="text-sm font-semibold text-purple-400 uppercase tracking-wide">
                  AI-Powered Structure
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Build Your{" "}
                <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                  Slides
                </span>
              </h1>

              <p className="text-lg text-slate-400 max-w-2xl">
                Just give us your topic. Our AI will outline your entire presentation, slide by slide, with key talking
                points.
              </p>
            </motion.div>

            {/* Content Section */}
            <Card className="p-8 sm:p-10 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl border border-slate-800 shadow-2xl hover:shadow-purple-500/10 hover:border-slate-700 transition-all duration-300">
              {/* === CONDITIONAL CONTENT === */}

              {isLoading ? (
                // 1. Loading State
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex flex-col items-center justify-center text-center p-8 min-h-[400px]"
                >
                  <motion.div
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mb-6"
                    variants={pulseVariants}
                    animate="animate"
                  >
                    <Wand2 className="w-10 h-10 text-purple-400" />
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-white mt-6">Building your presentation...</h3>
                  <p className="text-slate-400 mt-2">Our AI is drafting your slide structure. Please wait.</p>
                </motion.div>
              ) : generatedSlides ? (
                // 2. Result State
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {/* Header with metadata */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-slate-700/50">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3">Your Generated Slide Outline</h3>
                      {presentationData && (
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-purple-400" />
                            <span>{presentationData.topic}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-purple-400" />
                            <span>{presentationData.time_limit_minutes} min</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Presentation className="w-4 h-4 text-purple-400" />
                            <span>{presentationData.slides.length} slides</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={handleCopy}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white gap-2 mt-4 sm:mt-0 shadow-lg hover:shadow-purple-500/50"
                    >
                      {isCopied ? <Check className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                      {isCopied ? "Copied!" : "Copy Outline"}
                    </Button>
                  </div>

                  {/* Template Suggestion */}
                  {presentationData && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="mb-8 p-4 bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg"
                    >
                      <h4 className="text-sm font-semibold text-purple-400 mb-2 flex items-center gap-2 uppercase tracking-wide">
                        <Zap className="w-4 h-4" />
                        Template Suggestion
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed">{presentationData.template_suggestion}</p>
                    </motion.div>
                  )}

                  {/* Slides Grid */}
                  <div className="pr-2 max-h-[600px] overflow-y-auto">
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                    >
                      {generatedSlides.map((slide, index) => (
                        <SlideCard key={slide._id || index} slide={slide} index={index} />
                      ))}
                    </motion.div>
                  </div>

                  <Button variant="link" onClick={handleReset} className="text-purple-400 hover:text-purple-300 mt-8">
                    Generate Another Outline
                  </Button>
                </motion.div>
              ) : (
                // 3. Default Form State
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  {/* Topic Input */}
                  <div>
                    <label htmlFor="topic" className="block text-sm font-semibold text-white mb-3">
                      What is your presentation about?
                    </label>
                    <textarea
                      id="topic"
                      rows={4}
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-slate-500 transition-all duration-200"
                      placeholder="e.g., 'An overview of Artificial Intelligence for beginners'"
                      required
                    />
                  </div>

                  {/* Time Limit Input */}
                  <div>
                    <label htmlFor="timeLimit" className="block text-sm font-semibold text-white mb-3">
                      Time Limit (minutes)
                    </label>
                    <div className="relative">
                      <select
                        id="timeLimit"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white transition-all duration-200 appearance-none"
                        required
                      >
                        <option value="0.5">0.5 minutes</option>
                        <option value="1.0">1 minute</option>
                        <option value="2.0">2 minutes</option>
                        <option value="3.0">3 minutes</option>
                        <option value="4.0">4 minutes</option>
                        <option value="5.0">5 minutes</option>
                      </select>
                      <Clock className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/50"
                    disabled={isLoading}
                  >
                    <Wand2 className="w-5 h-5 mr-2" />
                    Generate Slide Outline
                  </Button>
                </motion.form>
              )}
            </Card>

            {/* Past Generated Presentations */}
            {isLoadingPastPresentations ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mt-8"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full" />
                  <h2 className="text-2xl font-bold text-white">Past Generated Presentations</h2>
                </div>
                <div className="flex items-center justify-center py-8">
                  <div className="text-slate-400">Loading presentations...</div>
                </div>
              </motion.div>
            ) : pastPresentations.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mt-8"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full" />
                  <h2 className="text-2xl font-bold text-white">Past Generated Presentations</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pastPresentations.map((presentation) => (
                    <motion.div
                      key={presentation._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-purple-500/50 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-lg mb-1">{presentation.topic}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span>{presentation.time_limit_minutes} min</span>
                            <span>{presentation.slides.length} slides</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewPresentation(presentation)}
                          className="text-slate-400 hover:text-purple-400 p-1"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>

                      <p className="text-slate-300 text-sm mb-3 line-clamp-2">{presentation.template_suggestion}</p>

                      <div className="text-xs text-slate-500">
                        {presentation.slides.length} slides • {presentation.time_limit_minutes} min
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mt-8"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full" />
                  <h2 className="text-2xl font-bold text-white">Past Generated Presentations</h2>
                </div>
                <div className="flex items-center justify-center py-8">
                  <div className="text-slate-400">
                    No presentations generated yet. Create your first presentation above!
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* Modal for viewing past presentation */}
      {isModalOpen && selectedPresentation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-slate-900 border border-slate-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedPresentation.topic}</h2>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span>{selectedPresentation.time_limit_minutes} minutes</span>
                  <span>{selectedPresentation.slides.length} slides</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={closeModal} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Template Suggestion */}
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg">
                <h4 className="text-lg font-semibold text-purple-400 mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Template Suggestion
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">{selectedPresentation.template_suggestion}</p>
              </div>

              {/* Slides Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {selectedPresentation.slides.map((slide, index) => (
                  <SlideCard key={slide._id || index} slide={slide} index={index} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

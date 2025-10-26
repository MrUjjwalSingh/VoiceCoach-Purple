"use client"

import { motion } from "framer-motion"
import { useState, ChangeEvent, FormEvent } from "react"
import { Spotlight } from "../_components/ui/spotlight"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Upload,
  X,
  FileAudio,
  Clock,
  Loader2,
  Info,
  LayoutDashboard,
  FolderClock,
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

// --- !! PLACEHOLDER COMPONENTS !! ---
// Replace these with your actual shared layout components

const DashboardSidebar = () => (
  // UPDATED: Sidebar colors
  <aside className="w-64 bg-gray-900/50 border-r border-blue-500/20 p-6 hidden md:block flex-shrink-0">
    <h2 className="text-xl font-bold mb-8 text-foreground">YourLogo</h2>
    <nav className="space-y-4">
      <a
        href="#"
        className="flex items-center p-2 rounded-lg text-muted-foreground hover:bg-blue-500/10 hover:text-blue-500"
      >
        <LayoutDashboard className="w-5 h-5 mr-3" />
        Dashboard
      </a>
      <a
        href="#"
        className="flex items-center p-2 rounded-lg bg-blue-500/20 text-blue-500 font-medium"
      >
        <FileAudio className="w-5 h-5 mr-3" />
        Analysis
      </a>
      <a
        href="#"
        className="flex items-center p-2 rounded-lg text-muted-foreground hover:bg-blue-500/10 hover:text-blue-500"
      >
        <FolderClock className="w-5 h-5 mr-3" />
        History
      </a>
    </nav>
  </aside>
)

const Header = () => (
  // UPDATED: Header colors
  <header className="h-16 bg-black/50 backdrop-blur-sm border-b border-blue-500/20 flex items-center px-6 flex-shrink-0">
    <h1 className="text-lg font-medium text-foreground">
      Presentation Analysis
    </h1>
    <div className="flex-1" />
    <Button variant="ghost">User Profile</Button>
  </header>
)

// --- Page Component ---
export default function PresentationAnalysisPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [topic, setTopic] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const previousRecordings = [
    { id: 1, topic: "Marketing Strategy 2024", date: "2024-01-15T14:30:00" },
    { id: 2, topic: "Product Launch Presentation", date: "2024-01-10T11:20:00" },
  ]

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0])
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    const fileInput = document.getElementById("audio-upload") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setSelectedFile(null)
      setTopic("")
      router.push(`/result/new-result-id`)
    }, 3000)
  }

  return (
    <div className="flex min-h-screen bg-black text-foreground">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 relative overflow-y-auto overflow-x-hidden">
          {/* UPDATED: Spotlight colors */}
          <Spotlight
            className="top-0 left-0"
            fill="rgba(59, 130, 246, 0.3)"
          />
          <Spotlight
            className="top-1/3 right-1/4"
            fill="rgba(56, 189, 248, 0.2)"
          />
          <Spotlight
            className="bottom-40 right-0"
            fill="rgba(59, 130, 246, 0.2)"
          />

          <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-center mb-3">
                Analyze a New Presentation
              </h1>
              <p className="text-lg text-muted-foreground text-center">
                Upload your presentation audio to get started.
              </p>
            </motion.div>

            {/* --- Integrated Upload Form --- */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              {/* UPDATED: Card styles */}
              <Card className="p-6 sm:p-8 mb-12 bg-blue-500/20 backdrop-blur-md border border-blue-500/50 shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="audio-upload"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Upload Audio File
                    </label>
                    {/* UPDATED: File input styles */}
                    <div
                      className={`flex ${
                        selectedFile ? "justify-between" : "justify-center"
                      } items-center w-full px-4 py-6 bg-black/20 text-blue-500 rounded-lg border-2 border-dashed border-blue-500/20 transition-colors duration-200 ${
                        !selectedFile
                          ? "hover:bg-blue-500/10 cursor-pointer"
                          : ""
                      }`}
                    >
                      {!selectedFile ? (
                        <label
                          htmlFor="audio-upload"
                          className="flex flex-col items-center cursor-pointer"
                        >
                          <FileAudio className="w-8 h-8 mb-2" />
                          <span className="text-sm font-medium">
                            Click to upload or drag & drop
                          </span>
                          <span className="text-xs text-blue-500/70">
                            (MP3, WAV, M4A, etc.)
                          </span>
                        </label>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <FileAudio className="w-6 h-6 flex-shrink-0" />
                          <span className="text-sm font-medium text-foreground truncate">
                            {selectedFile.name}
                          </span>
                        </div>
                      )}
                      {selectedFile && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={clearFile}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      )}
                      <input
                        id="audio-upload"
                        type="file"
                        className="hidden"
                        accept="audio/*"
                        onChange={handleFileChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="topic"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Topic of Presentation
                    </label>
                    {/* UPDATED: Input field styles */}
                    <input
                      id="topic"
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full px-3 py-2 bg-black/20 border border-blue-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      placeholder="e.g., 'Q3 Marketing Strategy'"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* UPDATED: Button styles */}
                  <Button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-500/90 text-white text-base py-3"
                    disabled={!selectedFile || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5 mr-2" />
                    )}
                    {isLoading ? "Analyzing..." : "Analyze Presentation"}
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* --- Previous Recordings --- */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Your Previous Analyses
              </h2>
              {previousRecordings.length > 0 ? (
                <div className="grid gap-4">
                  {previousRecordings.map((recording) => (
                    <motion.div
                      key={recording.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      {/* UPDATED: Card styles */}
                      <Card className="p-5 bg-blue-500/20 backdrop-blur-md border border-blue-500/50 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {/* UPDATED: Icon color */}
                            <FileAudio className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            <div>
                              <h3 className="font-medium text-foreground">
                                {recording.topic}
                              </h3>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <Clock className="w-4 h-4 mr-1.5" />
                                {new Date(
                                  recording.date
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          {/* UPDATED: Button styles */}
                          <Button
                            onClick={() =>
                              router.push(`/result/${recording.id}`)
                            }
                            className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-500"
                            size="sm"
                          >
                            View Results
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                // --- Empty State ---
                <motion.div variants={itemVariants}>
                  {/* UPDATED: Card styles */}
                  <Card className="p-8 bg-blue-500/20 backdrop-blur-md border border-blue-500/50 border-dashed">
                    <div className="flex flex-col items-center text-center text-muted-foreground">
                      <Info className="w-10 h-10 mb-4" />
                      <h3 className="font-semibold text-lg text-foreground mb-1">
                        No analyses found
                      </h3>
                      <p>
                        Upload your first presentation to get started and see
                        your results here.
                      </p>
                    </div>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
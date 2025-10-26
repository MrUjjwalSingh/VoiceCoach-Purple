"use client";

import { Variants ,motion } from "framer-motion";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Spotlight } from "../_components/ui/spotlight";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  X,
  FileAudio,
  Clock,
  Loader2,
  Info,
  LayoutDashboard,
  FolderClock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants : Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const floatingVariants : Variants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
};

const pulseVariants = {
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(168, 85, 247, 0.4)",
      "0 0 0 10px rgba(168, 85, 247, 0)",
    ],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
    },
  },
};

// --- Dashboard Sidebar ---
const DashboardSidebar = () => (
  <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 p-6 hidden md:block flex-shrink-0">
    <motion.div
      className="flex items-center gap-2 mb-8"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center"
        variants={floatingVariants}
        animate="animate"
      >
        <Sparkles className="w-5 h-5 text-white" />
      </motion.div>
      <h2 className="text-lg font-bold text-white">Analyze</h2>
    </motion.div>

    <nav className="space-y-2">
      <motion.a
        href="#"
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
        whileHover={{ x: 4 }}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span className="text-sm font-medium">Dashboard</span>
      </motion.a>

      <motion.a
        href="#"
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-400 font-medium transition-all duration-200"
        whileHover={{ x: 4 }}
      >
        <FileAudio className="w-5 h-5" />
        <span className="text-sm">Analysis</span>
      </motion.a>

      <motion.a
        href="#"
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
        whileHover={{ x: 4 }}
      >
        <FolderClock className="w-5 h-5" />
        <span className="text-sm font-medium">History</span>
      </motion.a>
    </nav>
  </aside>
);

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
      <Button
        variant="ghost"
        className="text-slate-400 hover:text-white hover:bg-slate-800/50"
      >
        Profile
      </Button>
    </motion.div>
  </motion.header>
);

// --- Page Component ---
export default function PresentationAnalysisPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const previousRecordings = [
    { id: 1, topic: "Marketing Strategy 2024", date: "2024-01-15T14:30:00" },
    { id: 2, topic: "Product Launch Presentation", date: "2024-01-10T11:20:00" },
  ];

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById("audio-upload") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsLoading(true);
    // Simulate analysis delay
    setTimeout(() => {
      setIsLoading(false);
      setSelectedFile(null);
      setTopic("");
      router.push(`/result/new-result-id`);
    }, 3000);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 relative overflow-y-auto overflow-x-hidden">
          {/* Decorative Spotlights */}
          <Spotlight className="top-0 left-0" fill="rgba(168, 85, 247, 0.15)" />
          <Spotlight
            className="top-1/3 right-1/4"
            fill="rgba(147, 51, 234, 0.1)"
          />
          <Spotlight
            className="bottom-40 right-0"
            fill="rgba(168, 85, 247, 0.08)"
          />

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
                  AI-Powered Analysis
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Analyze Your{" "}
                <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                  Presentations
                </span>
              </h1>

              <p className="text-lg text-slate-400 max-w-2xl">
                Upload your presentation audio and get instant AI-powered
                insights on delivery, pacing, and impact.
              </p>
            </motion.div>

            {/* Upload Section */}
            <Card className="p-8 sm:p-10 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl border border-slate-800 shadow-2xl hover:shadow-purple-500/10 hover:border-slate-700 transition-all duration-300 mb-16">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* File Input */}
                <div>
                  <label
                    htmlFor="audio-upload"
                    className="block text-sm font-semibold text-white mb-3"
                  >
                    Upload Audio File
                  </label>

                  <div
                    className={`flex ${
                      selectedFile ? "justify-between" : "justify-center"
                    } items-center w-full px-6 py-8 bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-700 transition-all duration-300 ${
                      !selectedFile
                        ? "hover:border-purple-500/50 hover:bg-slate-900/70 cursor-pointer"
                        : ""
                    }`}
                  >
                    {!selectedFile ? (
                      <label
                        htmlFor="audio-upload"
                        className="flex flex-col items-center cursor-pointer w-full"
                      >
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mb-3 animate-bounce">
                          <FileAudio className="w-6 h-6 text-purple-400" />
                        </div>
                        <span className="text-sm font-semibold text-white">
                          Click to upload or drag & drop
                        </span>
                        <span className="text-xs text-slate-400 mt-1">
                          MP3, WAV, M4A, or other audio formats
                        </span>
                      </label>
                    ) : (
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center flex-shrink-0">
                          <FileAudio className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={clearFile}
                          className="text-slate-400 hover:text-white hover:bg-slate-800/50 ml-4"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
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

                {/* Topic Input */}
                <div>
                  <label
                    htmlFor="topic"
                    className="block text-sm font-semibold text-white mb-3"
                  >
                    Presentation Topic
                  </label>
                  <input
                    id="topic"
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-slate-500 transition-all duration-200"
                    placeholder="e.g., 'Q3 Marketing Strategy'"
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/50"
                  disabled={!selectedFile || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Analyze Presentation
                    </>
                  )}
                </Button>
              </form>
            </Card>

            {/* Recent Analyses */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Analyses</h2>
              {previousRecordings.length > 0 ? (
                <div className="grid gap-4">
                  {previousRecordings.map((recording, index) => (
                    <motion.div
                      key={recording.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="p-5 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl border border-slate-800 hover:border-purple-500/30 hover:shadow-purple-500/10 transition-all duration-300 overflow-hidden group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center">
                              <FileAudio className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">
                                {recording.topic}
                              </h3>
                              <div className="flex items-center gap-1.5 text-sm text-slate-400 mt-1">
                                <Clock className="w-4 h-4" />
                                {new Date(recording.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={() => router.push(`/result/${recording.id}`)}
                            className="bg-slate-800 hover:bg-slate-700 text-purple-400 hover:text-purple-300 gap-2"
                            size="sm"
                          >
                            View Results
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card className="p-12 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl border border-dashed border-slate-700 rounded-xl text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mb-4 animate-pulse">
                      <Info className="w-7 h-7 text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-lg text-white mb-2">
                      No analyses yet
                    </h3>
                    <p className="text-slate-400">
                      Upload your first presentation to get started and see your
                      results here.
                    </p>
                  </div>
                </Card>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

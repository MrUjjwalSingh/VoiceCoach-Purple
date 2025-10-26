"use client";

import { Variants, motion } from "framer-motion";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Spotlight } from "../_components/ui/spotlight";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  X,
  FileAudio,
  // Clock, // No longer needed
  Loader2,
  // Info, // No longer needed
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

const itemVariants: Variants = {
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

const floatingVariants: Variants = {
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
  const [analysisResultId, setAnalysisResultId] = useState<string | null>(null); // New state for result
  const router = useRouter();

  // const previousRecordings = [...]; // This is now removed

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
      setAnalysisResultId(null); // Clear previous result on new file select
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setAnalysisResultId(null); // Clear result when clearing file
    const fileInput = document.getElementById(
      "audio-upload",
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsLoading(true);
    setAnalysisResultId(null); // Clear any existing result ID

    // Simulate analysis delay
    setTimeout(() => {
      const newId = `result-${Date.now()}`; // Simulate a unique ID from backend
      setIsLoading(false);
      setAnalysisResultId(newId); // Set the new result ID

      // Clear the form for the next upload
      setSelectedFile(null);
      setTopic("");
      const fileInput = document.getElementById(
        "audio-upload",
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      // We no longer navigate here.
      // router.push(`/result/new-result-id`);
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
            <Card className="p-8 sm:p-10 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl border border-slate-800 shadow-2xl hover:shadow-purple-500/10 hover:border-slate-700 transition-all duration-300 mb-16 min-h-[480px] flex items-center justify-center">
              {/* === CONDITIONAL CONTENT === */}

              {isLoading ? (
                // 1. Loading State
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex flex-col items-center justify-center text-center p-8"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <Loader2 className="w-20 h-20 text-purple-400" />
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-white mt-6">
                    Analyzing your presentation...
                  </h3>
                  <p className="text-slate-400 mt-2">
                    This may take a few moments. Please wait.
                  </p>
                </motion.div>
              ) : analysisResultId ? (
                // 2. Result State
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="flex flex-col items-center justify-center text-center p-8"
                >
                  <motion.div
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mb-6"
                    variants={pulseVariants}
                    animate="animate"
                  >
                    <Sparkles className="w-10 h-10 text-purple-400" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-white">
                    Analysis Complete!
                  </h3>
                  <p className="text-slate-400 mt-2 mb-8 max-w-md">
                    Your presentation has been successfully analyzed. View the
                    detailed report to see your results.
                  </p>
                  <Button
                    onClick={() => router.push(`/result/${analysisResultId}`)}
                    className="w-full max-w-xs bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/50"
                  >
                    View Results
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    variant="link"
                    onClick={() => setAnalysisResultId(null)}
                    className="text-purple-400 hover:text-purple-300 mt-4"
                  >
                    Analyze another file
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
                  className="space-y-8 w-full"
                >
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
                            disabled={isLoading} // Also disable this
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
                    {/* This button's loading state is fine as is */}
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
                </motion.form>
              )}
              {/* === END CONDITIONAL CONTENT === */}
            </Card>

            {/* Recent Analyses - THIS SECTION IS NOW REMOVED */}
          </div>
        </main>
      </div>
    </div>
  );
}
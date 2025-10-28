"use client";

import { Variants, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Spotlight } from "../_components/ui/spotlight";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
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
import { api } from "@/lib/axios-util";
import UnifiedSidebar from "../_components/layout/unified-sidebar";

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

// --- API Response Interfaces ---
interface RecordingMetadata {
  filename: string;
  duration: number;
  file_size: number;
  format: string;
  _id: string;
}

interface RecordingData {
  _id: string;
  userId: string;
  filePath: string;
  results: any; // We don't need the full results for the history page
  metadata: RecordingMetadata;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  recordings: RecordingData[];
}


// --- Header ---
const Header = () => (
  <motion.header
    className="h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 flex items-center px-6 flex-shrink-0"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h1 className="text-base font-semibold text-white">History</h1>
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
export default function HistoryPage() {
  const router = useRouter();
  const [recordings, setRecordings] = useState<RecordingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch recordings from API
  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await api.get('/recording/get');
        const data: ApiResponse = response.data;
        
        if (data.success && data.recordings) {
          setRecordings(data.recordings);
        } else {
          setError('Failed to fetch recordings');
        }
      } catch (err: any) {
        console.error('Error fetching recordings:', err);
        setError(err.response?.data?.message || 'Failed to load recordings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecordings();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
        </div>
      );
    }

    if (error) {
      return (
        <Card className="p-12 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl border border-red-500/30 rounded-xl text-center">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center mb-4">
              <Info className="w-7 h-7 text-red-400" />
            </div>
            <h3 className="font-semibold text-lg text-white mb-2">
              Error Loading Recordings
            </h3>
            <p className="text-slate-400 mb-4">
              {error}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Try Again
            </Button>
          </div>
        </Card>
      );
    }

    if (recordings.length === 0) {
      return (
        <Card className="p-12 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl border border-dashed border-slate-700 rounded-xl text-center">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mb-4 animate-pulse">
              <Info className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="font-semibold text-lg text-white mb-2">
              No analyses yet
            </h3>
            <p className="text-slate-400">
              Upload your first presentation to get started and see your results
              here.
            </p>
          </div>
        </Card>
      );
    }

    return (
      <motion.div
        className="grid gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {recordings.map((recording, index) => (
          <motion.div
            key={recording._id}
            variants={itemVariants}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="p-5 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl border border-slate-800 hover:border-purple-500/30 hover:shadow-purple-500/10 transition-all duration-300 overflow-hidden group">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center flex-shrink-0">
                    <FileAudio className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {recording.metadata.filename}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-slate-400 mt-1">
                      <Clock className="w-4 h-4" />
                      {new Date(recording.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                      <span>Size: {(recording.metadata.file_size / 1024 / 1024).toFixed(2)} MB</span>
                      <span>Format: {recording.metadata.format.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => router.push(`/result/${recording._id}`)}
                  className="bg-slate-800 hover:bg-slate-700 text-purple-400 hover:text-purple-300 gap-2 w-full sm:w-auto"
                  size="sm"
                >
                  View Results
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <UnifiedSidebar />

      <div className="flex-1 flex flex-col pl-72">
        <Header />

        <main className="flex-1 relative overflow-y-auto overflow-x-hidden">
          {/* Decorative Spotlights */}
          <Spotlight className="top-0 left-0" fill="rgba(168, 85, 247, 0.15)" />
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
                  Your Account
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Analysis{" "}
                <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                  History
                </span>
              </h1>

              <p className="text-lg text-slate-400 max-w-2xl">
                Review all your past presentation analyses and track your
                progress over time.
              </p>
            </motion.div>

            {/* Content Section */}
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

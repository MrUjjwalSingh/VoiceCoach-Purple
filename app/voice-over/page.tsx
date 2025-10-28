"use client";

import { motion } from "framer-motion";
import { useState, type FormEvent, useEffect, useRef } from "react";
import { Spotlight } from "../_components/ui/spotlight";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wand2,
  Waves,
} from "lucide-react";
import UnifiedSidebar from "../_components/layout/unified-sidebar";



// --- Audio Conversion Helpers ---

/**
 * Converts Base64 string to an ArrayBuffer.
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Converts raw PCM audio data into a WAV file Blob.
 */
function pcmToWav(
  pcmData: Int16Array,
  sampleRate: number,
  numChannels: number = 1
): Blob {
  const SIZEOF_INT16 = 2;
  const SIZEOF_INT32 = 4;
  const WAV_HEADER_SIZE = 44;

  const dataSize = pcmData.length * SIZEOF_INT16;
  const buffer = new ArrayBuffer(WAV_HEADER_SIZE + dataSize);
  const view = new DataView(buffer);

  let offset = 0;

  // RIFF chunk descriptor
  writeString(view, offset, "RIFF");
  offset += 4;
  view.setUint32(offset, 36 + dataSize, true);
  offset += SIZEOF_INT32;
  writeString(view, offset, "WAVE");
  offset += 4;

  // "fmt " sub-chunk
  writeString(view, offset, "fmt ");
  offset += 4;
  view.setUint32(offset, 16, true); // Sub-chunk size (16 for PCM)
  offset += SIZEOF_INT32;
  view.setUint16(offset, 1, true); // Audio format (1 for PCM)
  offset += SIZEOF_INT16;
  view.setUint16(offset, numChannels, true); // Number of channels
  offset += SIZEOF_INT16;
  view.setUint32(offset, sampleRate, true); // Sample rate
  offset += SIZEOF_INT32;
  view.setUint32(
    offset,
    sampleRate * numChannels * SIZEOF_INT16,
    true
  ); // Byte rate
  offset += SIZEOF_INT32;
  view.setUint16(offset, numChannels * SIZEOF_INT16, true); // Block align
  offset += SIZEOF_INT16;
  view.setUint16(offset, 16, true); // Bits per sample
  offset += SIZEOF_INT16;

  // "data" sub-chunk
  writeString(view, offset, "data");
  offset += 4;
  view.setUint32(offset, dataSize, true); // Sub-chunk size
  offset += SIZEOF_INT32;

  // Write PCM data
  for (let i = 0; i < pcmData.length; i++) {
    view.setInt16(offset, pcmData[i], true);
    offset += SIZEOF_INT16;
  }

  return new Blob([view], { type: "audio/wav" });
}

/**
 * Helper to write a string to a DataView.
 */
function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

// --- Animation Variants ---
const pulseVariants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
    },
  },
};

// --- Modern Audio Player Component ---
const ModernAudioPlayer = ({ audioUrl }: { audioUrl: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-2xl p-6 border border-purple-500/20">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      />
      
      <div className="flex flex-col gap-4">
        {/* Play/Pause Button */}
        <div className="flex items-center justify-center">
          <motion.button
            onClick={togglePlay}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/50 hover:shadow-purple-500/75 transition-all"
          >
            {isPlaying ? (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </motion.button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, rgb(168 85 247) 0%, rgb(168 85 247) ${(currentTime / (duration || 1)) * 100}%, rgb(51 65 85) ${(currentTime / (duration || 1)) * 100}%, rgb(51 65 85) 100%)`
            }}
          />
          <div className="flex justify-between text-sm text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgb(168 85 247);
          cursor: pointer;
          box-shadow: 0 0 8px rgba(168, 85, 247, 0.5);
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgb(168 85 247);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 8px rgba(168, 85, 247, 0.5);
        }
      `}</style>
    </div>
  );
};

// --- Result Display Component ---
const ResultDisplay = ({ result, onReset }: { result: PresentationResult; onReset: () => void }) => {
  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Success Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-3xl font-bold text-white mb-2">
            Your Presentation is Ready!
          </h3>
          <p className="text-slate-400">
            Generated for: <span className="text-purple-400 font-semibold">{result.topic}</span>
          </p>
        </div>
        <Button
          onClick={onReset}
          variant="outline"
          className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
        >
          Generate Another
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 bg-slate-900/50 border border-slate-700">
          <div className="text-sm text-slate-400 mb-1">Duration</div>
          <div className="text-2xl font-bold text-white">{result.time_limit_minutes} min</div>
        </Card>
        <Card className="p-4 bg-slate-900/50 border border-slate-700">
          <div className="text-sm text-slate-400 mb-1">Word Count</div>
          <div className="text-2xl font-bold text-white">{result.estimated_word_count}</div>
        </Card>
        <Card className="p-4 bg-slate-900/50 border border-slate-700">
          <div className="text-sm text-slate-400 mb-1">Words/Min</div>
          <div className="text-2xl font-bold text-white">
            {Math.round(result.estimated_word_count / result.time_limit_minutes)}
          </div>
        </Card>
      </div>

      {/* Audio Player */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <div className="w-1.5 h-4 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full" />
          Listen to Your Presentation
        </h4>
        <ModernAudioPlayer audioUrl={result.audio_file_url} />
      </div>

      {/* Script Display */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <div className="w-1.5 h-4 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full" />
          Full Voiceover Script
        </h4>
        <Card className="p-6 bg-slate-900/50 border border-slate-700 rounded-lg max-h-96 overflow-y-auto">
          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
            {result.full_voiceover_script}
          </p>
        </Card>
      </div>
    </motion.div>
  );
};

// --- Header ---
const Header = () => (
  <motion.header
    className="h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 flex items-center px-6 flex-shrink-0"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h1 className="text-base font-semibold text-white">AI Presentation</h1>
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
interface PresentationResult {
  topic: string;
  time_limit_minutes: number;
  estimated_word_count: number;
  full_voiceover_script: string;
  audio_file_url: string;
}

export default function VoiceOverPage() {
  const [topic, setTopic] = useState(
    "Artificial Intelligence in Healthcare"
  );
  const [timeLimit, setTimeLimit] = useState("0.5"); // Time limit in minutes
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PresentationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup if needed
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    // TODO: Replace with actual API call
    // This is a mock implementation for now
    try {
      // Simulating API call - replace with actual endpoint
      const mockResponse: PresentationResult = {
        topic: topic,
        time_limit_minutes: parseFloat(timeLimit),
        estimated_word_count: Math.round(parseFloat(timeLimit) * 150), // Approximate words per minute
        full_voiceover_script: `Welcome to today's presentation on ${topic}. This is a comprehensive exploration of the topic that will take approximately ${timeLimit} minutes. We'll cover key concepts, current trends, and practical applications. Let's begin with an overview of the fundamentals and build up to more advanced concepts. Throughout this presentation, we'll examine real-world examples and case studies that illustrate the importance of this topic. In conclusion, we've explored various aspects of ${topic}, and I hope this presentation has provided valuable insights for your consideration.`,
        audio_file_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Mock audio URL
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setResult(mockResponse);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate presentation.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
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
            className="top-1/3 right-1/4"
            fill="rgba(147, 51, 234, 0.1)"
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
                  AI Presentation Generator
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                VoiceOver{" "}
                <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                  Studio
                </span>
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl">
                Generate AI-powered presentations on any topic with customizable
                time limits. Perfect for practice, learning, and inspiration.
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
                    <Waves className="w-10 h-10 text-purple-400" />
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-white mt-6">
                    Generating your voiceover...
                  </h3>
                  <p className="text-slate-400 mt-2">
                    This may take a moment.
                  </p>
                </motion.div>
              ) : result ? (
                // 2. Result State
                <ResultDisplay result={result} onReset={handleReset} />
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
                    <label
                      htmlFor="topic"
                      className="block text-sm font-semibold text-white mb-3"
                    >
                      Enter Your Topic
                    </label>
                    <input
                      id="topic"
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-slate-500 transition-all duration-200"
                      placeholder="e.g., 'Climate Change and Renewable Energy'"
                      required
                    />
                  </div>

                  {/* Time Limit */}
                  <div>
                    <label
                      htmlFor="timeLimit"
                      className="block text-sm font-semibold text-white mb-3"
                    >
                      Select Time Limit
                    </label>
                    <div className="grid grid-cols-5 md:grid-cols-5 gap-2">
                      {[
                        { label: "30 sec", value: "0.5" },
                        { label: "1 min", value: "1.0" },
                        { label: "2 min", value: "2.0" },
                        { label: "3 min", value: "3.0" },
                        { label: "4 min", value: "4.0" },
                        { label: "5 min", value: "5.0" },
                      ].map((time) => (
                        <label
                          key={time.value}
                          className={`p-3 border rounded-lg cursor-pointer transition-all text-center ${
                            timeLimit === time.value
                              ? "border-purple-500 bg-purple-500/10"
                              : "border-slate-700 hover:border-slate-500"
                          }`}
                        >
                          <input
                            type="radio"
                            name="timeLimit"
                            value={time.value}
                            checked={timeLimit === time.value}
                            onChange={(e) => setTimeLimit(e.target.value)}
                            className="hidden"
                          />
                          <span className="font-semibold text-white text-sm">
                            {time.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <p className="text-sm text-red-400">Error: {error}</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/50"
                    disabled={isLoading}
                  >
                    <Wand2 className="w-5 h-5 mr-2" />
                    Generate Audio
                  </Button>
                </motion.form>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

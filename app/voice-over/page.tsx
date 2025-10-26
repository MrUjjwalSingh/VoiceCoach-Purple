"use client";

import { Variants, motion } from "framer-motion";
import { useState, type FormEvent, useEffect, ChangeEvent } from "react";
import { Spotlight } from "../_components/ui/spotlight";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileAudio,
  LayoutDashboard,
  Sparkles,
  Archive,
  FileText,
  Presentation,
  MicVocal, // New Icon
  Wand2,
  ChevronDown,
  Waves, // New Icon for loading
} from "lucide-react";
import { useRouter } from "next/navigation";



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
    scale: [1, 1.1, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
    },
  },
};

// --- Prebuilt Voices ---
const voices = [
  { name: "Kore", description: "Firm" },
  { name: "Puck", description: "Upbeat" },
  { name: "Zephyr", description: "Bright" },
  { name: "Charon", description: "Informative" },
  { name: "Fenrir", description: "Excitable" },
  { name: "Leda", description: "Youthful" },
  { name: "Orus", description: "Firm" },
  { name: "Aoede", description: "Breezy" },
  { name: "Callirrhoe", description: "Easy-going" },
  { name: "Algenib", description: "Gravelly" },
];

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
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
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
        <Archive className="w-5 h-5" />
        <span className="text-sm font-medium">History</span>
      </motion.a>
      <motion.a
        href="#"
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
        whileHover={{ x: 4 }}
      >
        <FileText className="w-5 h-5" />
        <span className="text-sm font-medium">Content Generation</span>
      </motion.a>
      <motion.a
        href="#"
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
        whileHover={{ x: 4 }}
      >
        <Presentation className="w-5 h-5" />
        <span className="text-sm font-medium">Presentation Generator</span>
      </motion.a>
      {/* --- New Active Link --- */}
      <motion.a
        href="#"
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-400 font-medium transition-all duration-200"
        whileHover={{ x: 4 }}
      >
        <MicVocal className="w-5 h-5" />
        <span className="text-sm font-medium">VoiceOver Studio</span>
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
export default function VoiceOverPage() {
  const [script, setScript] = useState(
    "Hello, this is a test of the new voiceover studio. I can use this to practice my pacing and fluency."
  );
  const [voiceMode, setVoiceMode] = useState("coaching"); // 'coaching' or 'natural'
  const [selectedVoice, setSelectedVoice] = useState("Kore");
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Clean up Blob URL when component unmounts or URL changes
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!script) return;

    setIsLoading(true);
    setAudioUrl(null);
    setError(null);

    // 1. Construct the prompt
    let ttsPrompt = script;
    if (voiceMode === "coaching") {
      ttsPrompt = `Speak the following text clearly and deliberately, as if coaching someone on pronunciation and pacing. Add distinct pauses at commas and full stops. Put emphasis on key verbs and nouns: \n\n"${script}"`;
    }

    // 2. Define the API payload
    const payload = {
      contents: [
        {
          parts: [{ text: ttsPrompt }],
        },
      ],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: selectedVoice },
          },
        },
      },
      model: "gemini-2.5-flash-preview-tts",
    };

    const apiKey = ""; // API key is handled by the environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

    try {
      // 3. Call the API
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const result = await response.json();
      const part = result?.candidates?.[0]?.content?.parts?.[0];
      const audioData = part?.inlineData?.data;
      const mimeType = part?.inlineData?.mimeType;

      if (audioData && mimeType && mimeType.startsWith("audio/L16")) {
        // 4. Process the audio
        const sampleRateMatch = mimeType.match(/rate=(\d+)/);
        const sampleRate = sampleRateMatch
          ? parseInt(sampleRateMatch[1], 10)
          : 24000; // Default to 24000 if not specified

        const pcmData = base64ToArrayBuffer(audioData);
        const pcm16 = new Int16Array(pcmData);
        const wavBlob = pcmToWav(pcm16, sampleRate);
        const wavUrl = URL.createObjectURL(wavBlob);

        setAudioUrl(wavUrl);
      } else {
        throw new Error("Invalid audio data received from API.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate audio.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAudioUrl(null);
    setError(null);
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
                  AI-Powered Pacing
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                VoiceOver{" "}
                <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                  Studio
                </span>
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl">
                Practice your script with an AI coach. Hear it read naturally,
                or get a guided lesson on pacing and fluency.
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
              ) : audioUrl ? (
                // 2. Result State
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Your Generated Audio
                  </h3>
                  <Card className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                    
                  </Card>
                  <Button
                    variant="link"
                    onClick={handleReset}
                    className="text-purple-400 hover:text-purple-300 mt-8"
                  >
                    Generate Another
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
                  {/* Script Input */}
                  <div>
                    <label
                      htmlFor="script"
                      className="block text-sm font-semibold text-white mb-3"
                    >
                      Enter Your Script
                    </label>
                    <textarea
                      id="script"
                      rows={8}
                      value={script}
                      onChange={(e) => setScript(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-slate-500 transition-all duration-200"
                      placeholder="e.g., 'Hello world, this is my presentation...'"
                      required
                    />
                  </div>

                  {/* Voice Mode */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Select Voice Mode
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          voiceMode === "coaching"
                            ? "border-purple-500 bg-purple-500/10"
                            : "border-slate-700 hover:border-slate-500"
                        }`}
                      >
                        <input
                          type="radio"
                          name="voiceMode"
                          value="coaching"
                          checked={voiceMode === "coaching"}
                          onChange={() => setVoiceMode("coaching")}
                          className="hidden"
                        />
                        <span className="font-semibold text-white">
                          Coaching Voice
                        </span>
                        <p className="text-xs text-slate-400 mt-1">
                          Slow, deliberate pacing with clear pauses. Best for
                          practice.
                        </p>
                      </label>
                      <label
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          voiceMode === "natural"
                            ? "border-purple-500 bg-purple-500/10"
                            : "border-slate-700 hover:border-slate-500"
                        }`}
                      >
                        <input
                          type="radio"
                          name="voiceMode"
                          value="natural"
                          checked={voiceMode === "natural"}
                          onChange={() => setVoiceMode("natural")}
                          className="hidden"
                        />
                        <span className="font-semibold text-white">
                          Natural Voice
                        </span>
                        <p className="text-xs text-slate-400 mt-1">
                          A polished, realistic voiceover. Best for final
                          output.
                        </p>
                      </label>
                    </div>
                  </div>

                  {/* Voice Selection */}
                  <div>
                    <label
                      htmlFor="voice"
                      className="block text-sm font-semibold text-white mb-3"
                    >
                      Select Voice
                    </label>
                    <div className="relative">
                      <select
                        id="voice"
                        value={selectedVoice}
                        onChange={(e) => setSelectedVoice(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white transition-all duration-200 appearance-none"
                        required
                      >
                        {voices.map((voice) => (
                          <option key={voice.name} value={voice.name}>
                            {voice.name} ({voice.description})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
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

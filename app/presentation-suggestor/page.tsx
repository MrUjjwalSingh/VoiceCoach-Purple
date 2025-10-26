"use client";

import { Variants, motion } from "framer-motion";
import { useState, type FormEvent } from "react";
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
  Wand2,
  CheckSquare,
  Users, // New Icon
  SlidersHorizontal, // New Icon
  Mic, // New Icon
  Image, // New Icon
  Clipboard, // New Icon
  Check, // New Icon
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

// --- Updated Mock Data with More Features ---
const MOCK_SLIDES = [
  {
    title: "Slide 1: Introduction - The Hook",
    points: [
      "Start with a powerful statistic or a relatable question about AI.",
      "Briefly introduce yourself and your credibility on the topic.",
      "State the presentation's core promise.",
    ],
    speakerNotes:
      "Make sure to pause after the hook question to let it sink in. Make eye contact with the audience.",
    visualSuggestion: "A high-impact, abstract image of a neural network.",
  },
  {
    title: "Slide 2: What is AI? (The Simple Version)",
    points: [
      "Use a simple analogy (e.g., 'AI is like a child learning...').",
      "Show two main types: Narrow AI vs. General AI.",
      "Key visual: A simple diagram showing 'Input -> Black Box (Learning) -> Output'.",
    ],
    speakerNotes:
      "Don't get too technical. The goal here is clarity, not a computer science lecture. Emphasize that most AI today is 'Narrow AI'.",
    visualSuggestion: "A simple icon of a brain next to a computer chip.",
  },
  {
    title: "Slide 3: AI in Our Daily Lives",
    points: [
      "Use highly relatable examples: Spotify, Netflix, Google Maps.",
      "Showcase smartphone 'smart' features (photo grouping).",
      "Focus on the 'convenience' aspect. Keep text minimal; use logos.",
    ],
    speakerNotes:
      "Ask the audience 'How many of you used Google Maps or a streaming service today?' to make it interactive.",
    visualSuggestion: "A grid of popular app logos (Netflix, Spotify, etc.).",
  },
  {
    title: "Slide 4: Conclusion & Call to Action",
    points: [
      "Summarize the 3 main points (What it is, where it is, where it's going).",
      "Provide a clear, simple 'Call to Action' (e.g., 'Try one new AI tool this week').",
      "Open for Q&A. Thank you slide with contact info.",
    ],
    speakerNotes:
      "End on a positive, human-centric note. 'AI is a tool. We decide how to use it.' Speak confidently here.",
    visualSuggestion: "A clean 'Thank You' slide with your LinkedIn QR code.",
  },
];

// --- Dashboard Sidebar (Active link changed to Presentation Generator) ---
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
        href="#" // Should link to your dashboard page
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
        whileHover={{ x: 4 }}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span className="text-sm font-medium">Dashboard</span>
      </motion.a>

      <motion.a
        href="#" // Should link to your analysis page
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
        whileHover={{ x: 4 }}
      >
        <FileAudio className="w-5 h-5" />
        <span className="text-sm">Analysis</span>
      </motion.a>

      <motion.a
        href="#" // Should link to your history page
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
        whileHover={{ x: 4 }}
      >
        <Archive className="w-5 h-5" />
        <span className="text-sm font-medium">History</span>
      </motion.a>

      <motion.a
        href="#" // Should link to content gen page
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
        whileHover={{ x: 4 }}
      >
        <FileText className="w-5 h-5" />
        <span className="text-sm font-medium">Content Generation</span>
      </motion.a>

      <motion.a
        href="#" // Should link to this page
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-400 font-medium transition-all duration-200"
        whileHover={{ x: 4 }}
      >
        <Presentation className="w-5 h-5" />
        <span className="text-sm font-medium">Presentation Generator</span>
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
export default function PresentationGeneratorPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("Beginners"); // New State
  const [slideCount, setSlideCount] = useState("5-7"); // New State
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false); // New State
  const [generatedSlides, setGeneratedSlides] = useState<
    typeof MOCK_SLIDES | null
  >(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    setIsLoading(true);
    setGeneratedSlides(null);

    // Simulate script generation delay
    setTimeout(() => {
      setGeneratedSlides(MOCK_SLIDES);
      setIsLoading(false);
    }, 4000); // 4-second delay
  };

  const handleReset = () => {
    setGeneratedSlides(null);
    setTopic("");
    setAudience("Beginners");
    setSlideCount("5-7");
    setIsCopied(false);
  };

  // --- New Clipboard Function ---
  const handleCopy = () => {
    if (!generatedSlides) return;

    const formattedText = generatedSlides
      .map((slide) => {
        const points = slide.points
          .map((point) => `  - ${point}`)
          .join("\n");
        return `
## ${slide.title}
**Key Points:**
${points}

**Speaker Notes:**
${slide.speakerNotes}

**Visual Suggestion:**
${slide.visualSuggestion}
--------------------
      `;
      })
      .join("\n");

    navigator.clipboard.writeText(formattedText.trim());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
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
                Just give us your topic. Our AI will outline your entire
                presentation, slide by slide, with key talking points.
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
                  <h3 className="text-2xl font-semibold text-white mt-6">
                    Building your presentation...
                  </h3>
                  <p className="text-slate-400 mt-2">
                    Our AI is drafting your slide structure. Please wait.
                  </p>
                </motion.div>
              ) : generatedSlides ? (
                // 2. Result State
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">
                      Your Generated Slide Outline
                    </h3>
                    <Button
                      onClick={handleCopy}
                      className="bg-slate-800 hover:bg-slate-700 text-purple-400 hover:text-purple-300 gap-2 mt-4 sm:mt-0"
                    >
                      {isCopied ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Clipboard className="w-5 h-5" />
                      )}
                      {isCopied ? "Copied!" : "Copy Outline"}
                    </Button>
                  </div>

                  <div className="pr-2 max-h-[600px] overflow-y-auto">
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-4"
                    >
                      {generatedSlides.map((slide, index) => (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          className="bg-slate-900/50 border border-slate-700 rounded-lg p-5"
                        >
                          <h4 className="font-semibold text-purple-400 mb-4 text-lg">
                            {slide.title}
                          </h4>

                          {/* Key Points */}
                          <div className="mb-4">
                            <h5 className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                              <CheckSquare className="w-4 h-4" />
                              Key Points
                            </h5>
                            <ul className="list-none space-y-2 pl-6">
                              {slide.points.map((point, pIndex) => (
                                <li
                                  key={pIndex}
                                  className="text-slate-300 text-sm"
                                >
                                  - {point}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Speaker Notes */}
                          <div className="mb-4">
                            <h5 className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                              <Mic className="w-4 h-4" />
                              Speaker Notes
                            </h5>
                            <p className="text-slate-400 text-sm pl-6 italic">
                              "{slide.speakerNotes}"
                            </p>
                          </div>

                          {/* Visual Suggestion */}
                          <div>
                            <h5 className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                              <Image className="w-4 h-4" />
                              Visual Suggestion
                            </h5>
                            <p className="text-slate-400 text-sm pl-6">
                              {slide.visualSuggestion}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                  <Button
                    variant="link"
                    onClick={handleReset}
                    className="text-purple-400 hover:text-purple-300 mt-8"
                  >
                    Generate Another Outline
                  </Button>
                </motion.div>
              ) : (
                // 3. Default Form State (Updated)
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

                  {/* New Options Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Target Audience */}
                    <div>
                      <label
                        htmlFor="audience"
                        className="block text-sm font-semibold text-white mb-3"
                      >
                        Target Audience
                      </label>
                      <div className="relative">
                        <select
                          id="audience"
                          value={audience}
                          onChange={(e) => setAudience(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white transition-all duration-200 appearance-none"
                          required
                        >
                          <option>Beginners</option>
                          <option>Experts</option>
                          <option>Executives</option>
                          <option>Students</option>
                          <option>General Public</option>
                        </select>
                        <Users className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    {/* Number of Slides */}
                    <div>
                      <label
                        htmlFor="slideCount"
                        className="block text-sm font-semibold text-white mb-3"
                      >
                        Presentation Length
                      </label>
                      <div className="relative">
                        <select
                          id="slideCount"
                          value={slideCount}
                          onChange={(e) => setSlideCount(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white transition-all duration-200 appearance-none"
                          required
                        >
                          <option>Quick (3-4 Slides)</option>
                          <option>Standard (5-7 Slides)</option>
                          <option>Detailed (8-10 Slides)</option>
                        </select>
                        <SlidersHorizontal className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
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
          </div>
        </main>
      </div>
    </div>
  );
}
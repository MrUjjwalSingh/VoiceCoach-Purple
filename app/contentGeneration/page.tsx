"use client";

import { Variants, motion } from "framer-motion";
import { useState, useEffect, type FormEvent } from "react";
import { Spotlight } from "../_components/ui/spotlight";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileAudio,
  Loader2,
  LayoutDashboard,
  Sparkles,
  ArrowRight,
  Archive,
  FileText, // New icon for content gen
  Wand2, // New icon for loading
  Clock,
  MessageSquare,
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

// --- Mock Data ---
const MOCK_SCRIPT = `
## Introduction (1 Minute)

**Hook:** "Good morning, everyone. How many of you checked your social media feed this morning? (Pause for show of hands). What if I told you that same technology, Artificial Intelligence, is about to fundamentally change how we build, deploy, and secure our web applications?"

**Self-Intro:** "My name is [Your Name], and today, we're diving into 'The Future of Web Development with AI.'"

**Agenda:** "We'll explore three key areas: how AI is supercharging our coding process, how it's revolutionizing user experiences, and what you can do to stay ahead of the curve."

---

## Part 1: AI as a Co-Pilot (3 Minutes)

**Point 1: Accelerated Development:**
* "Tools like GitHub Copilot and Tabnine aren't just autocomplete. They're 'pair programmers.' They suggest entire blocks of code, write unit tests, and even translate code from one language to another."
* "This means we spend less time on boilerplate and more time on complex problem-solving. It's a massive productivity boost."

**Point 2: Automated Debugging & Security:**
* "AI models can now scan thousands of lines of code in seconds, identifying complex bugs and security vulnerabilities (like SQL injection or XSS) that human eyes might miss."
* "This shifts security from a final checklist item to an integrated part of the development lifecycle."

---

## Part 2: AI-Driven User Experiences (3 Minutes)

**Point 1: Hyper-Personalization:**
* "Forget simple 'Welcome, [User Name]'. AI allows us to create experiences that adapt in real-time. Think of Netflix's recommendation engine, but for every website."
* "We can dynamically change layouts, content, and offers based on user behavior, time of day, or location, creating a truly one-to-one experience."

**Point 2: The Rise of Conversational UI:**
* "The next generation of user interface is... no interface. AI-powered chatbots and virtual assistants are becoming so good, users can simply *ask* for what they want."
* "This is a game-changer for accessibility and simplifying complex workflows, like booking a multi-stop flight or configuring a complex product."

---

## Conclusion (1 Minute)

**Summary:** "So, as we've seen, AI is not a replacement for developers. It's an amplifier. It helps us code faster and more securely, and it allows us to build richer, more personal, and more accessible experiences for our users."

**Call to Action:** "My challenge to you is this: don't be afraid of these tools. Start small. Pick one AI tool this week—maybe a code generator or a new analytics platform—and just experiment. The future is being built by those who learn to partner with AI."

**Closing:** "Thank you. I'm happy to answer any questions."
`;

// --- Dashboard Sidebar (Active link changed to Content Generation) ---
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
        href="#" // Should link to this page
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-400 font-medium transition-all duration-200"
        whileHover={{ x: 4 }}
      >
        <FileText className="w-5 h-5" />
        <span className="text-sm font-medium">Content Generation</span>
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
export default function ContentGenerationPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [timeLimit, setTimeLimit] = useState("10"); // Default 10 minutes
  const [tone, setTone] = useState("Informative"); // Default tone
  const [isLoading, setIsLoading] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!topic || !timeLimit || !tone) return;

    setIsLoading(true);
    setGeneratedScript(null);

    // Simulate script generation delay
    setTimeout(() => {
      setGeneratedScript(MOCK_SCRIPT);
      setIsLoading(false);
    }, 4000); // 4-second delay
  };

  const handleReset = () => {
    setGeneratedScript(null);
    setTopic("");
    setTimeLimit("10");
    setTone("Informative");
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
                  AI-Powered Content
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Generate Your{" "}
                <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                  Script
                </span>
              </h1>

              <p className="text-lg text-slate-400 max-w-2xl">
                Describe your topic, set the time limit and tone, and let our AI
                craft a complete presentation script for you.
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
                    Crafting your script...
                  </h3>
                  <p className="text-slate-400 mt-2">
                    Our AI is writing your presentation. This may take a moment.
                  </p>
                </motion.div>
              ) : generatedScript ? (
                // 2. Result State
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Your Generated Script
                  </h3>
                  <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg max-h-[500px] overflow-y-auto">
                    <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans">
                      {generatedScript}
                    </pre>
                  </div>
                  <Button
                    variant="link"
                    onClick={handleReset}
                    className="text-purple-400 hover:text-purple-300 mt-6"
                  >
                    Generate Another Script
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
                    <label
                      htmlFor="topic"
                      className="block text-sm font-semibold text-white mb-3"
                    >
                      Presentation Topic
                    </label>
                    <textarea
                      id="topic"
                      rows={4}
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-slate-500 transition-all duration-200"
                      placeholder="e.g., 'The Future of Web Development with AI'"
                      required
                    />
                  </div>

                  {/* Time Limit & Tone Inputs (Side-by-side) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Time Limit */}
                    <div>
                      <label
                        htmlFor="timeLimit"
                        className="block text-sm font-semibold text-white mb-3"
                      >
                        Time Limit (in minutes)
                      </label>
                      <div className="relative">
                        <input
                          id="timeLimit"
                          type="number"
                          value={timeLimit}
                          onChange={(e) => setTimeLimit(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-slate-500 transition-all duration-200"
                          placeholder="e.g., 10"
                          required
                          min="1"
                        />
                        <Clock className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    {/* Tone */}
                    <div>
                      <label
                        htmlFor="tone"
                        className="block text-sm font-semibold text-white mb-3"
                      >
                        Select Tone
                      </label>
                      <div className="relative">
                        <select
                          id="tone"
                          value={tone}
                          onChange={(e) => setTone(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white transition-all duration-200 appearance-none"
                          required
                        >
                          <option>Informative</option>
                          <option>Professional</option>
                          <option>Enthusiastic</option>
                          <option>Casual</option>
                          <option>Persuasive</option>
                        </select>
                        <MessageSquare className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/50"
                    disabled={isLoading}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Script
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
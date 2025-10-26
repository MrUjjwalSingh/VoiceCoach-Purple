"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { useState } from "react"

interface ScriptInputFormProps {
  onGenerate: (data: { topic: string; content: string; tone: string; duration: number }) => void
  isLoading?: boolean
}

export default function ScriptInputForm({ onGenerate, isLoading = false }: ScriptInputFormProps) {
  const [topic, setTopic] = useState("")
  const [content, setContent] = useState("")
  const [tone, setTone] = useState("professional")
  const [duration, setDuration] = useState(5)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (topic.trim() && content.trim()) {
      onGenerate({ topic, content, tone, duration })
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium mb-2">Topic</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Climate Change, Product Launch"
          className="w-full px-4 py-3 rounded-lg glass border border-border focus:border-primary focus:outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Content / Key Points</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter the main points or content you want to cover..."
          rows={6}
          className="w-full px-4 py-3 rounded-lg glass border border-border focus:border-primary focus:outline-none transition resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full px-4 py-3 rounded-lg glass border border-border focus:border-primary focus:outline-none transition"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="motivational">Motivational</option>
            <option value="educational">Educational</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Math.max(1, Number.parseInt(e.target.value) || 1))}
            min="1"
            max="30"
            className="w-full px-4 py-3 rounded-lg glass border border-border focus:border-primary focus:outline-none transition"
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isLoading}
        type="submit"
        className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Sparkles size={20} />
        {isLoading ? "Generating..." : "Generate Script"}
      </motion.button>
    </motion.form>
  )
}

"use client"

import { motion } from "framer-motion"
import { Copy, Download, Clock, FileText } from "lucide-react"
import { useState } from "react"

interface ScriptDisplayProps {
  script: string
  topic: string
  duration: number
}

export default function ScriptDisplay({ script, topic, duration }: ScriptDisplayProps) {
  const [copied, setCopied] = useState(false)

  const wordCount = script.split(/\s+/).length
  const estimatedTime = Math.ceil(wordCount / 130) // Average speaking speed

  const handleCopy = () => {
    navigator.clipboard.writeText(script)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob([script], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${topic.replace(/\s+/g, "-").toLowerCase()}-script.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="space-y-4"
    >
      <div className="glass p-6 rounded-2xl border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold gradient-text">{topic}</h3>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-primary/10 transition"
              title="Copy to clipboard"
            >
              <Copy size={20} className={copied ? "text-primary" : "text-muted-foreground"} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="p-2 rounded-lg hover:bg-primary/10 transition"
              title="Download script"
            >
              <Download size={20} className="text-muted-foreground" />
            </motion.button>
          </div>
        </div>

        <div className="flex gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText size={16} />
            <span>{wordCount} words</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock size={16} />
            <span>~{estimatedTime} min read</span>
          </div>
        </div>

        <div className="bg-background/50 rounded-lg p-4 max-h-96 overflow-y-auto">
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">{script}</p>
        </div>
      </div>

      {copied && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-center text-sm text-primary font-medium"
        >
          Copied to clipboard!
        </motion.div>
      )}
    </motion.div>
  )
}

"use client"

import { motion } from "framer-motion"
import { Upload, Mic } from "lucide-react"
import { useState } from "react"

export default function UploadBox() {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      onDragOver={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      className={`glass p-12 rounded-2xl border-2 border-dashed transition-all ${
        isDragging ? "border-primary bg-primary/5" : "border-border"
      }`}
    >
      <div className="text-center">
        <motion.div
          animate={{ y: isDragging ? -5 : 0 }}
          className="inline-block p-4 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 mb-4"
        >
          <Upload className="w-8 h-8 text-primary" />
        </motion.div>
        <h3 className="text-2xl font-semibold mb-2">Upload Your Speech</h3>
        <p className="text-muted-foreground mb-6">Drag and drop your audio file or click to browse</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/50 transition"
          >
            Choose File
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-full border border-border text-foreground font-medium hover:bg-card transition flex items-center justify-center gap-2"
          >
            <Mic size={20} />
            Record Now
          </motion.button>
        </div>
        <p className="text-muted-foreground text-sm mt-6">Supported formats: MP3, WAV, M4A (Max 100MB)</p>
      </div>
    </motion.div>
  )
}

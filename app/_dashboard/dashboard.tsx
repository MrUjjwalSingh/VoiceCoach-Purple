"use client"

import { motion } from "framer-motion"
import UploadBox from "./upload-box"
import QuickStats from "./quick-stats"
import HistoryList from "./history-list"
import ScriptGenerator from "./script-generator"

export default function Dashboard() {
  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
          <p className="text-muted-foreground">Analyze your speech and improve your communication skills</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <UploadBox />
          </div>
          <div>
            <QuickStats />
          </div>
        </div>

        <ScriptGenerator />

        <HistoryList />
      </div>
    </main>
  )
}

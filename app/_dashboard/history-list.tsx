"use client"

import { motion } from "framer-motion"
import SpotlightCard from "../_components/ui/spotlight-card"
import { Play, Download, Trash2 } from "lucide-react"

const history = [
  {
    id: 1,
    title: "Q4 Earnings Presentation",
    date: "Today at 2:30 PM",
    duration: "12:45",
    score: 92,
  },
  {
    id: 2,
    title: "Team Meeting Update",
    date: "Yesterday at 10:15 AM",
    duration: "8:20",
    score: 85,
  },
  {
    id: 3,
    title: "Conference Talk - AI Trends",
    date: "2 days ago",
    duration: "45:30",
    score: 88,
  },
]

export default function HistoryList() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-6">Recent Analyses</h2>
      <div className="space-y-4">
        {history.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            whileHover={{ x: 5 }}
          >
            <SpotlightCard className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {item.date} • {item.duration}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold gradient-text">{item.score}%</p>
                    <p className="text-muted-foreground text-xs">Confidence</p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg hover:bg-card transition"
                    >
                      <Play size={20} className="text-primary" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg hover:bg-card transition"
                    >
                      <Download size={20} className="text-muted-foreground" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg hover:bg-card transition"
                    >
                      <Trash2 size={20} className="text-muted-foreground" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

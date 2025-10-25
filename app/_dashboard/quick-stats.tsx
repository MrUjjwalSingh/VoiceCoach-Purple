"use client"

import { motion } from "framer-motion"
import SpotlightCard from "../_components/ui/spotlight-card"

const stats = [
  { label: "Speeches Analyzed", value: "12" },
  { label: "Avg. Confidence", value: "87%" },
  { label: "Improvement", value: "+23%" },
]

export default function QuickStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="space-y-4"
    >
      {stats.map((stat, index) => (
        <motion.div key={index} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
          <SpotlightCard className="p-4">
            <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold gradient-text">{stat.value}</p>
          </SpotlightCard>
        </motion.div>
      ))}
    </motion.div>
  )
}

"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import ScriptInputForm from "../_components/speechCoach/script-input-form"
import ScriptDisplay from "../_components/speechCoach/script-display"

interface GeneratedScript {
  topic: string
  script: string
  duration: number
}

export default function ScriptGenerator() {
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async (data: { topic: string; content: string; tone: string; duration: number }) => {
    setIsLoading(true)

    // Simulate API call - replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock generated script
    const mockScript = `Good morning/afternoon everyone. Today, I want to talk to you about "${data.topic}".

${data.content}

Let me break this down into key points:

1. First, we need to understand the importance of this topic
2. Second, let's look at the current situation
3. Third, I want to share some practical solutions
4. Finally, let's discuss the next steps

In conclusion, ${data.topic} is crucial for our success. I encourage you to think about what we've discussed today and how you can apply these insights.

Thank you for your attention. I'm happy to answer any questions.`

    setGeneratedScript({
      topic: data.topic,
      script: mockScript,
      duration: data.duration,
    })
    setIsLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mb-8"
    >
      <h2 className="text-3xl font-bold mb-6">Script Generator</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <ScriptInputForm onGenerate={handleGenerate} isLoading={isLoading} />
        </div>

        <div>
          {generatedScript ? (
            <ScriptDisplay
              script={generatedScript.script}
              topic={generatedScript.topic}
              duration={generatedScript.duration}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass p-12 rounded-2xl border border-dashed border-border flex items-center justify-center min-h-96"
            >
              <div className="text-center">
                <div className="inline-block p-4 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m0 0h6m-6-6H6m0 0H0"
                    />
                  </svg>
                </div>
                <p className="text-muted-foreground">Your generated script will appear here</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

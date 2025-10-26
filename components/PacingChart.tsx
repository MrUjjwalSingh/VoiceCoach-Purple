"use client"

import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type TranscriptEntry = {
  text: string
  start: number
  end: number // Assuming this is duration
  tags: string[]
}

interface PacingChartProps {
  transcript: TranscriptEntry[]
  averageWPM: number
}

// Helper function to calculate WPM, capping unrealistic values
const calculateWPM = (duration: number): number => {
  if (duration <= 0) return 0;
  // (1 word / duration_seconds) * 60 seconds/minute
  const wpm = 60 / duration;
  // Cap speed to avoid huge spikes from very short durations
  return Math.min(wpm, 300);
}

export function PacingChart({ transcript, averageWPM }: PacingChartProps) {
  // Process the transcript data into chart-friendly format
  const chartData: { time: number; speed: number; type: string; text: string }[] = [];

  transcript.forEach((entry, index) => {
    const startTime = entry.start;
    const duration = entry.end;
    const endTime = startTime + duration;
    const isPause = entry.tags.includes("long_pause") || entry.tags.includes("strategic_pause");
    const isFiller = entry.tags.includes("filler_word"); // Future-proofing

    // Calculate speed for the word itself
    const speed = calculateWPM(duration);
    const type = isFiller ? "Filler" : (isPause ? "Word (followed by pause)" : "Word");

    // Add point at the start of the word
    chartData.push({
      time: startTime,
      speed: speed,
      type: type,
      text: entry.text,
    });

    // Add point at the end of the word (maintains the speed line during the word)
    chartData.push({
      time: endTime,
      speed: speed,
      type: type,
      text: entry.text,
    });

    // If there's a pause associated with this word, add a point dipping to zero *after* the word ends
    if (isPause) {
        // Add a point immediately after the word ends with speed 0
        chartData.push({
            time: endTime + 0.01, // Add a tiny offset to separate from word end
            speed: 0,
            type: entry.tags.includes("long_pause") ? "Long Pause" : "Strategic Pause",
            text: "[Pause]",
        });
        // Find the start time of the next word to determine pause end
        const nextWordStartTime = transcript[index + 1]?.start;
        if (nextWordStartTime && nextWordStartTime > endTime + 0.01) {
            // Add another point just before the next word starts, still at speed 0
             chartData.push({
                time: nextWordStartTime - 0.01, // Just before next word
                speed: 0,
                type: entry.tags.includes("long_pause") ? "Long Pause" : "Strategic Pause",
                text: "[Pause End]",
            });
        }
        // If it's the last word and has a pause, keep speed at 0 for a short duration
        else if (index === transcript.length - 1) {
             chartData.push({
                time: endTime + 0.5, // Arbitrary 0.5s pause display
                speed: 0,
                type: entry.tags.includes("long_pause") ? "Long Pause" : "Strategic Pause",
                text: "[Pause End]",
            });
        }
    }
  });

   // Sort data by time to ensure correct plotting
   chartData.sort((a, b) => a.time - b.time);

  // Custom Tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded-lg border border-slate-700 bg-slate-900/80 p-3 text-sm shadow-lg backdrop-blur-md">
          <p className="font-bold text-white">Time: {label?.toFixed(2)}s</p>
          {data.type.includes("Pause") ? (
             <p className="text-yellow-400">Type: {data.type}</p>
          ) : (
            <p className="text-purple-400">
              Speed: {data.speed?.toFixed(0)} WPM
            </p>
          )}
           {data.text !== "[Pause]" && data.text !== "[Pause End]" && <p className="text-slate-300">Text: "{data.text}"</p>}
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.7} />
            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="time"
          stroke="#94a3b8" // slate-400
          fontSize={12}
          tickFormatter={(time) => `${time.toFixed(0)}s`}
          type="number" // Ensure time is treated as a number
          domain={['dataMin', 'dataMax']} // Set domain explicitly
        />
        <YAxis
          stroke="#94a3b8" // slate-400
          fontSize={12}
          domain={[0, 300]} // Set a fixed Y-axis domain
          label={{
            value: "WPM",
            angle: -90,
            position: "insideLeft",
            fill: "#94a3b8",
            fontSize: 12,
            dx: -10 // Adjust label position
          }}
          allowDataOverflow={true} // Allow lines/areas to go slightly out of bounds if needed
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="speed"
          stroke="#a855f7" // Purple-500
          fillOpacity={1}
          fill="url(#colorSpeed)"
          strokeWidth={2}
          connectNulls={false} // Don't connect points across nulls (if any)
          isAnimationActive={true} // Enable animation
        />
        {/* Average WPM reference line */}
        <ReferenceLine
          y={averageWPM}
          label={{
            value: `Avg (${averageWPM.toFixed(0)})`,
            position: "right",
            fill: "#f43f5e", // Red-500
            fontSize: 12,
          }}
          stroke="#f43f5e"
          strokeDasharray="3 3"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

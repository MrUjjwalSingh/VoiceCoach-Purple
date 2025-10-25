"use client"

import { CardContainer, CardBody, CardItem } from "../_components/ui/3d-card"
import { Button } from "@/components/ui/button"

export default function FeaturedCard() {
  return (
    <CardContainer className="w-full">
      <CardBody className="w-full h-auto">
        <CardItem
          translateZ="50"
          className="w-full rounded-xl bg-gradient-to-br from-purple-600 to-purple-900 p-8 text-white"
        >
          <h3 className="text-2xl font-bold mb-2">Your Latest Analysis</h3>
          <p className="text-purple-100 mb-6">Presentation on Q4 Strategy - 8 minutes 32 seconds</p>

          <CardItem translateZ="30" className="mb-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <p className="text-sm text-purple-100">Filler Words</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <p className="text-sm text-purple-100">Clarity Score</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <p className="text-sm text-purple-100">Pacing</p>
                <p className="text-2xl font-bold">Good</p>
              </div>
            </div>
          </CardItem>

          <CardItem translateZ="20">
            <Button className="w-full bg-white text-purple-900 hover:bg-purple-100">View Full Report</Button>
          </CardItem>
        </CardItem>
      </CardBody>
    </CardContainer>
  )
}

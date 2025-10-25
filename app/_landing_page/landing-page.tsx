"use client"

import HeroSection from "./hero-section"
import FeatureGrid from "./feature-grid"
import HowItWorks from "./how-it-works"
import PricingSection from "./pricing-section"
import GetStartedSection from "./get-started-section"

export default function LandingPage() {
  return (
    <main className="relative">
      <HeroSection />
      <FeatureGrid />
      <HowItWorks />
      <PricingSection />
      <GetStartedSection />
    </main>
  )
}

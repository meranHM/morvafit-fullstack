"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import HeroSection from "@/components/home/HeroSection"
import ServicesSection from "@/components/home/ServicesSection"
import HomeWithLoader from "@/components/home/HomeWithLoader"

// Lazy load below-fold sections
const AboutSection = dynamic(() => import("@/components/home/AboutSection"))
const MottoSection = dynamic(() => import("@/components/home/MottoSection"))
const TestimonialsSection = dynamic(() => import("@/components/home/TestimonialsSection"))
const TransformationsSection = dynamic(() => import("@/components/home/TransformationsSection"))
const UserForm = dynamic(() => import("@/components/home/UserForm"))
const FAQSection = dynamic(() => import("@/components/home/FAQSection"))
const FinalCTASection = dynamic(() => import("@/components/home/FinalCTASection"))

const Home = () => {
  return (
    <HomeWithLoader>
      <main className="overflow-hidden flex flex-col gap-40">
        {/* Above the fold - load immediately */}
        <HeroSection />
        <ServicesSection />

        {/* Below the fold - lazy load */}
        <Suspense fallback={<div className="h-screen flex flex-col gap-40" />}>
          <AboutSection />
          <MottoSection />
          <TestimonialsSection />
          {/* <TransformationsSection /> */}
          <UserForm />
          <FAQSection />
          {/* <FinalCTASection /> */}
        </Suspense>
      </main>
    </HomeWithLoader>
  )
}

export default Home

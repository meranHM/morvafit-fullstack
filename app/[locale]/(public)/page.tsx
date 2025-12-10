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
      <main className="overflow-hidden flex flex-col">
        {/* Above the fold - load immediately */}
        <HeroSection />
        <ServicesSection className="py-16 md:py-24 lg:py-32" />

        {/* Below the fold - lazy load */}
        <Suspense fallback={<div className="h-screen flex flex-col" />}>
          <MottoSection className="py-16 " />
          <UserForm className="py-16 md:py-24 lg:py-32" />
          <AboutSection className="py-16 md:py-24 lg:py-32" />
          <TestimonialsSection className="py-16 md:py-24 lg:py-32" />
          {/* <TransformationsSection className="py-16 md:py-24 lg:py-32" /> */}
          <FAQSection className="py-16 md:py-24 lg:py-32" />
          {/* <FinalCTASection className="py-20 md:py-28 lg:py-36" /> */}
        </Suspense>
      </main>
    </HomeWithLoader>
  )
}

export default Home

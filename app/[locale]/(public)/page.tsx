"use client"
import AboutSection from "@/components/home/ServicesSection"
import HeroSection from "@/components/home/HeroSection"
import MottoSection from "@/components/home/MottoSection"
import Divider from "@/components/ui/Divider"

const Home = () => {
  return (
    <div className="space-y-4 min-h-[200vh]">
      <HeroSection />
      <Divider className="pb-10" />
      <MottoSection />
      <Divider className="py-16" />
      <AboutSection />
    </div>
  )
}

export default Home

"use client"
import ServicesSection from "@/components/home/ServicesSection"
import HeroSection from "@/components/home/HeroSection"
import MottoSection from "@/components/home/MottoSection"
import AboutSection from "@/components/home/AboutSection"
import UserForm from "@/components/home/UserForm"
import Divider from "@/components/ui/Divider"

const Home = () => {
  return (
    <main>
      <HeroSection />
      <MottoSection />
      <ServicesSection />
      <UserForm />
      <AboutSection />
      <Divider />
    </main>
  )
}

export default Home

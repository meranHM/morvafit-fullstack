"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Clock, TrendingUp, Dumbbell } from "lucide-react"
import Image from "next/image"
import { useLenis } from "lenis/react"

export interface ServiceDetail {
  id: number
  title: string
  description: string
  image: string
  fullDescription: string
  duration: string
  level: string
  focus: string[]
  benefits: string[]
  includes: string[]
}

const serviceDetails: ServiceDetail[] = [
  {
    id: 0,
    title: "ModelFit",
    description: "My special workout plan",
    image: "/service-image-1.png",
    fullDescription:
      "The signature program designed by Morva herself. This comprehensive plan combines strength training, cardio, and flexibility work to sculpt a lean, toned physique. Perfect for those looking to achieve that runway-ready confidence.",
    duration: "12 Weeks",
    level: "Intermediate to Advanced",
    focus: ["Full Body Sculpting", "Lean Muscle Building", "Posture & Grace"],
    benefits: [
      "Complete body transformation",
      "Improved posture and confidence",
      "Sustainable lifestyle changes",
      "Professional nutrition guidance",
      "Weekly progress check-ins",
    ],
    includes: [
      "48 custom workout videos",
      "Detailed meal planning guide",
      "Direct coach access",
      "Progress tracking tools",
      "Private community access",
    ],
  },
  {
    id: 1,
    title: "Personal",
    description: "Your personal plan",
    image: "/service-image-3.png",
    fullDescription:
      "A completely customized program tailored to your unique goals, fitness level, and lifestyle. Every aspect is personalized - from workout selection to nutrition planning - ensuring maximum results.",
    duration: "Flexible (4-16 Weeks)",
    level: "All Levels",
    focus: ["Custom Goal Setting", "Individualized Programming", "Adaptive Training"],
    benefits: [
      "100% personalized to your needs",
      "Flexible scheduling options",
      "One-on-one coaching sessions",
      "Custom meal plans",
      "Unlimited plan adjustments",
    ],
    includes: [
      "Initial fitness assessment",
      "Personalized workout library",
      "Custom nutrition plan",
      "Bi-weekly video calls",
      "24/7 coach support",
    ],
  },
  {
    id: 2,
    title: "Fit and Fierce",
    description: "Stay fit in every part of your body",
    image: "/service-image-4.png",
    fullDescription:
      "High-intensity full-body workouts designed to build strength, endurance, and confidence. This program pushes you to your limits while ensuring proper form and sustainable progress.",
    duration: "8 Weeks",
    level: "Intermediate",
    focus: ["Total Body Strength", "HIIT Training", "Endurance Building"],
    benefits: [
      "Increased overall strength",
      "Improved cardiovascular fitness",
      "Enhanced athletic performance",
      "Boosted metabolism",
      "Greater energy levels",
    ],
    includes: [
      "32 intense workout videos",
      "Progressive overload system",
      "Recovery protocols",
      "Nutrition guidelines",
      "Monthly assessments",
    ],
  },
  {
    id: 3,
    title: "Abs & Core Goals",
    description: "Home edition",
    image: "/service-image-5.png",
    fullDescription:
      "Focused core training program designed for home workouts. Build a strong, defined midsection with minimal equipment while improving overall stability and posture.",
    duration: "6 Weeks",
    level: "Beginner to Intermediate",
    focus: ["Core Strength", "Ab Definition", "Functional Stability"],
    benefits: [
      "Visible ab definition",
      "Improved posture",
      "Better balance and stability",
      "Reduced back pain",
      "Stronger foundation for all exercises",
    ],
    includes: [
      "24 targeted core workouts",
      "Minimal equipment needed",
      "Nutrition tips for definition",
      "Progress photos tracking",
      "Core-specific stretching routines",
    ],
  },
  {
    id: 4,
    title: "Glute Goals",
    description: "Home Edition",
    image: "/service-image-6.png",
    fullDescription:
      "Specialized lower body program focused on building strong, sculpted glutes from the comfort of your home. Perfect for those wanting to enhance their lower body strength and shape.",
    duration: "8 Weeks",
    level: "All Levels",
    focus: ["Glute Development", "Lower Body Strength", "Hip Mobility"],
    benefits: [
      "Sculpted, lifted glutes",
      "Stronger legs and hips",
      "Improved athletic performance",
      "Better posture and alignment",
      "Enhanced lower body power",
    ],
    includes: [
      "32 glute-focused workouts",
      "Resistance band protocols",
      "Hip mobility routines",
      "Booty-building nutrition guide",
      "Weekly form check videos",
    ],
  },
  {
    id: 5,
    title: "Modern Techniques",
    description: "Home Edition",
    image: "/service-image-2.png",
    fullDescription:
      "Specialized lower body program focused on building strong, sculpted glutes from the comfort of your home. Perfect for those wanting to enhance their lower body strength and shape.",
    duration: "8 Weeks",
    level: "All Levels",
    focus: ["Glute Development", "Lower Body Strength", "Hip Mobility"],
    benefits: [
      "Sculpted, lifted glutes",
      "Stronger legs and hips",
      "Improved athletic performance",
      "Better posture and alignment",
      "Enhanced lower body power",
    ],
    includes: [
      "32 glute-focused workouts",
      "Resistance band protocols",
      "Hip mobility routines",
      "Booty-building nutrition guide",
      "Weekly form check videos",
    ],
  },
]

interface ServiceModalProps {
  service: ServiceDetail | null
  isOpen: boolean
  onClose: () => void
}

const ServiceModal = ({ service, isOpen, onClose }: ServiceModalProps) => {
  if (!service) return null

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = "unset"
      }}
    >
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-200"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl z-201 overflow-y-auto"
            data-lenis-prevent
          >
            <div className="relative flex flex-col">
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-gray-100 transition-colors shadow-lg"
              >
                <X size={20} className="text-gray-700" />
              </motion.button>

              <div className="custom-scrollbar">
                {/* Header Section */}
                <div className="relative bg-linear-to-br from-rose-500 to-pink-500 p-8 lg:p-12">
                  {/* Decorative elements */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                  </div>

                  <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                    {/* Text Content */}
                    <div className="text-white">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <span className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold mb-4">
                          {service.level}
                        </span>
                      </motion.div>

                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-5xl font-bold mb-4"
                      >
                        {service.title}
                      </motion.h2>

                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg text-white/90 mb-6"
                      >
                        {service.fullDescription}
                      </motion.p>

                      {/* Quick Stats */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap gap-4"
                      >
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm">
                          <Clock size={18} />
                          <span className="text-sm font-medium">{service.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm">
                          <TrendingUp size={18} />
                          <span className="text-sm font-medium">{service.level}</span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Image */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="relative"
                    >
                      <div className="relative w-full aspect-square bg-rose-50 backdrop-blur-2xl rounded-full overflow-hidden">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-contain drop-shadow-2xl"
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Content Sections */}
                <div className="p-8 lg:p-12 space-y-8">
                  {/* Focus Areas */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Dumbbell className="text-rose-500" size={24} />
                      Training Focus
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {service.focus.map((item, i) => (
                        <motion.span
                          key={item}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + i * 0.05 }}
                          className="px-4 py-2 rounded-xl bg-linear-to-r from-rose-100 to-pink-100 text-rose-700 font-medium text-sm"
                        >
                          {item}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Benefits & Includes Grid */}
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Benefits */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-linear-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200"
                    >
                      <h4 className="text-xl font-bold text-gray-900 mb-4">Key Benefits</h4>
                      <ul className="space-y-3">
                        {service.benefits.map((benefit, i) => (
                          <motion.li
                            key={benefit}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + i * 0.05 }}
                            className="flex items-start gap-3"
                          >
                            <div className="w-5 h-5 rounded-full bg-linear-to-r from-rose-500 to-pink-500 flex items-center justify-center shrink-0 mt-0.5">
                              <Check size={12} className="text-white" />
                            </div>
                            <span className="text-gray-700 text-sm">{benefit}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>

                    {/* What's Included */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-linear-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-200"
                    >
                      <h4 className="text-xl font-bold text-gray-900 mb-4">What's Included</h4>
                      <ul className="space-y-3">
                        {service.includes.map((item, i) => (
                          <motion.li
                            key={item}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + i * 0.05 }}
                            className="flex items-start gap-3"
                          >
                            <div className="w-5 h-5 rounded-full bg-linear-to-r from-rose-500 to-pink-500 flex items-center justify-center shrink-0 mt-0.5">
                              <Check size={12} className="text-white" />
                            </div>
                            <span className="text-gray-700 text-sm">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Hook to manage modal state
export const useServiceModal = () => {
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const lenis = useLenis()

  const openModal = (serviceId: number) => {
    const service = serviceDetails.find(s => s.id === serviceId)
    if (service) {
      setSelectedService(service)
      setIsModalOpen(true)
      lenis?.stop()
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    lenis?.start()
    setTimeout(() => setSelectedService(null), 300)
  }

  return {
    selectedService,
    isModalOpen,
    openModal,
    closeModal,
    ServiceModal: () => (
      <ServiceModal service={selectedService} isOpen={isModalOpen} onClose={closeModal} />
    ),
  }
}

export default ServiceModal

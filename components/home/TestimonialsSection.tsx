"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Emma Richardson",
    role: "Lost 15kg in 4 months",
    image: "/testimonials/emma.jpg",
    rating: 5,
    text: "Working with MorvaFit has been life-changing! The personalized workout plans and constant support helped me achieve goals I never thought possible. I feel stronger and more confident than ever.",
    achievement: "15kg lost",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Built muscle & strength",
    image: "/testimonials/michael.jpg",
    rating: 5,
    text: "The attention to detail in every workout plan is incredible. Morva truly understands body mechanics and created a program that fits my lifestyle perfectly. Best investment I've made!",
    achievement: "+8kg muscle",
  },
  {
    id: 3,
    name: "Sofia Martinez",
    role: "Transformed in 6 months",
    image: "/testimonials/sofia.jpg",
    rating: 5,
    text: "I've tried many fitness programs before, but MorvaFit is different. The support, the customization, and the results speak for themselves. I finally found something that works!",
    achievement: "30% stronger",
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Reached fitness peak",
    image: "/testimonials/james.jpg",
    rating: 5,
    text: "As a busy professional, I needed something flexible yet effective. Morva designed a plan that fits my schedule and delivers real results. Highly recommend!",
    achievement: "Consistent 5x/week",
  },
  {
    id: 5,
    name: "Aisha Patel",
    role: "Gained confidence",
    image: "/testimonials/aisha.jpg",
    rating: 5,
    text: "Beyond the physical transformation, MorvaFit helped me build mental strength and confidence. The holistic approach makes all the difference.",
    achievement: "Best shape at 35",
  },
]

interface TestimonialsSectionProps {
  className?: string
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ className }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const handlePrevious = () => {
    setIsAutoPlaying(false)
    setActiveIndex(prev => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setIsAutoPlaying(false)
    setActiveIndex(prev => (prev + 1) % testimonials.length)
  }

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false)
    setActiveIndex(index)
  }

  return (
    <section
      className={`bg-linear-to-br from-gray-50 via-white to-rose-50/30 relative overflow-hidden ${className}`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-linear-to-br from-rose-400 to-pink-400 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 rounded-full bg-linear-to-r from-rose-100 to-pink-100 text-rose-600 text-sm font-semibold">
              Success Stories
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Real People,{" "}
            <span className="bg-linear-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              Real Results
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join hundreds of clients who've transformed their lives with personalized coaching
          </p>
        </motion.div>

        {/* Main Testimonial Card */}
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200 shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-5 gap-8 p-8 lg:p-12">
              {/* Image Section */}
              <div className="md:col-span-2 flex flex-col items-center justify-center">
                <div className="relative">
                  {/* Decorative ring */}
                  <div className="absolute inset-0 bg-linear-to-r from-rose-500 to-pink-500 rounded-full blur-xl opacity-20 scale-110"></div>

                  {/* Avatar */}
                  <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl">
                    <div className="w-full h-full bg-linear-to-br from-rose-200 to-pink-200 flex items-center justify-center">
                      <span className="text-6xl font-bold text-white">
                        {testimonials[activeIndex].name.charAt(0)}
                      </span>
                    </div>
                  </div>

                  {/* Achievement badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="absolute -bottom-2 -right-2 px-4 py-2 rounded-full bg-linear-to-r from-rose-500 to-pink-500 text-white text-sm font-bold shadow-lg"
                  >
                    {testimonials[activeIndex].achievement}
                  </motion.div>
                </div>

                {/* Name & Role */}
                <div className="text-center mt-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {testimonials[activeIndex].name}
                  </h3>
                  <p className="text-gray-600 mt-1">{testimonials[activeIndex].role}</p>

                  {/* Star Rating */}
                  <div className="flex items-center justify-center gap-1 mt-3">
                    {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                      <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="md:col-span-3 flex flex-col justify-center">
                <Quote className="text-rose-300 mb-4" size={48} />
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  {testimonials[activeIndex].text}
                </p>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-200">
                  <div className="flex gap-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === activeIndex
                            ? "w-8 bg-linear-to-r from-rose-500 to-pink-500"
                            : "w-2 bg-gray-300 hover:bg-gray-400"
                        }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handlePrevious}
                      className="p-3 rounded-xl border border-gray-300 hover:border-rose-300 hover:bg-rose-50 transition-all duration-300"
                      aria-label="Previous testimonial"
                    >
                      <ChevronLeft size={20} className="text-gray-700" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleNext}
                      className="p-3 rounded-xl border border-gray-300 hover:border-rose-300 hover:bg-rose-50 transition-all duration-300"
                      aria-label="Next testimonial"
                    >
                      <ChevronRight size={20} className="text-gray-700" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
        >
          {[
            { number: "500+", label: "Happy Clients" },
            { number: "98%", label: "Success Rate" },
            { number: "2,500+", label: "Workouts Completed" },
            { number: "4.9/5", label: "Average Rating" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-200"
            >
              <p className="text-3xl md:text-4xl font-bold bg-linear-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                {stat.number}
              </p>
              <p className="text-sm text-gray-600 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default TestimonialsSection

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus, MessageCircle, Clock, CreditCard, Dumbbell, Video, Users } from "lucide-react"

const faqs = [
  {
    id: 1,
    category: "Getting Started",
    icon: Users,
    question: "How do I get started with MorvaFit?",
    answer:
      "Getting started is simple! Sign up, fill out your health and fitness profile, and you'll receive a personalized workout plan within 24 hours. After submitting your payment receipt, you'll get instant access to your custom video workouts.",
  },
  {
    id: 2,
    category: "Getting Started",
    icon: Users,
    question: "Do I need any equipment to start?",
    answer:
      "It depends on your goals! We create plans for all situations - home workouts with minimal equipment, gym-based programs, or bodyweight-only routines. Just let us know your available equipment in your profile.",
  },
  {
    id: 3,
    category: "Workouts",
    icon: Dumbbell,
    question: "How long are the workouts?",
    answer:
      "Workout duration varies based on your fitness level and goals, typically ranging from 30-60 minutes. Each plan is customized to fit your schedule and lifestyle.",
  },
  {
    id: 4,
    category: "Workouts",
    icon: Video,
    question: "Can I access workout videos anytime?",
    answer:
      "Yes! Once your payment is approved, you get unlimited access to all your assigned workout videos. Watch them anytime, anywhere, on any device.",
  },
  {
    id: 5,
    category: "Workouts",
    icon: Dumbbell,
    question: "What if I can't complete a workout?",
    answer:
      "That's totally normal! Your plan can be adjusted based on your progress. Just reach out and we'll modify exercises or intensity to match your current fitness level.",
  },
  {
    id: 6,
    category: "Payment",
    icon: CreditCard,
    question: "How does the payment process work?",
    answer:
      "We accept offline payments via bank transfer. Upload your payment receipt through your dashboard, and once approved by our admin (usually within 24 hours), you'll get instant access to your workout plans.",
  },
  {
    id: 7,
    category: "Payment",
    icon: CreditCard,
    question: "What's your refund policy?",
    answer:
      "We offer a 14-day money-back guarantee if you're not satisfied with your experience. No questions asked - your satisfaction is our priority.",
  },
  {
    id: 8,
    category: "Payment",
    icon: CreditCard,
    question: "Are there any hidden fees?",
    answer:
      "No hidden fees ever! The price you see is the price you pay. Monthly membership includes personalized workout plans, video access, and ongoing support.",
  },
  {
    id: 9,
    category: "Support",
    icon: MessageCircle,
    question: "How do I contact my coach?",
    answer:
      "You can reach out through your dashboard messaging system, email, or WhatsApp. We typically respond within 4-6 hours during business days.",
  },
  {
    id: 10,
    category: "Support",
    icon: Clock,
    question: "How often will my plan be updated?",
    answer:
      "Your workout plan is reviewed and updated monthly based on your progress. You can also request adjustments anytime if something isn't working for you.",
  },
  {
    id: 11,
    category: "Support",
    icon: MessageCircle,
    question: "What if I have a medical condition?",
    answer:
      "Please disclose any medical conditions in your health profile. We'll design a safe, effective program tailored to your needs. Always consult your doctor before starting any fitness program.",
  },
  {
    id: 12,
    category: "Results",
    icon: Clock,
    question: "How quickly will I see results?",
    answer:
      "Most clients notice improvements in energy and strength within 2-3 weeks. Visible physical changes typically appear within 6-8 weeks with consistent effort. Remember, sustainable transformation takes time!",
  },
]

const categories = [
  { name: "All", count: faqs.length },
  { name: "Getting Started", count: faqs.filter(f => f.category === "Getting Started").length },
  { name: "Workouts", count: faqs.filter(f => f.category === "Workouts").length },
  { name: "Payment", count: faqs.filter(f => f.category === "Payment").length },
  { name: "Support", count: faqs.filter(f => f.category === "Support").length },
  { name: "Results", count: faqs.filter(f => f.category === "Results").length },
]

const FAQSection = () => {
  const [openId, setOpenId] = useState<number | null>(1)
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredFaqs =
    activeCategory === "All" ? faqs : faqs.filter(faq => faq.category === activeCategory)

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section className="py-20 lg:py-32 bg-linear-to-br from-gray-50 via-white to-rose-50/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-linear-to-tr from-rose-400 to-pink-400 rounded-full blur-3xl"
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
              FAQ
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Questions?{" "}
            <span className="bg-linear-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              We've Got Answers
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about getting started with MorvaFit
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map(category => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeCategory === category.name
                  ? "bg-linear-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/25"
                  : "bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 hover:border-rose-300 hover:bg-rose-50"
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </motion.div>

        {/* FAQ Grid */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {filteredFaqs.map((faq, index) => {
                const Icon = faq.icon
                const isOpen = openId === faq.id

                return (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isOpen ? "bg-linear-to-r from-rose-500 to-pink-500" : "bg-gray-100"
                          }`}
                        >
                          <Icon size={20} className={isOpen ? "text-white" : "text-gray-600"} />
                        </div>
                        <span className="font-semibold text-gray-900 text-lg">{faq.question}</span>
                      </div>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                          isOpen ? "bg-linear-to-r from-rose-500 to-pink-500" : "bg-gray-100"
                        }`}
                      >
                        {isOpen ? (
                          <Minus size={16} className="text-white" />
                        ) : (
                          <Plus size={16} className="text-gray-600" />
                        )}
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6">
                            <div className="pl-14">
                              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Still Have Questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="max-w-2xl mx-auto bg-linear-to-r from-rose-500 to-pink-500 rounded-3xl p-8 md:p-12 text-white">
            <MessageCircle className="mx-auto mb-4" size={48} />
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Still Have Questions?</h3>
            <p className="text-white/90 mb-6 text-lg">
              Our team is here to help! Get in touch and we'll respond within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl bg-white text-rose-600 font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg"
              >
                Contact Support
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl border-2 border-white text-white font-semibold hover:bg-white/10 transition-all duration-300"
              >
                Schedule a Call
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FAQSection

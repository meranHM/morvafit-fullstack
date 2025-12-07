"use client"

import { motion } from "framer-motion"
import { ArrowRight, Check, Sparkles, Star, TrendingUp, Award } from "lucide-react"
import Image from "next/image"

const benefits = [
  "Personalized workout plans tailored to your goals",
  "Direct access to professional coaching",
  "Progress tracking and regular plan updates",
  "Unlimited access to workout videos",
  "Flexible payment options",
  "14-day money-back guarantee",
]

const stats = [
  { icon: Star, value: "4.9/5", label: "Client Rating" },
  { icon: TrendingUp, value: "98%", label: "Success Rate" },
  { icon: Award, value: "500+", label: "Transformations" },
]

const FinalCTASection = () => {
  return (
    <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.03, 0.06, 0.03],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-linear-to-br from-rose-400 to-pink-400 rounded-full blur-3xl"
        />

        {/* Floating elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            className="absolute w-20 h-20 rounded-full bg-linear-to-br from-rose-300 to-pink-300 blur-2xl"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-rose-100 to-pink-100 text-rose-600 text-sm font-semibold mb-6"
            >
              <Sparkles size={16} />
              Limited Time Offer
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Ready to{" "}
              <span className="bg-linear-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                Transform
              </span>{" "}
              Your Life?
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 leading-relaxed"
            >
              Join hundreds of successful clients who've achieved their fitness goals with
              personalized coaching and proven workout plans.
            </motion.p>

            {/* Benefits List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-3 mb-8"
            >
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-linear-to-r from-rose-500 to-pink-500 flex items-center justify-center shrink-0">
                    <Check size={14} className="text-white" />
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center justify-center gap-2 px-8 py-5 rounded-xl bg-linear-to-r from-rose-500 to-pink-500 text-white font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-xl shadow-rose-500/30 hover:shadow-2xl hover:shadow-rose-500/40"
              >
                Start Your Journey Now
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={20} />
                </motion.div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-5 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-rose-300 hover:bg-rose-50 transition-all duration-300"
              >
                Schedule a Consultation
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap gap-6"
            >
              {stats.map((stat, i) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-linear-to-r from-rose-500 to-pink-500 flex items-center justify-center">
                      <Icon size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>

          {/* Right Side - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Main Card */}
            <div className="relative bg-linear-to-br from-rose-500 to-pink-500 rounded-3xl p-8 lg:p-12 text-white shadow-2xl">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

              <div className="relative z-10">
                {/* Special Offer Badge */}
                <motion.div
                  animate={{
                    rotate: [-5, 5, -5],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-4 -right-4 px-6 py-3 rounded-full bg-yellow-400 text-gray-900 font-bold text-sm shadow-lg"
                >
                  🎉 First Month 20% OFF
                </motion.div>

                <h3 className="text-3xl md:text-4xl font-bold mb-4">Start Today</h3>
                <p className="text-white/90 text-lg mb-8">
                  Get instant access to your personalized fitness plan
                </p>

                {/* Pricing */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-bold">$120</span>
                    <span className="text-white/70 line-through text-2xl">$150</span>
                    <span className="text-white/90">/month</span>
                  </div>
                  <p className="text-white/80 text-sm">Cancel anytime • No hidden fees</p>
                </div>

                {/* What's Included */}
                <div className="space-y-3 mb-8">
                  <p className="text-sm font-semibold text-white/90 uppercase tracking-wide">
                    What's Included:
                  </p>
                  {[
                    "Custom workout plan",
                    "Video demonstrations",
                    "Progress tracking",
                    "Direct coach access",
                    "Monthly plan updates",
                  ].map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="flex items-center gap-2"
                    >
                      <Check size={16} className="text-white" />
                      <span className="text-white/90 text-sm">{item}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Trust Badge */}
                <div className="flex items-center justify-center gap-2 pt-6 border-t border-white/20">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-xs font-bold"
                      >
                        {i === 4 ? "+" : ""}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-white/90">
                    <span className="font-bold">500+</span> clients already started
                  </p>
                </div>
              </div>
            </div>

            {/* Floating testimonial card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl max-w-xs hidden lg:block"
            >
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-gray-700 mb-2">
                "Best decision I ever made! Lost 15kg and feel amazing."
              </p>
              <p className="text-xs text-gray-500 font-medium">- Sarah M., Verified Client</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-green-100 border border-green-200">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <Check size={16} className="text-white" />
            </div>
            <p className="text-sm text-gray-700">
              <span className="font-bold">14-Day Money-Back Guarantee</span> • No questions asked
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FinalCTASection

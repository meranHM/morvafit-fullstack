"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, TrendingDown, Dumbbell, Award, ChevronRight } from "lucide-react"

const transformations = [
  {
    id: 1,
    name: "Jessica M.",
    age: 32,
    duration: "4 Months",
    achievement: "Lost 18kg",
    story:
      "After having two kids, I thought I'd never get my confidence back. MorvaFit proved me wrong!",
    stats: {
      weight: "-18kg",
      bodyFat: "-12%",
      muscle: "+3kg",
    },
    beforeImage: "/transformations/jessica-before.jpg",
    afterImage: "/transformations/jessica-after.jpg",
  },
  {
    id: 2,
    name: "Marcus T.",
    age: 28,
    duration: "6 Months",
    achievement: "Gained 10kg Muscle",
    story:
      "From skinny to strong. The structured plan and nutrition guidance made all the difference.",
    stats: {
      weight: "+10kg",
      bodyFat: "-5%",
      muscle: "+12kg",
    },
    beforeImage: "/transformations/marcus-before.jpg",
    afterImage: "/transformations/marcus-after.jpg",
  },
  {
    id: 3,
    name: "Priya S.",
    age: 35,
    duration: "5 Months",
    achievement: "Complete Body Recomp",
    story:
      "I didn't just lose weight, I completely transformed my relationship with fitness and food.",
    stats: {
      weight: "-12kg",
      bodyFat: "-15%",
      muscle: "+4kg",
    },
    beforeImage: "/transformations/priya-before.jpg",
    afterImage: "/transformations/priya-after.jpg",
  },
]

const TransformationsSection = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ec4899' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
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
              Proven Results
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Incredible{" "}
            <span className="bg-linear-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              Transformations
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what's possible when you commit to your goals with the right guidance
          </p>
        </motion.div>

        {/* Featured Transformation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="bg-linear-to-br from-gray-50 to-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Before/After Images */}
              <div className="relative">
                <div className="grid grid-cols-2 divide-x divide-gray-200">
                  {/* Before */}
                  <div className="relative aspect-3/4 bg-linear-to-br from-gray-200 to-gray-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-32 h-32 rounded-full bg-gray-400 mx-auto mb-4"></div>
                        <span className="text-gray-600 font-medium">Before</span>
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                      Before
                    </div>
                  </div>

                  {/* After */}
                  <div className="relative aspect-3/4 bg-linear-to-br from-rose-200 to-pink-200">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-32 h-32 rounded-full bg-linear-to-br from-rose-400 to-pink-400 mx-auto mb-4"></div>
                        <span className="text-gray-700 font-medium">After</span>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-linear-to-r from-rose-500 to-pink-500 text-white text-xs font-bold">
                      After
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="mb-6">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {transformations[activeTab].name}
                  </h3>
                  <p className="text-gray-600">
                    {transformations[activeTab].age} years old •{" "}
                    {transformations[activeTab].duration}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-rose-500 to-pink-500 text-white font-semibold mb-4">
                    <Award size={20} />
                    {transformations[activeTab].achievement}
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    "{transformations[activeTab].story}"
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {Object.entries(transformations[activeTab].stats).map(([key, value]) => (
                    <div
                      key={key}
                      className="text-center p-4 rounded-xl bg-gray-50 border border-gray-200"
                    >
                      <p className="text-2xl font-bold bg-linear-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                        {value}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 capitalize">{key}</p>
                    </div>
                  ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                  {transformations.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(index)}
                      className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                        activeTab === index
                          ? "bg-linear-to-r from-rose-500 to-pink-500 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {item.name.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* More Transformations Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            More Amazing Transformations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onMouseEnter={() => setHoveredCard(item)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer"
              >
                <div className="relative aspect-3/4 bg-linear-to-br from-gray-200 to-gray-300">
                  {/* Placeholder for transformation image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Dumbbell className="text-gray-400" size={48} />
                  </div>

                  {/* Overlay on hover */}
                  <AnimatePresence>
                    {hoveredCard === item && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6"
                      >
                        <motion.div
                          initial={{ y: 20 }}
                          animate={{ y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <p className="text-white font-bold text-lg mb-1">Client #{item}</p>
                          <p className="text-white/80 text-sm mb-3">6 months transformation</p>
                          <div className="flex gap-2">
                            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs">
                              -15kg
                            </span>
                            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs">
                              +5kg muscle
                            </span>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-linear-to-r from-rose-500 to-pink-500 text-white text-xs font-bold">
                    Verified
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-6">Ready to start your own transformation?</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-linear-to-r from-rose-500 to-pink-500 text-white font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-rose-500/25"
          >
            Start Your Journey
            <ChevronRight size={20} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default TransformationsSection

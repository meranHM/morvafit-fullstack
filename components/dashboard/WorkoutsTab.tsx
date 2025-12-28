"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Activity, Check, Play, Award, Calendar } from "lucide-react"

const mockVideos = [
  {
    id: 1,
    title: "Full Body Strength Training",
    duration: "45 min",
    level: "Intermediate",
    thumbnail: "/thumb1.jpg",
    assignedDate: "Mar 10, 2024",
    completed: true,
  },
  {
    id: 2,
    title: "HIIT Cardio Blast",
    duration: "30 min",
    level: "Advanced",
    thumbnail: "/thumb2.jpg",
    assignedDate: "Mar 12, 2024",
    completed: false,
  },
  {
    id: 3,
    title: "Core & Abs Workout",
    duration: "25 min",
    level: "Beginner",
    thumbnail: "/thumb3.jpg",
    assignedDate: "Mar 15, 2024",
    completed: false,
  },
]

interface WorkoutsTabProps {}

const WorkoutsTab: React.FC<WorkoutsTabProps> = ({}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">My Workouts</h2>
              <p className="text-gray-600 mt-1">Your personalized workout plan</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Award className="text-rose-500" size={20} />
              <span className="text-gray-600">1 of 3 completed</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockVideos.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative aspect-video bg-linear-to-br from-gray-200 to-gray-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-xl flex items-center justify-center shadow-lg group-hover:bg-linear-to-r group-hover:from-rose-500 group-hover:to-pink-500 transition-all duration-300"
                    >
                      <Play className="text-gray-900 group-hover:text-white ml-1" size={24} />
                    </motion.button>
                  </div>
                  {video.completed && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-medium flex items-center gap-1">
                      <Check size={14} />
                      Completed
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                    {video.duration}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{video.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <Activity size={16} />
                      {video.level}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      Assigned {video.assignedDate}
                    </span>
                  </div>
                  <button className="w-full py-3 rounded-xl bg-linear-to-r from-rose-500 to-pink-500 text-white font-medium hover:from-rose-600 hover:to-pink-600 transition-all duration-300">
                    {video.completed ? "Watch Again" : "Start Workout"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default WorkoutsTab

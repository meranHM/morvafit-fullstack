"use client"

import { Video, Receipt, Check, Play } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { stats } from "@/data/statics/user-dashboard"

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

interface VideoType {
  id: number
  title: string
  duration: string
  level: string
  thumbnail: string
  assignedDate: string
  completed: boolean
}

interface OverviewTabProps {
  videos: VideoType[]
  name: string
  nextPayment: string
}

const OverviewTab: React.FC<OverviewTabProps> = ({ videos, name, nextPayment }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-6">
          {/* Welcome Banner */}
          <div className="bg-linear-to-r from-rose-500 to-pink-500 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {name.split(" ")[0]}! 👋</h1>
              <p className="text-white/90">You're doing amazing! Keep up the great work.</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-linear-to-r ${stat.color} flex items-center justify-center mb-4`}
                  >
                    <Icon size={24} className="text-white" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </motion.div>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                  <Video className="text-rose-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Continue Your Journey</h3>
                  <p className="text-sm text-gray-600">2 new workouts assigned</p>
                </div>
              </div>
              <button
                // onClick={() => setActiveTab("videos")}
                className="w-full py-3 rounded-xl bg-linear-to-r from-rose-500 to-pink-500 text-white font-medium hover:from-rose-600 hover:to-pink-600 transition-all duration-300"
              >
                View Workouts
              </button>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Receipt className="text-purple-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Payment Due Soon</h3>
                  <p className="text-sm text-gray-600">Next payment: {nextPayment}</p>
                </div>
              </div>
              <button
                // onClick={() => setActiveTab("payments")}
                className="w-full py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:border-rose-300 hover:bg-rose-50 transition-all duration-300"
              >
                Make Payment
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Workouts</h3>
            <div className="space-y-3">
              {videos.slice(0, 3).map(video => (
                <div
                  key={video.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-linear-to-br from-rose-400 to-pink-400 flex items-center justify-center">
                      <Play className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{video.title}</p>
                      <p className="text-sm text-gray-600">
                        {video.duration} • {video.level}
                      </p>
                    </div>
                  </div>
                  {video.completed && (
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="text-green-600" size={16} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default OverviewTab

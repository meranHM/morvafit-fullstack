"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Activity, Check, Play, Award, Calendar, VideoOff } from "lucide-react"

interface VideoType {
  id: string
  title: string
  duration: string
  level: string
  thumbnail: string
  assignedDate: string
  completed: boolean
}

interface WorkoutsTabProps {
  videos: VideoType[]
}

const WorkoutsTab: React.FC<WorkoutsTabProps> = ({ videos }) => {
  // Calculating completion stats
  const completedCount = videos.filter(v => v.completed).length
  const totalCount = videos.length
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
              <span className="text-gray-600">
                {completedCount} of {totalCount} completed
              </span>
            </div>
          </div>

          {/* Empty state when no videos are assigned */}
          {videos.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <VideoOff className="text-gray-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Workouts Assigned Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Once your payment is approved, your personalized workout videos will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((video, i) => (
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
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default WorkoutsTab

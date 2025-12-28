"use client"

import type { HealthData } from "@/types/bodyInfo"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { X, Edit } from "lucide-react"

interface HealthProfileTabProps {
  healthData: HealthData | null
}

const HealthProfileTab: React.FC<HealthProfileTabProps> = ({ healthData }) => {
  const [isEditingHealth, setIsEditingHealth] = useState(false)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {!healthData ? (
          <div className="bg-white/80 rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Health Profile Incomplete</h3>
            <p className="text-gray-600 mt-2">
              Add your body information to personalize your workouts.
            </p>
            <button className="mt-4 px-5 py-2 rounded-xl bg-rose-500 text-white">
              Complete Profile
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Health Profile</h2>
                <p className="text-gray-600 mt-1">Your body metrics and fitness information</p>
              </div>
              <button
                onClick={() => setIsEditingHealth(!isEditingHealth)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:border-rose-300 hover:bg-rose-50 transition-all duration-300"
              >
                {isEditingHealth ? <X size={18} /> : <Edit size={18} />}
                {isEditingHealth ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Height</h3>
                {isEditingHealth ? (
                  <input
                    type="text"
                    defaultValue={healthData.height}
                    className="text-2xl font-bold text-gray-900 bg-gray-50 rounded-lg px-3 py-2 w-full"
                  />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{healthData.height}</p>
                )}
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Weight</h3>
                {isEditingHealth ? (
                  <input
                    type="text"
                    defaultValue={healthData.weight}
                    className="text-2xl font-bold text-gray-900 bg-gray-50 rounded-lg px-3 py-2 w-full"
                  />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{healthData.weight}</p>
                )}
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Age</h3>
                {isEditingHealth ? (
                  <input
                    type="text"
                    defaultValue={healthData.age}
                    className="text-2xl font-bold text-gray-900 bg-gray-50 rounded-lg px-3 py-2 w-full"
                  />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{healthData.age}</p>
                )}
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Fitness Level</h3>
                {isEditingHealth ? (
                  <select className="text-2xl font-bold text-gray-900 bg-gray-50 rounded-lg px-3 py-2 w-full">
                    <option>Beginner</option>
                    <option selected>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{healthData.fitnessLevel}</p>
                )}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Fitness Goal</h3>
                  {isEditingHealth ? (
                    <input
                      type="text"
                      defaultValue={healthData.goal}
                      className="text-lg text-gray-900 bg-gray-50 rounded-lg px-3 py-2 w-full"
                    />
                  ) : (
                    <p className="text-lg text-gray-900">{healthData.goal}</p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Workout Frequency</h3>
                  {isEditingHealth ? (
                    <input
                      type="text"
                      defaultValue={healthData.workoutFrequency}
                      className="text-lg text-gray-900 bg-gray-50 rounded-lg px-3 py-2 w-full"
                    />
                  ) : (
                    <p className="text-lg text-gray-900">{healthData.workoutFrequency}</p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Dietary Preferences</h3>
                  {isEditingHealth ? (
                    <input
                      type="text"
                      defaultValue={healthData.dietaryPreferences}
                      className="text-lg text-gray-900 bg-gray-50 rounded-lg px-3 py-2 w-full"
                    />
                  ) : (
                    <p className="text-lg text-gray-900">{healthData.dietaryPreferences}</p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Medical Conditions</h3>
                  {isEditingHealth ? (
                    <textarea
                      defaultValue={healthData.medicalConditions}
                      rows={3}
                      className="text-lg text-gray-900 bg-gray-50 rounded-lg px-3 py-2 w-full"
                    />
                  ) : (
                    <p className="text-lg text-gray-900">{healthData.medicalConditions}</p>
                  )}
                </div>
              </div>

              {isEditingHealth && (
                <div className="mt-6 flex gap-3">
                  <button className="flex-1 py-3 rounded-xl bg-linear-to-r from-rose-500 to-pink-500 text-white font-medium hover:from-rose-600 hover:to-pink-600 transition-all duration-300">
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditingHealth(false)}
                    className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <p className="text-sm text-gray-500 mt-4">Last updated: {healthData.lastUpdated}</p>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default HealthProfileTab

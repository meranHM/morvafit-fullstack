"use client"

import type { HealthData } from "@/types/bodyInfo"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Edit, ClipboardList } from "lucide-react"
import DashboardBodyInfoForm, { RawBodyInfoData } from "./DashboardBodyInfoForm"

// healthData: Formatted data for display (strings like "175 cm", "70 kg")
// rawBodyInfo: Raw data from database for editing (numbers and enums)
// userInfo: User's basic info for pre-filling form fields
interface HealthProfileTabProps {
  healthData: HealthData | null
  rawBodyInfo?: RawBodyInfoData | null
  userName?: string
  userEmail?: string
  userPhone?: string
}

const HealthProfileTab: React.FC<HealthProfileTabProps> = ({
  healthData,
  rawBodyInfo = null,
  userName = "",
  userEmail = "",
  userPhone = "",
}) => {
  const [showForm, setShowForm] = useState(false)

  // When showForm is true, we show the multi-step form
  if (showForm) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <DashboardBodyInfoForm
          initialData={rawBodyInfo}
          onCancel={() => setShowForm(false)}
          userName={userName}
          userEmail={userEmail}
          userPhone={userPhone}
        />
      </motion.div>
    )
  }

  // View Mode
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {!healthData ? (
          <div className="bg-white/80 rounded-2xl p-8 border border-gray-200 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-100 flex items-center justify-center">
              <ClipboardList className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Health Profile Incomplete</h3>
            <p className="text-gray-600 mt-2 max-w-md mx-auto">
              Complete your health profile to get personalized workout recommendations tailored to
              your body metrics and fitness goals.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-6 px-6 py-3 rounded-xl bg-linear-to-r from-rose-500 to-pink-500 text-white font-medium hover:shadow-lg hover:shadow-rose-200 transition-all"
            >
              Complete Profile
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header with Edit button */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Health Profile</h2>
                <p className="text-gray-600 mt-1">Your body metrics and fitness information</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:border-rose-300 hover:bg-rose-50 transition-all duration-300"
              >
                <Edit size={18} />
                Edit
              </button>
            </div>

            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Height</h3>
                <p className="text-2xl font-bold text-gray-900">{healthData.height}</p>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Weight</h3>
                <p className="text-2xl font-bold text-gray-900">{healthData.weight}</p>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Age</h3>
                <p className="text-2xl font-bold text-gray-900">{healthData.age}</p>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Fitness Level</h3>
                <p className="text-2xl font-bold text-gray-900">{healthData.fitnessLevel}</p>
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Fitness Goal</h3>
                  <p className="text-lg text-gray-900">{healthData.goal}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Workout Frequency</h3>
                  <p className="text-lg text-gray-900">{healthData.workoutFrequency}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Dietary Preferences</h3>
                  <p className="text-lg text-gray-900">{healthData.dietaryPreferences}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Medical Conditions</h3>
                  <p className="text-lg text-gray-900">{healthData.medicalConditions}</p>
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-6 pt-4 border-t border-gray-200">
                Last updated: {healthData.lastUpdated}
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default HealthProfileTab

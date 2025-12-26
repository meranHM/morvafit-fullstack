"use client"

import { CheckCircle, Activity, Target, Scale } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"

// Props interface for the component
// These values come from the server component (UserBodyInfoForm)
interface AlreadySubmittedStateProps {
  bmi: number
  primaryGoal: string
  weight: number
  height: number
}

const AlreadySubmittedState = ({ bmi, primaryGoal, weight, height }: AlreadySubmittedStateProps) => {
  const t = useTranslations("UserForm")

  // Helper function to get BMI category and color
  const getBMICategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return { text: t("bmi.underweight") || "Underweight", color: "text-blue-400" }
    if (bmiValue < 25) return { text: t("bmi.normal") || "Normal", color: "text-green-400" }
    if (bmiValue < 30) return { text: t("bmi.overweight") || "Overweight", color: "text-yellow-400" }
    return { text: t("bmi.obese") || "Obese", color: "text-red-400" }
  }

  // Helper function to format goal enum to readable text
  const formatGoal = (goalEnum: string) => {
    const goalMap: Record<string, string> = {
      WEIGHT_LOSS: t("goals.weightLoss") || "Weight Loss",
      MUSCLE_GAIN: t("goals.muscleGain") || "Muscle Gain",
      GENERAL_FITNESS: t("goals.generalFitness") || "General Fitness",
      STRENGTH: t("goals.strength") || "Strength",
      ENDURANCE: t("goals.endurance") || "Endurance",
    }
    return goalMap[goalEnum] || goalEnum
  }

  const bmiCategory = getBMICategory(bmi)

  return (
    <section
      id="contact-form"
      className="py-24 px-4"
      style={{ background: "oklch(0.2389 0.0076 211.07)" }}
    >
      <div className="w-full max-w-2xl mx-auto text-center">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-linear-to-r from-green-500 to-emerald-500">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: "oklch(0.9465 0.013 17.39)" }}
          >
            {t("alreadySubmitted.title") || "Assessment Complete!"}
          </h2>

          {/* Description */}
          <p
            className="text-lg mb-8 opacity-80"
            style={{ color: "oklch(0.9465 0.013 17.39)" }}
          >
            {t("alreadySubmitted.description") ||
              "Your fitness assessment has been submitted. Here's a summary of your profile:"}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* BMI Card */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Activity className="w-6 h-6 mx-auto mb-2 text-rose-400" />
              <p className="text-sm opacity-60 mb-1" style={{ color: "oklch(0.9465 0.013 17.39)" }}>
                BMI
              </p>
              <p className="text-2xl font-bold" style={{ color: "oklch(0.9465 0.013 17.39)" }}>
                {bmi.toFixed(1)}
              </p>
              <p className={`text-sm ${bmiCategory.color}`}>{bmiCategory.text}</p>
            </div>

            {/* Goal Card */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Target className="w-6 h-6 mx-auto mb-2 text-rose-400" />
              <p className="text-sm opacity-60 mb-1" style={{ color: "oklch(0.9465 0.013 17.39)" }}>
                {t("alreadySubmitted.goal") || "Goal"}
              </p>
              <p className="text-lg font-bold" style={{ color: "oklch(0.9465 0.013 17.39)" }}>
                {formatGoal(primaryGoal)}
              </p>
            </div>

            {/* Weight Card */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Scale className="w-6 h-6 mx-auto mb-2 text-rose-400" />
              <p className="text-sm opacity-60 mb-1" style={{ color: "oklch(0.9465 0.013 17.39)" }}>
                {t("alreadySubmitted.weight") || "Weight"}
              </p>
              <p className="text-2xl font-bold" style={{ color: "oklch(0.9465 0.013 17.39)" }}>
                {weight} <span className="text-sm font-normal opacity-60">kg</span>
              </p>
            </div>

            {/* Height Card */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="w-6 h-6 mx-auto mb-2 text-rose-400 flex items-center justify-center text-lg">
                📏
              </div>
              <p className="text-sm opacity-60 mb-1" style={{ color: "oklch(0.9465 0.013 17.39)" }}>
                {t("alreadySubmitted.height") || "Height"}
              </p>
              <p className="text-2xl font-bold" style={{ color: "oklch(0.9465 0.013 17.39)" }}>
                {height} <span className="text-sm font-normal opacity-60">cm</span>
              </p>
            </div>
          </div>

          {/* Next Steps Message */}
          <p
            className="text-sm opacity-70 mb-6"
            style={{ color: "oklch(0.9465 0.013 17.39)" }}
          >
            {t("alreadySubmitted.nextSteps") ||
              "Your personalized fitness plan is being prepared. Check your dashboard for updates."}
          </p>

          {/* CTA Button - Link to Dashboard */}
          <Link
            href="/dashboard"
            className="inline-block px-8 py-4 rounded-full font-semibold bg-linear-to-r from-rose-500 to-pink-500 text-white transition-all hover:scale-105"
          >
            {t("alreadySubmitted.CTA") || "Go to Dashboard"}
          </Link>
        </div>
      </div>
    </section>
  )
}

export default AlreadySubmittedState

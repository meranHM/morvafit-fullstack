import { useTranslations } from "next-intl"
import { FormData } from "@/types/forms"

interface FinalDetailsStepProps {
  motivation: string
  motivationError: string
  challenges: string
  primaryGoal: string
  experienceLevel: string
  workoutDays: string[]
  sessionDuration: string
  dietaryPreference: string
  onChange: (field: keyof FormData, value: string | string[]) => void
}

const FinalDetailsStep: React.FC<FinalDetailsStepProps> = ({
  motivation,
  motivationError,
  challenges,
  primaryGoal,
  experienceLevel,
  workoutDays,
  sessionDuration,
  dietaryPreference,
  onChange,
}) => {
  const t = useTranslations("UserForm")
  return (
    <>
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "oklch(0.9465 0.013 17.39)" }}
        >
          {t("form.motivationTitle") || "What Motivates You?"} *
        </label>
        <textarea
          value={motivation}
          onChange={e => onChange("motivation", e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors resize-none"
          rows={4}
          placeholder="Tell us what drives you to achieve your fitness goals..."
        />
        {motivationError && <p className="text-red-400 text-sm mt-1">{motivationError}</p>}
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "oklch(0.9465 0.013 17.39)" }}
        >
          {t("form.challengesTitle") || "Biggest Challenges (Optional)"}
        </label>
        <textarea
          value={challenges}
          onChange={e => onChange("challenges", e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors resize-none"
          rows={4}
          placeholder="What obstacles have prevented you from reaching your goals in the past?"
        />
      </div>

      <div className="mt-8 p-6 rounded-lg" style={{ background: "oklch(0.3257 0.0203 269.5)" }}>
        <h4 className="text-lg font-semibold mb-3" style={{ color: "oklch(0.9465 0.013 17.39)" }}>
          📋 {t("form.assessmentSummery.title") || "Assessment Summary"}
        </h4>
        <div className="space-y-2 text-sm" style={{ color: "oklch(0.9465 0.013 17.39)" }}>
          <p>
            <strong>{t("form.assessmentSummery.goal") || "Goal"}:</strong>{" "}
            {primaryGoal || "Not set"}
          </p>
          <p>
            <strong>{t("form.assessmentSummery.experience") || "Experience"}:</strong>{" "}
            {experienceLevel || "Not set"}
          </p>
          <p>
            <strong>{t("form.assessmentSummery.workoutDays") || "Workout Days"}:</strong>{" "}
            {workoutDays.length > 0 ? workoutDays.join(", ") : "Not set"}
          </p>
          <p>
            <strong>{t("form.assessmentSummery.sessionDuration") || "Session Duration"}:</strong>{" "}
            {sessionDuration || "Not set"}
          </p>
          <p>
            <strong>{t("form.assessmentSummery.diet") || "Diet"}:</strong>{" "}
            {dietaryPreference || "Not set"}
          </p>
        </div>
      </div>
    </>
  )
}

export default FinalDetailsStep

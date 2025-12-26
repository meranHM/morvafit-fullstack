import { useTranslations } from "next-intl"
import type { FormData } from "@/types/forms"
import { activityLevels, fitnessGoals, experienceLevels } from "@/data/statics/body-info-form"

interface FitnessGoalsStepProps {
  primaryGoal: string
  primaryGoalError: string
  activityLevel: string
  activityLevelError: string
  experienceLevel: string
  experienceLevelError: string
  onChange: (field: keyof FormData, value: string | string[]) => void
}

const FitnessGoalsStep: React.FC<FitnessGoalsStepProps> = ({
  primaryGoal,
  primaryGoalError,
  activityLevel,
  activityLevelError,
  experienceLevel,
  experienceLevelError,
  onChange,
}) => {
  const t = useTranslations("UserForm")
  return (
    <>
      {/* Fitness Goal */}
      <div>
        <label
          className="block text-sm font-medium mb-3"
          style={{ color: "oklch(0.9465 0.013 17.39)" }}
        >
          {t("form.primaryGoalTitle") || "Primary Fitness Goal"} *
        </label>
        <div className="grid grid-cols-2 gap-3">
          {fitnessGoals.map(goal => (
            <button
              key={goal}
              type="button"
              onClick={() => onChange("primaryGoal", goal)}
              className={`px-8 py-4 rounded-full border transition-all ${
                primaryGoal === goal
                  ? "border-transparent"
                  : "border-white/20 bg-white/5 hover:bg-white/10"
              }`}
              style={primaryGoal === goal ? { background: "oklch(0.6787 0.1707 3.82)" } : {}}
            >
              <span style={{ color: "oklch(0.9465 0.013 17.39)" }}>{goal}</span>
            </button>
          ))}
        </div>
        {primaryGoalError && <p className="text-red-400 text-sm mt-1">{primaryGoalError}</p>}
      </div>

      {/* Activity Level */}
      <div>
        <label
          className="block text-sm font-medium mb-3"
          style={{ color: "oklch(0.9465 0.013 17.39)" }}
        >
          {t("form.currentActivityLevelTitle") || "Current Activity Level"} *
        </label>
        <div className="space-y-2">
          {activityLevels.map(level => (
            <button
              key={level.value}
              type="button"
              onClick={() => onChange("activityLevel", level.value)}
              className={`w-full px-8 py-4 rounded-full border text-left transition-all ${
                activityLevel === level.value
                  ? "border-transparent"
                  : "border-white/20 bg-white/5 hover:bg-white/10"
              }`}
              style={
                activityLevel === level.value ? { background: "oklch(0.6787 0.1707 3.82)" } : {}
              }
            >
              <div style={{ color: "oklch(0.9465 0.013 17.39)" }}>
                <p className="font-semibold">{level.label}</p>
                <p className="text-sm opacity-70">{level.desc}</p>
              </div>
            </button>
          ))}
        </div>
        {activityLevelError && <p className="text-red-400 text-sm mt-1">{activityLevelError}</p>}
      </div>

      {/* Experience Level */}
      <div>
        <label
          className="block text-sm font-medium mb-3"
          style={{ color: "oklch(0.9465 0.013 17.39)" }}
        >
          {t("form.experienceLevelTitle") || "Experience Level"} *
        </label>
        <div className="grid grid-cols-3 gap-3">
          {experienceLevels.map(level => (
            <button
              key={level}
              type="button"
              onClick={() => onChange("experienceLevel", level)}
              className={`px-8 py-4 rounded-full border transition-all ${
                experienceLevel === level
                  ? "border-transparent"
                  : "border-white/20 bg-white/5 hover:bg-white/10"
              }`}
              style={experienceLevel === level ? { background: "oklch(0.6787 0.1707 3.82)" } : {}}
            >
              <span style={{ color: "oklch(0.9465 0.013 17.39)" }}>{level}</span>
            </button>
          ))}
        </div>
        {experienceLevelError && (
          <p className="text-red-400 text-sm mt-1">{experienceLevelError}</p>
        )}
      </div>
    </>
  )
}

export default FitnessGoalsStep

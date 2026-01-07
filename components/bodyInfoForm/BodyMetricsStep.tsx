import { useTranslations } from "next-intl"
import type { FormData } from "@/types/forms"

interface BMICategory {
  text: string
  color: string
}

interface BodyMetricsStepProps {
  height: string
  heightError: string
  weight: string
  weightError: string
  targetWeight: string
  targetWeightError: string
  bmi: string | null
  bmiCategory: BMICategory | null
  onChange: (field: keyof FormData, value: string | string[]) => void
}

const BodyMetricsStep: React.FC<BodyMetricsStepProps> = ({
  height,
  heightError,
  weight,
  weightError,
  targetWeight,
  targetWeightError,
  bmi,
  bmiCategory,
  onChange,
}) => {
  const t = useTranslations("UserForm")
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "oklch(0.9465 0.013 17.39)" }}
          >
            {t("form.height") || "height (cm)"} *
          </label>
          <input
            type="number"
            value={height}
            onChange={e => onChange("height", e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
            placeholder={t("form.heightPlaceholder") || "175"}
          />
          {heightError && <p className="text-red-400 text-sm mt-1">{heightError}</p>}
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "oklch(0.9465 0.013 17.39)" }}
          >
            {t("form.weight") || "Weight (kg)"} *
          </label>
          <input
            type="number"
            value={weight}
            onChange={e => onChange("weight", e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
            placeholder={t("form.weightPlaceholder") || "75"}
          />
          {weightError && <p className="text-red-400 text-sm mt-1">{weightError}</p>}
        </div>
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "oklch(0.9465 0.013 17.39)" }}
        >
          {t("form.targetWeight") || "Target Weight (kg)"} *
        </label>
        <input
          type="number"
          value={targetWeight}
          onChange={e => onChange("targetWeight", e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
          placeholder={t("form.targetWeightPlaceholder") || "70"}
        />
        {targetWeightError && <p className="text-red-400 text-sm mt-1">{targetWeightError}</p>}
      </div>

      {bmi && (
        <div className="p-6 rounded-lg" style={{ background: "oklch(0.3257 0.0203 269.5)" }}>
          <h4 className="text-lg font-semibold mb-2 text-background">
            {t("form.bmiTitle") || "Your BMI Analysis"}
          </h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold" style={{ color: "oklch(0.6787 0.1707 3.82)" }}>
                {bmi}
              </p>
              <p className={`text-sm font-medium ${bmiCategory?.color || ""}`}>
                {bmiCategory?.text || ""}
              </p>
            </div>
            <div className="text-right opacity-80 text-background">
              <p className="text-sm">{t("form.weightToLose") || "Weight to lose"}:</p>
              <p className="text-lg font-semibold">
                {(parseFloat(weight) - parseFloat(targetWeight)).toFixed(1)} kg
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default BodyMetricsStep

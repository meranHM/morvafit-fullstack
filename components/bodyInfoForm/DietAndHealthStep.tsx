import { useTranslations } from "next-intl"
import { diets } from "@/data/statics/body-info-form"
import { FormData } from "@/types/forms"

interface DietAndHealthStepProps {
  dietaryPreference: string
  dietaryPreferenceError: string
  allergies: string
  medicalConditions: string
  medicalConditionsError: string
  injuries: string
  onChange: (field: keyof FormData, value: string | string[]) => void
}

const DietAndHealthStep: React.FC<DietAndHealthStepProps> = ({
  dietaryPreference,
  dietaryPreferenceError,
  allergies,
  medicalConditions,
  medicalConditionsError,
  injuries,
  onChange,
}) => {
  const t = useTranslations("UserForm")
  return (
    <>
      <div>
        <label
          className="block text-sm font-medium mb-3"
          style={{ color: "oklch(0.9465 0.013 17.39)" }}
        >
          {t("form.dietaryPreferenceTitle") || "Dietary Preference"} *
        </label>
        <div className="grid grid-cols-2 gap-3">
          {diets.map(diet => (
            <button
              key={diet}
              type="button"
              onClick={() => onChange("dietaryPreference", diet)}
              className={`px-8 py-4 rounded-full border transition-all ${
                dietaryPreference === diet
                  ? "border-transparent"
                  : "border-white/20 bg-white/5 hover:bg-white/10"
              }`}
              style={dietaryPreference === diet ? { background: "oklch(0.6787 0.1707 3.82)" } : {}}
            >
              <span style={{ color: "oklch(0.9465 0.013 17.39)" }}>{diet}</span>
            </button>
          ))}
        </div>
        {dietaryPreferenceError && (
          <p className="text-red-400 text-sm mt-1">{dietaryPreferenceError}</p>
        )}
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "oklch(0.9465 0.013 17.39)" }}
        >
          {t("form.foodAllergiesTitle") || "Food Allergies (Optional)"}
        </label>
        <input
          type="text"
          value={allergies}
          onChange={e => onChange("allergies", e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
          placeholder="e.g., Nuts, Dairy, Gluten"
        />
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "oklch(0.9465 0.013 17.39)" }}
        >
          {t("form.medicalConditionsTitle") || "Medical Conditions"} *
        </label>
        <textarea
          value={medicalConditions}
          onChange={e => onChange("medicalConditions", e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors resize-none"
          rows={3}
          placeholder="List any medical conditions we should be aware of (e.g., diabetes, heart condition, asthma)"
        />
        {medicalConditionsError && (
          <p className="text-red-400 text-sm mt-1">{medicalConditionsError}</p>
        )}
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "oklch(0.9465 0.013 17.39)" }}
        >
          {t("form.currentInjuriesTitle") || "Current Injuries (Optional)"}
        </label>
        <textarea
          value={injuries}
          onChange={e => onChange("injuries", e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors resize-none"
          rows={3}
          placeholder="Describe any injuries or physical limitations"
        />
      </div>
    </>
  )
}

export default DietAndHealthStep

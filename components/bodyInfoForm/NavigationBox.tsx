import { useTranslations } from "next-intl"
import { ChevronLeft, ChevronRight, Loader2, Check } from "lucide-react"
import { steps } from "@/data/statics/body-info-form"

interface NavigationBoxProps {
  currentStep: number
  isSubmitting: boolean
  handleBack: () => void
  handleNext: () => void
  handleSubmit: () => Promise<void>
}

const NavigationBox: React.FC<NavigationBoxProps> = ({
  currentStep,
  isSubmitting,
  handleNext,
  handleBack,
  handleSubmit,
}) => {
  const t = useTranslations("UserForm")
  return (
    <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
      <button
        type="button"
        onClick={handleBack}
        disabled={currentStep === 0}
        className={`flex items-center px-8 py-4 rounded-full font-medium transition-all ${
          currentStep === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-white/10"
        }`}
        style={{ color: "oklch(0.9465 0.013 17.39)" }}
      >
        <ChevronLeft className="w-5 h-5 mr-2" />
        {t("form.backButton") || "Back"}
      </button>

      {currentStep < steps.length - 1 ? (
        <button
          type="button"
          onClick={handleNext}
          className="flex items-center px-8 py-4 rounded-full font-semibold bg-linear-to-r from-rose-500 to-pink-500 text-white transition-all hover:scale-105"
        >
          {t("form.nextButton") || "Next"}
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center px-8 py-4 rounded-full font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "oklch(0.6787 0.1707 3.82)" }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {t("form.submitting") || "Submitting..."}
            </>
          ) : (
            <>
              {t("form.completeAssessment") || "Complete Assessment"}
              <Check className="w-5 h-5 ml-2" />
            </>
          )}
        </button>
      )}
    </div>
  )
}

export default NavigationBox

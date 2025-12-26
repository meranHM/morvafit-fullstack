import { Check } from "lucide-react"
import { useTranslations } from "next-intl"

const SuccessFormState = () => {
  const t = useTranslations("UserForm")

  return (
    <section className="py-24 px-4" style={{ background: "oklch(0.2389 0.0076 211.07)" }}>
      <div className="w-full max-w-2xl mx-auto text-center">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center animate-pulse bg-linear-to-r from-rose-500 to-pink-500">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4" style={{ color: "oklch(0.9465 0.013 17.39)" }}>
            {t("successState.title") || "Assessment Complete!"}
          </h2>
          <p className="text-xl opacity-80" style={{ color: "oklch(0.9465 0.013 17.39)" }}>
            {t("successState.description") || "Your personalized fitness plan is being prepared..."}
          </p>
        </div>
      </div>
    </section>
  )
}

export default SuccessFormState

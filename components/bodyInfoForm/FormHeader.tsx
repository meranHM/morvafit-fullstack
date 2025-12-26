import { useTranslations } from "next-intl"

const FormHeader = () => {
  const t = useTranslations("UserForm")

  return (
    <div className="text-center my-12">
      <h2 className="text-4xl md:text-5xl font-bold mb-4 text-background">
        {t("title") || "Your Fitness Assessment"}
      </h2>
      <p className="text-lg opacity-80 text-background">
        {t("description") || "Help us create your personalized training plan"}
      </p>
    </div>
  )
}

export default FormHeader

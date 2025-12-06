import LightRays from "@/components/LightRays"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

const HeroSection = () => {
  const t = useTranslations("Hero")
  return (
    <div style={{ width: "100%", height: "600px", position: "relative" }}>
      <LightRays
        raysOrigin="left"
        //raysColor="#3a8ef6"
        //raysColor="#b6ff3f"
        //raysColor="#ff7a31"
        //raysColor="#ffb5c8"
        //raysColor="#c3b8ff"
        //raysColor="#e7f2ff"
        //raysColor="#ffffff"
        //raysColor="#d6d6d6"
        //raysColor="f7d387"
        //raysColor="#F199B4"
        raysColor="#89023E"
        raysSpeed={1.5}
        lightSpread={0.8}
        rayLength={1.2}
        followMouse={true}
        mouseInfluence={0.1}
        noiseAmount={0.03}
        distortion={0.05}
        className="custom-rays bg-[#FDE0E1]"
      />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center w-full max-w-7xl mx-auto">
        <div className="flex-1" />
        <h1 className="flex-1 justify-self-center text-5xl font-medium">
          {t("title") || "Strength. Balance. Confidence."}
        </h1>
        <div className="w-full flex items-center justify-between p-4">
          <p className="max-w-sm text-pretty font-medium">
            {t("description") ||
              "Move with confidence and train with intention. Morvarid guides you through empowering workouts designed to build strength, mobility, and a beautifully balanced body. Your transformation starts here."}
          </p>
          <button
            onClick={() => {
              document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })
            }}
            className="bg-accent text-accent-foreground px-8 py-4 rounded-full hover:bg-accent-hover"
          >
            {t("CTA") || "Get in Touch"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default HeroSection

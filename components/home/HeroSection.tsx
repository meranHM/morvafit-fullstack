import LightRays from "@/components/LightRays"
import { useTranslations } from "next-intl"

const ShinyText = ({ text }: { text: string }) => (
  <span className="bg-linear-to-r from-white via-gray-100 to-white bg-size-[200%_auto] animate-shimmer bg-clip-text text-transparent">
    {text}
  </span>
)

const HeroSection = () => {
  const t = useTranslations("HeroSection")
  const handleCTAClick = () => {
    const element = document.getElementById("contact-form")
    element?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <section
      className="relative w-full min-h-[500px] h-[clamp(500px,80vh,800px)] overflow-hidden"
      aria-label="Hero section"
    >
      {/* WebGL Background */}
      <div className="absolute inset-0 w-full h-full">
        <LightRays
          raysOrigin="left"
          raysColor="#ec003f"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.03}
          distortion={0.05}
          className="bg-[#1b2021]"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full h-full">
        <div className="container mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between h-full py-8 md:py-12 lg:py-16">
            {/* Spacer for vertical centering */}
            <div className="flex-1" />

            {/* Hero Title */}
            <div className="shrink-0 text-center mb-48">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-tight">
                <ShinyText text={t("title")} />
              </h1>
            </div>

            {/* Bottom Content: Description + CTA */}
            <div className="shrink-0 w-full flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
              {/* Description */}
              <div className="w-full md:max-w-md lg:max-w-lg text-center md:text-left">
                <p className="text-base sm:text-lg text-white/90 font-medium leading-relaxed">
                  {t("description") ||
                    "Move with confidence and train with intention. Morvarid guides you through empowering workouts designed to build strength, mobility, and a beautifully balanced body. Your transformation starts here."}
                </p>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleCTAClick}
                className="shrink-0 bg-linear-to-r from-rose-500 to-pink-500 text-white font-semibold shadow-lg shadow-rose-500/25 rounded-full py-3 px-8 sm:py-4 sm:px-10 hover:scale-105 hover:shadow-xl hover:shadow-rose-500/30 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 focus:ring-offset-[#1b2021]"
                aria-label="Scroll to contact form"
              >
                {t("CTA")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Adding shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% center;
          }
          100% {
            background-position: -200% center;
          }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </section>
  )
}

export default HeroSection

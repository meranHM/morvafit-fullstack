import { useEffect, useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import MiniTitle from "../ui/MiniTitle"
import MagicBento from "../MagicBento"
import { useTranslations } from "next-intl"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const ServicesSection = () => {
  const t = useTranslations("ServicesSection")
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!sectionRef.current) return

      const timer = setTimeout(() => {
        ScrollTrigger.refresh()

        // Animate to pink background when entering section
        gsap.to("main", {
          backgroundColor: "#ffd4e1",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "20% 20%",
            scrub: 1,
            pinSpacing: true,
            // markers: true,
            invalidateOnRefresh: true,
          },
          ease: "none",
        })

        // Animate back to original background when leaving section
        gsap.to("main", {
          backgroundColor: "#f6eaea",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "85% 20%",
            end: "90% 20%",
            scrub: 1,
            invalidateOnRefresh: true,
            // markers: true,
          },
          ease: "none",
        })
      }, 100)

      return () => clearTimeout(timer)
    },
    { scope: sectionRef }
  )

  return (
    <div ref={sectionRef} className="container mx-auto">
      <div className="w-full max-w-7xl mx-auto rounded-xl overflow-x-clip">
        <div className="flex flex-col items-center justify-center gap-4">
          <MiniTitle text={t("miniTitle") || "Plans"} />
          <h2 className="text-4xl font-medium text-pretty max-w-lg">
            {t("title") || "Use the most modern approaches and techniques"}
          </h2>
        </div>
        <div className="w-full flex items-center mx-auto justify-center">
          <MagicBento
            textAutoHide={true}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={false}
            enableMagnetism={false}
            clickEffect={true}
            spotlightRadius={300}
            particleCount={12}
            glowColor="137, 2, 62"
          />
        </div>
      </div>
    </div>
  )
}
export default ServicesSection

import { useEffect, useRef } from "react"
import MiniTitle from "../ui/MiniTitle"
import Image from "next/image"
import { ChevronRight, Dumbbell, Activity, Trophy } from "lucide-react"
import Divider from "../ui/Divider"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useTranslations } from "next-intl"

gsap.registerPlugin(ScrollTrigger)

interface MottoSectionProps {
  className?: string
}

const MottoSection: React.FC<MottoSectionProps> = ({ className }) => {
  const t = useTranslations("MottoSection")
  const leftContainerRef = useRef<HTMLDivElement>(null)
  const rightContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!leftContainerRef.current || !rightContainerRef.current) return

    const lefContainer = leftContainerRef.current
    const rightContainer = rightContainerRef.current
    const headerOffset = 20
    const mm = gsap.matchMedia()

    mm.add(
      {
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)",
      },
      context => {
        const { isDesktop } = context.conditions as { isDesktop: boolean; isMobile: boolean }

        if (isDesktop) {
          const pinTrigger = ScrollTrigger.create({
            trigger: rightContainer,
            start: `top top+=${headerOffset}`,
            end: "37% 5%",
            pin: lefContainer,
            pinSpacing: false,
            scrub: true,
            anticipatePin: 1,
            onLeave: () => {
              gsap.to(lefContainer, {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: "power2.out",
              })
            },
            onEnterBack: () => {
              gsap.to(lefContainer, {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                ease: "power2.out",
              })
            },
          })

          return () => {
            pinTrigger.kill()
          }
        }
      }
    )

    return () => mm.revert()
  }, [])

  return (
    <div className={`container mx-auto ${className}`}>
      <div className="w-full max-w-7xl mx-auto flex flex-col px-4 py-4 md:items-center">
        {/* Gallery*/}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
          {/* Picture and Text Below it */}
          <div
            ref={leftContainerRef}
            className="flex flex-col items-center justify-start col-span-12 md:col-span-4 gap-4"
          >
            <div className="w-full max-w-[450px] h-auto rounded-xl overflow-hidden relative">
              <Image
                src="/service-image-7.png"
                alt="Coach's image doing a pose"
                width={450}
                height={550}
                className="object-contain w-full h-auto"
                loading="lazy"
              />
            </div>
            <p className="text-pretty text-center md:text-start text-sm md:text-base px-2 md:px-0">
              {t("brief") ||
                "Morvafit was built from years of hands-on coaching, movement training, and a passion for empowering women. From Pilates foundations to strength and mobility work, every program is designed to help you move better, feel stronger, and build lasting confidence."}
            </p>
          </div>

          {/* Scrollable div */}
          <div
            ref={rightContainerRef}
            className="col-span-12 md:col-span-8 flex flex-col items-stretch gap-6"
          >
            {/* Titles */}
            <div className="w-full max-w-md">
              <MiniTitle text={t("miniTitle") || "The Morvafit Method"} className="self-start" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium py-4 md:py-6">
                {t("reImaginedmethod") || "Strength, Balance, Confidence — Reimagined for Women."}
              </h2>
              <p className="py-2 text-sm md:text-base lg:hidden">
                {t("personalizedWorkouts") ||
                  "Personalized workouts blending Pilates, strength training, and mobility—crafted to elevate your energy, posture, and confidence."}
              </p>
            </div>

            {/* Video */}
            <div className="w-full h-auto aspect-904/678 rounded-xl overflow-hidden relative">
              <div className="relative w-full h-full [&>video]:w-full [&>video]:h-full [&>video]:object-cover [&>video]:object-center">
                <video
                  className="object-cover w-full h-full"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  aria-hidden="true"
                >
                  <source src="/gym-video.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="absolute top-0 left-0 w-full h-full bg-black/2" />
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 md:bottom-8 md:right-8 min-h-[45px] sm:min-h-[49px] md:min-h-[66px] leading-none flex flex-col items-start justify-center gap-y-1 sm:gap-y-1.5 p-[6px_48px_6px_10px] sm:p-[8px_58px_8px_14px] md:p-[16px_96px_16px_16px] bg-[#313131]/80 md:hover:bg-[#444]/80 backdrop-blur-[7px] rounded-lg text-white transition-colors duration-300 group/mini-product cursor-pointer">
                <a
                  href=""
                  className="flex flex-row items-center gap-x-1 sm:gap-x-1.5 box-link text-sm sm:text-base"
                >
                  <span>morvafit</span>
                  <span className="flex flex-row items-center justify-center w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-lg bg-yellow text-black">
                    <ChevronRight size={14} className="sm:w-4 sm:h-4" />
                  </span>
                </a>
                <span className="font-light text-[10px] sm:text-xs md:caption text-[#bfbfbf] leading-none">
                  {t("dreamBody") || "Achieve the dream body"}
                </span>

                <div className="absolute top-2 sm:top-2.5 md:top-0 bottom-2 right-0 w-12 sm:w-14 md:w-24 px-2 sm:px-2.25 md:px-3.5 overflow-hidden">
                  <Image
                    src="/gym-tool.webp"
                    alt="Gym hand tool"
                    className="w-auto h-full scale-[150%] md:group-hover/mini-product:scale-[160%] translate-y-[10%] origin-center object-contain object-center transition-transform duration-300 z-50"
                    width={96}
                    height={96}
                  />
                </div>
              </div>
            </div>

            {/* Below the video content */}
            <h3 className="max-md:order-first text-lg sm:text-xl md:text-2xl lg:text-3xl w-full max-w-2xl max-md:mb-6 md:mb-8 leading-snug">
              {t("personalizedWorkouts") ||
                "Personalized workouts blending Pilates, strength training, and mobility—crafted to elevate your energy, posture, and confidence."}
            </h3>

            <Divider />

            <div className="w-full">
              <div className="flex flex-col gap-8 md:gap-6 md:flex-row" aria-live="polite">
                <div
                  className="flex flex-col items-start gap-y-4 md:gap-y-6"
                  role="group"
                  aria-label="1 / 3"
                >
                  <div className="shrink-0 w-6 h-6 md:w-8 md:h-8 md:mt-2">
                    <Dumbbell className="w-full h-full" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="font-bold text-base md:text-lg">
                      {t("movementFocused") || "Mindful Movement"}
                    </p>
                    <div className="flex-1">
                      <p className="text-sm md:text-base md:pr-8 lg:pr-16">
                        {t("movementFocusedDesc") ||
                          "Every exercise is intentional—designed to improve alignment, enhance mobility, and activate deep strength for long-term results."}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="flex flex-col items-start gap-y-4 md:gap-y-6"
                  role="group"
                  aria-label="2 / 3"
                >
                  <div className="shrink-0 w-6 h-6 md:w-8 md:h-8 md:mt-2">
                    <Activity className="w-full h-full" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="font-bold text-base md:text-lg">
                      {t("forEveryLevel") || "For Every Level"}
                    </p>
                    <div className="flex-1">
                      <p className="text-sm md:text-base md:pr-8 lg:pr-16">
                        {t("forEveryLevelDesc") ||
                          "Whether you're new to Pilates or experienced in fitness, each program adapts to your body, pace, and goals—no intimidation, only progress."}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="flex flex-col items-start gap-y-4 md:gap-y-6"
                  role="group"
                  aria-label="3 / 3"
                >
                  <div className="shrink-0 w-6 h-6 md:w-8 md:h-8 md:mt-2">
                    <Trophy className="w-full h-full" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="font-bold text-base md:text-lg">
                      {t("provenMethodology") || "Proven Methodology"}
                    </p>
                    <div className="flex-1">
                      <p className="text-sm md:text-base md:pr-8 lg:pr-16">
                        {t("provenMethodologyDesc") ||
                          "Pilates principles, strength training, dance-inspired conditioning, and mobility work come together for a balanced, sustainable transformation."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MottoSection

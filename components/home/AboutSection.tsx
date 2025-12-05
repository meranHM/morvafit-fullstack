import { useEffect, useRef } from "react"
import MiniTitle from "../ui/MiniTitle"
import ScrollReveal from "../ScrollReveal"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const AboutSection = () => {
  const videoWrapperRef = useRef<HTMLDivElement>(null)
  const textWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!videoWrapperRef.current || !textWrapperRef.current) return

    const videoEl = videoWrapperRef.current
    const columnEl = videoEl.parentElement
    const textEl = textWrapperRef.current
    const headerOffset = 120

    ScrollTrigger.create({
      trigger: textEl,
      start: `top top+=${headerOffset}`,
      end: "60% center",
      pin: columnEl,
      pinSpacing: true,
      scrub: true,
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <div className="container mx-auto w-full max-w-7xl flex p-4 pt-60">
      <div className="grid grid-cols-12 gap-4">
        {/* Text */}
        <div ref={textWrapperRef} className="col-span-8 flex flex-col p-6 items-start">
          <MiniTitle text="About me" />
          <ScrollReveal baseOpacity={1} enableBlur={true} baseRotation={1} blurStrength={3}>
            I'm Morvarid Haji, a Fitness & Pilates expert, certified health coach, and dancer. With
            years of experience, I offer personalized, dynamic training programs to help you achieve
            your fitness goals. I started as a gym instructor and TRX trainer, later transitioning
            into professional dance, which inspired me to explore Pilates. This practice deepened my
            understanding of strength, flexibility, and balance. In 2015, I opened Perla Fit Studio
            in Tehran, where I trained clients in group and private sessions. During the pandemic, I
            shifted to online training, creating tailored programs to suit individual needs. I also
            developed Modelfit, a unique workout plan for women, blending Pilates, strength, cardio,
            and mobility to build confidence and fitness. Join me, and let's create your best self
            together!
          </ScrollReveal>
        </div>

        {/* Video */}
        <div className="col-span-4 relative">
          <div
            ref={videoWrapperRef}
            className="w-full h-auto aspect-3/5 rounded-xl overflow-hidden relative"
          >
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
                <source src="/morvafit-aboutme.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-black/20" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutSection

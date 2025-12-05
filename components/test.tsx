import React, { useEffect, useRef, useMemo, ReactNode, RefObject } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealProps {
  children: ReactNode
  scrollContainerRef?: RefObject<HTMLElement>
  enableBlur?: boolean
  baseOpacity?: number
  baseRotation?: number
  blurStrength?: number
  containerClassName?: string
  textClassName?: string
  rotationEnd?: string
  wordAnimationEnd?: string
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = "",
  textClassName = "",
  rotationEnd = "bottom bottom",
  wordAnimationEnd = "bottom bottom",
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null)

  const splitText = useMemo(() => {
    const text = typeof children === "string" ? children : ""
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word
      return (
        <span className="inline-block word" key={index}>
          {word}
        </span>
      )
    })
  }, [children])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const scroller =
      scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window

    gsap.fromTo(
      el,
      { transformOrigin: "0% 50%", rotate: baseRotation },
      {
        ease: "none",
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: "top bottom",
          end: rotationEnd,
          scrub: true,
        },
      }
    )

    const wordElements = el.querySelectorAll<HTMLElement>(".word")

    gsap.fromTo(
      wordElements,
      { opacity: baseOpacity, willChange: "opacity" },
      {
        ease: "none",
        opacity: 1,
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: "top bottom-=20%",
          end: wordAnimationEnd,
          scrub: true,
        },
      }
    )

    if (enableBlur) {
      gsap.fromTo(
        wordElements,
        { filter: `blur(${blurStrength}px)` },
        {
          ease: "none",
          filter: "blur(0px)",
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: "top bottom-=20%",
            end: wordAnimationEnd,
            scrub: true,
          },
        }
      )
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [
    scrollContainerRef,
    enableBlur,
    baseRotation,
    baseOpacity,
    rotationEnd,
    wordAnimationEnd,
    blurStrength,
  ])

  return (
    <h2 ref={containerRef} className={`my-5 ${containerClassName}`}>
      <p
        className={`text-[clamp(1.2rem,1vw,1.6rem)] leading-normal font-semibold ${textClassName}`}
      >
        {splitText}
      </p>
    </h2>
  )
}

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const videoEl = videoContainerRef.current
    const sectionEl = sectionRef.current

    if (!videoEl || !sectionEl) return

    gsap.registerPlugin(ScrollTrigger)

    ScrollTrigger.create({
      trigger: sectionEl,
      start: "top center",
      end: "bottom 20%",
      scrub: true,
      onUpdate: self => {
        if (self.isActive && self.progress < 0.8) {
          gsap.set(videoEl, {
            position: "fixed",
            top: "50%",
            left: "50%",
            width: "33.333%",
            transform: "translate(-50%, -50%)",
            zIndex: 40,
          })
        } else {
          gsap.set(videoEl, {
            position: "relative",
            top: "auto",
            left: "auto",
            width: "100%",
            transform: "none",
            zIndex: "auto",
          })
        }
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div ref={sectionRef} className="w-full bg-white py-20">
      <div className="container mx-auto w-full max-w-7xl flex p-4">
        <div className="grid grid-cols-12 gap-8">
          {/* Text Content */}
          <div className="col-span-8 flex flex-col p-6 items-start">
            <div className="mb-4">
              <span className="text-sm font-semibold text-gray-600 tracking-widest uppercase">
                About me
              </span>
            </div>
            <ScrollReveal baseOpacity={1} enableBlur={true} baseRotation={1} blurStrength={3}>
              I'm Morvarid Haji, a Fitness & Pilates expert, certified health coach, and dancer.
              With years of experience, I offer personalized, dynamic training programs to help you
              achieve your fitness goals. I started as a gym instructor and TRX trainer, later
              transitioning into professional dance, which inspired me to explore Pilates. This
              practice deepened my understanding of strength, flexibility, and balance. In 2015, I
              opened Perla Fit Studio in Tehran, where I trained clients in group and private
              sessions. During the pandemic, I shifted to online training, creating tailored
              programs to suit individual needs. I also developed Modelfit, a unique workout plan
              for women, blending Pilates, strength, cardio, and mobility to build confidence and
              fitness. Join me, and let's create your best self together!
            </ScrollReveal>
          </div>

          {/* Video */}
          <div
            ref={videoContainerRef}
            className="col-span-4 w-full h-[600px] rounded-xl overflow-hidden relative"
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
            <div className="absolute top-0 left-0 w-full h-full bg-black/20 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutSection

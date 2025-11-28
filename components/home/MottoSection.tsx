import MiniTitle from "../ui/MiniTitle"
import Image from "next/image"
import { ChevronRight, Dumbbell, Activity, Trophy } from "lucide-react"
import Divider from "../ui/Divider"

const MottoSection = () => {
  return (
    <div className="container mx-auto">
      <div className="w-full max-w-7xl mx-auto flex flex-col p-4 md:items-center">
        {/* Titles */}
        <div className="w-full max-w-md ">
          <MiniTitle text="The Blanca difference" className="self-start" />
          <h2 className="text-4xl font-medium py-6">Game. Set. Unmatched. Meet Blanca Padel.</h2>
          <p className="py-2 lg:hidden">
            Minimal design, top performance for all levels, and options to test drive before buying.
          </p>
        </div>

        {/* Gallery*/}
        <div className="grid grid-cols-12 gap-4">
          {/* Picture and Text Below it */}
          <div className="flex flex-col col-span-4">
            <div className="w-full h-auto aspect-448/337 rounded-xl overflow-hidden mb-10 relative">
              <Image
                src="/image-1.png"
                alt="Coach's image doing a pose"
                width={382}
                height={507}
                className="object-contain size-full"
                loading="lazy"
              />
            </div>
            <p className="text-pretty">
              Blanca Padel was born in 2022, in sunny ☀️🌴 San Diego, California. Built for a
              community of crazy padel friends (the best kind) who demanded high-performance padel
              gear that would fit their modern style and didn't break the bank.
            </p>
          </div>

          {/* Scrollable div */}
          <div className="col-span-8 flex flex-col items-stretch">
            {/* Video */}
            <div className="w-full h-auto aspect-904/678 rounded-xl overflow-hidden mb-10 relative">
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
              <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 min-h-[49px] md:min-h-[66px] leading-none flex flex-col items-start justify-center gap-y-1.5 p-[8px_58px_8px_14px] md:p-[16px_96px_16px_16px] bg-[#313131]/80 md:hover:bg-[#444]/80 backdrop-blur-[7px] rounded-lg text-white transition-colors duration-300 group/mini-product cursor-pointer">
                <a href="" className="flex flex-row items-center gap-x-1.5 box-link">
                  <span>morvafit</span>
                  <span className="flex flex-row items-center justify-center w-3.5 h-3.5 rounded-lg bg-yellow text-black">
                    <ChevronRight size={16} />
                  </span>
                </a>
                <span className="font-light text-xs md:caption text-[#bfbfbf] leading-none!">
                  Achieve the dream body
                </span>

                <div className="absolute top-2.5 md:top-0 bottom-2 right-0 w-14 md:w-24 px-2.25 md:px-3.5 overflow-hidden">
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
            <h3 className="max-md:order-first body md:h3  w-full max-w-2xl max-md:mb-10 text-3xl">
              Minimal design, top performance for all levels, and options to test drive before
              buying.
            </h3>

            <Divider />

            <div className=" max-md:overflow-hidden max-md:-mx-4 max-md:w-auto max-md:px-4">
              <div className="flex!" aria-live="polite">
                <div
                  className="flex! flex-col items-start gap-y-6 md:gap-y-8"
                  role="group"
                  aria-label="1 / 3"
                >
                  <div className="shrink-0 w-6 md:w-8 h-6 md:h-8 md:mt-2">
                    <Dumbbell size={32} />
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="font-bold text-lg">Minimal</p>
                    <div className="flex-1 flex flex-row items-stretch gap-x-6">
                      <div className="md:pr-16">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa eum officia
                        voluptatibus iusto quia quibusdam adipisci pariatur.
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="flex! flex-col items-start gap-y-6 md:gap-y-8"
                  role="group"
                  aria-label="2 / 3"
                >
                  <div className="shrink-0 w-6 md:w-8 h-6 md:h-8 md:mt-2">
                    <Activity size={32} />
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="font-bold text-lg">All Levels</p>
                    <div className="flex-1 flex flex-row items-stretch gap-x-6">
                      <div className="md:pr-16">
                        All our products are suitable for all levels and playstyles, from beginners
                        to advanced players.
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="flex! flex-col items-start gap-y-6 md:gap-y-8"
                  role="group"
                  aria-label="3 / 3"
                >
                  <div className="shrink-0 w-6 md:w-8 h-6 md:h-8 md:mt-2">
                    <Trophy size={32} />
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="font-medium">Quality</p>
                    <div className="flex-1 flex flex-row items-stretch gap-x-6">
                      <div className="md:pr-16">
                        Our suite of racquets feature the same modern quality materials used in
                        professional grade paddles e.g. 3k-&gt;18k carbon, multi-eva foam and a
                        reinforced carbon fiber tube frame.
                      </div>
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

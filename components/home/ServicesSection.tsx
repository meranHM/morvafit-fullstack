import MiniTitle from "../ui/MiniTitle"
import MagicBento from "../MagicBento"

const ServicesSection = () => {
  return (
    <div className="container mx-auto">
      <div className="w-full max-w-7xl mx-auto bg-[#D9D9D9]/12 backdrop-blur-[7px] pt-10 md:pt-16 rounded-xl overflow-x-clip">
        <div className="flex flex-col items-center justify-center gap-4">
          <MiniTitle text="Plans" />
          <h2 className="text-4xl font-medium text-pretty max-w-lg">
            Use the most modern approaches and techniques
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
            glowColor="132, 0, 255"
          />
        </div>
      </div>
    </div>
  )
}

export default ServicesSection

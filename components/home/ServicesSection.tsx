"use client"

import MiniTitle from "../ui/MiniTitle"
import MagicBento from "../MagicBento"
import { useTranslations } from "next-intl"
import { useServiceModal } from "./ServiceModal"

interface ServicesSectionProps {
  className?: string
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ className }) => {
  const t = useTranslations("ServicesSection")
  const { openModal, ServiceModal } = useServiceModal()

  return (
    <>
      <div className={`container mx-auto ${className}`}>
        <div className="w-full max-w-7xl mx-auto rounded-xl overflow-x-clip">
          <div className="flex flex-col items-center justify-center gap-4">
            <MiniTitle text={t("miniTitle") || "Plans"} />
            <h2 className="text-4xl font-medium text-pretty max-w-lg text-center md:text-start px-2">
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
              onCardClick={openModal}
            />
          </div>
        </div>
      </div>

      {/* Rendering the modal */}
      <ServiceModal />
    </>
  )
}

export default ServicesSection

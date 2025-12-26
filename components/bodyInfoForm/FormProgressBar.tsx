import { LucideIcon, Check } from "lucide-react"
import { FormData } from "@/types/forms"

interface Step {
  id: number
  title: string
  icon: LucideIcon
  fields: (keyof FormData)[]
}

interface FormProgressBarProps {
  steps: Step[]
  currentStep: number
}

const FormProgressBar: React.FC<FormProgressBarProps> = ({ steps, currentStep }) => {
  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted ? "scale-110" : isCurrent ? "scale-125" : "scale-100"
                  }`}
                  style={{
                    background:
                      isCompleted || isCurrent
                        ? "oklch(0.6787 0.1707 3.82)"
                        : "oklch(0.3257 0.0203 269.5)",
                    border: isCurrent ? "3px solid oklch(0.4063 0.162 4.7)" : "none",
                  }}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : (
                    <Icon className="w-6 h-6 text-white " />
                  )}
                </div>
                <span
                  className={` text-background text-xs mt-2 text-center hidden md:block transition-opacity ${
                    isCurrent ? "opacity-100 font-semibold" : "opacity-60"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className="h-1 flex-1 mx-2 transition-all duration-500"
                  style={{
                    background:
                      index < currentStep
                        ? "oklch(0.6787 0.1707 3.82)"
                        : "oklch(0.3257 0.0203 269.5)",
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FormProgressBar

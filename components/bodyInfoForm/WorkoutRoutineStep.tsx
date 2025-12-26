import { useTranslations } from "next-intl"
import type { FormData } from "@/types/forms"
import { weekDays, timeOfDay, sessionDurations } from "@/data/statics/body-info-form"

interface WorkoutRoutineStepProps {
  workoutDays: string[]
  workoutDaysError: string
  preferredTime: string
  preferredTimeError: string
  sessionDuration: string
  sessionDurationError: string
  toggleWorkoutDay: (day: string) => void
  onChange: (field: keyof FormData, value: string | string[]) => void
}

const WorkoutRoutineStep: React.FC<WorkoutRoutineStepProps> = ({
  workoutDays,
  workoutDaysError,
  preferredTime,
  preferredTimeError,
  sessionDuration,
  sessionDurationError,
  toggleWorkoutDay,
  onChange,
}) => {
  const t = useTranslations("UserForm")

  return (
    <>
      <div>
        <label
          className="block text-sm font-medium mb-3"
          style={{ color: "oklch(0.9465 0.013 17.39)" }}
        >
          {t("form.preferredWorkoutDaysTitle") || "Preferred Workout Days"} *
        </label>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map(day => (
            <button
              key={day}
              type="button"
              onClick={() => toggleWorkoutDay(day)}
              className={`px-8 py-4 rounded-full border transition-all ${
                workoutDays.includes(day)
                  ? "border-transparent"
                  : "border-white/20 bg-white/5 hover:bg-white/10"
              }`}
              style={workoutDays.includes(day) ? { background: "oklch(0.6787 0.1707 3.82)" } : {}}
            >
              <span
                className="text-sm font-semibold"
                style={{ color: "oklch(0.9465 0.013 17.39)" }}
              >
                {day}
              </span>
            </button>
          ))}
        </div>
        {workoutDaysError && <p className="text-red-400 text-sm mt-1">{workoutDaysError}</p>}
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "oklch(0.9465 0.013 17.39)" }}
        >
          {t("form.preferredWorkoutTimeTitle") || "Preferred Workout Time"} *
        </label>
        <div className="grid grid-cols-3 gap-3">
          {timeOfDay.map(time => (
            <button
              key={time}
              type="button"
              onClick={() => onChange("preferredTime", time)}
              className={`px-8 py-4 rounded-full border transition-all text-sm ${
                preferredTime === time
                  ? "border-transparent"
                  : "border-white/20 bg-white/5 hover:bg-white/10"
              }`}
              style={preferredTime === time ? { background: "oklch(0.6787 0.1707 3.82)" } : {}}
            >
              <span style={{ color: "oklch(0.9465 0.013 17.39)" }}>{time}</span>
            </button>
          ))}
        </div>
        {preferredTimeError && <p className="text-red-400 text-sm mt-1">{preferredTimeError}</p>}
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "oklch(0.9465 0.013 17.39)" }}
        >
          {t("form.sessionDurationTitle") || "Session Duration"} *
        </label>
        <div className="grid grid-cols-4 gap-3">
          {sessionDurations.map(duration => (
            <button
              key={duration}
              type="button"
              onClick={() => onChange("sessionDuration", duration)}
              className={`px-8 py-4 rounded-full border transition-all ${
                sessionDuration === duration
                  ? "border-transparent"
                  : "border-white/20 bg-white/5 hover:bg-white/10"
              }`}
              style={
                sessionDuration === duration ? { background: "oklch(0.6787 0.1707 3.82)" } : {}
              }
            >
              <span style={{ color: "oklch(0.9465 0.013 17.39)" }}>{duration}</span>
            </button>
          ))}
        </div>
        {sessionDurationError && (
          <p className="text-red-400 text-sm mt-1">{sessionDurationError}</p>
        )}
      </div>
    </>
  )
}

export default WorkoutRoutineStep

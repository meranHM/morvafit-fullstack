import { FormData, Step } from "@/types/forms"
import { User, Activity, Target, Calendar, Utensils, Heart } from "lucide-react"

export const steps: Step[] = [
  {
    id: 0,
    title: "Personal Info",
    icon: User,
    fields: ["fullName", "age", "gender", "email", "phone"],
  },
  {
    id: 1,
    title: "Body Metrics",
    icon: Activity,
    fields: ["height", "weight", "targetWeight"],
  },
  {
    id: 2,
    title: "Fitness Goals",
    icon: Target,
    fields: ["primaryGoal", "activityLevel", "experienceLevel"],
  },
  {
    id: 3,
    title: "Schedule",
    icon: Calendar,
    fields: ["workoutDays", "preferredTime", "sessionDuration"],
  },
  {
    id: 4,
    title: "Diet & Health",
    icon: Utensils,
    fields: ["dietaryPreference", "allergies", "medicalConditions", "injuries"],
  },
  {
    id: 5,
    title: "Final Details",
    icon: Heart,
    fields: ["motivation", "challenges"],
  },
]

export const fitnessGoals = [
  "Weight Loss",
  "Muscle Gain",
  "Endurance",
  "General Fitness",
  "Athletic Performance",
  "Flexibility",
]

export const activityLevels = [
  { value: "sedentary", label: "Sedentary", desc: "Little to no exercise" },
  { value: "light", label: "Lightly Active", desc: "1-3 days/week" },
  { value: "moderate", label: "Moderately Active", desc: "3-5 days/week" },
  { value: "very", label: "Very Active", desc: "6-7 days/week" },
  { value: "extra", label: "Extra Active", desc: "Professional athlete" },
]

export const experienceLevels = ["Beginner", "Intermediate", "Advanced"]

export const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export const timeOfDay = ["Morning (6-11am)", "Afternoon (12-5pm)", "Evening (6-10pm)"]

export const sessionDurations = ["30 min", "45 min", "60 min", "90 min"]

export const diets = ["No Restrictions", "Vegetarian", "Vegan", "Keto", "Paleo", "Mediterranean"]

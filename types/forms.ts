import { LucideIcon } from "lucide-react"

export interface FormData {
  fullName: string
  age: string
  gender: string
  email: string
  phone: string
  height: string
  weight: string
  targetWeight: string
  primaryGoal: string
  activityLevel: string
  experienceLevel: string
  workoutDays: string[]
  preferredTime: string
  sessionDuration: string
  dietaryPreference: string
  allergies: string
  medicalConditions: string
  injuries: string
  motivation: string
  challenges: string
}

export interface Step {
  id: number
  title: string
  icon: LucideIcon
  fields: (keyof FormData)[]
}

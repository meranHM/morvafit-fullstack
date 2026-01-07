"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Loader2, Check, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { steps } from "@/data/statics/body-info-form"
import { FormData } from "@/types/forms"
import PersonalInfoStep from "../bodyInfoForm/PersonalInfoStep"
import BodyMetricsStep from "../bodyInfoForm/BodyMetricsStep"
import FitnessGoalsStep from "../bodyInfoForm/FitnessGoalsStep"
import WorkoutRoutineStep from "../bodyInfoForm/WorkoutRoutineStep"
import DietAndHealthStep from "../bodyInfoForm/DietAndHealthStep"
import FinalDetailsStep from "../bodyInfoForm/FinalDetailsStep"

export interface RawBodyInfoData {
  age: number
  gender: string
  height: number
  weight: number
  targetWeight: number
  primaryGoal: string
  activityLevel: string
  experienceLevel: string
  workoutDays: string[]
  preferredTime: string
  sessionDuration: string
  dietaryPreference: string
  allergies?: string | null
  medicalConditions?: string | null
  injuries?: string | null
  motivation?: string | null
  challenges?: string | null
}

interface DashboardBodyInfoFormProps {
  initialData?: RawBodyInfoData | null
  onCancel: () => void
  userName?: string
  userEmail?: string
  userPhone?: string
}

interface BMICategory {
  text: string
  color: string
}

interface FormErrors {
  [key: string]: string
}

// HELPER FUNCTIONS
// ===================
// Converting database enum values to form-friendly values
function formatEnumForForm(value: string): string {
  return value
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

// Mapping database workout days format to form format
function mapWorkoutDaysForForm(days: string[]): string[] {
  return days.map(day => day.charAt(0).toUpperCase() + day.slice(1).toLowerCase())
}

// Mapping database preferred time to form format
function mapPreferredTimeForForm(value: string): string {
  const mapping: Record<string, string> = {
    MORNING: "Morning (6-11am)",
    AFTERNOON: "Afternoon (11am-5pm)",
    EVENING: "Evening (5-10pm)",
  }
  return mapping[value] || "Morning (6-11am)"
}

// Mapping database session duration to form format
function mapSessionDurationForForm(value: string): string {
  const mapping: Record<string, string> = {
    MIN_30: "30 min",
    MIN_45: "45 min",
    MIN_60: "60 min",
    MIN_90: "90 min",
  }
  return mapping[value] || "45 min"
}

const DashboardBodyInfoForm: React.FC<DashboardBodyInfoFormProps> = ({
  initialData,
  onCancel,
  userName = "",
  userEmail = "",
  userPhone = "",
}) => {
  const router = useRouter()
  const isEditMode = !!initialData

  const [currentStep, setCurrentStep] = useState<number>(0)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  // Initializing form data - either with existing data (edit mode) or empty (create mode)
  const [formData, setFormData] = useState<FormData>(() => {
    if (initialData) {
      return {
        fullName: userName,
        age: String(initialData.age),
        gender: initialData.gender.toLowerCase(),
        email: userEmail,
        phone: userPhone,
        height: String(initialData.height),
        weight: String(initialData.weight),
        targetWeight: String(initialData.targetWeight),
        primaryGoal: formatEnumForForm(initialData.primaryGoal),
        activityLevel: initialData.activityLevel.toLowerCase(),
        experienceLevel: formatEnumForForm(initialData.experienceLevel),
        workoutDays: mapWorkoutDaysForForm(initialData.workoutDays),
        preferredTime: mapPreferredTimeForForm(initialData.preferredTime),
        sessionDuration: mapSessionDurationForForm(initialData.sessionDuration),
        dietaryPreference: formatEnumForForm(initialData.dietaryPreference),
        allergies: initialData.allergies || "",
        medicalConditions: initialData.medicalConditions || "",
        injuries: initialData.injuries || "",
        motivation: initialData.motivation || "",
        challenges: initialData.challenges || "",
      }
    }
    // Create mode: starting with empty form (except for user info)
    return {
      fullName: userName,
      age: "",
      gender: "",
      email: userEmail,
      phone: userPhone,
      height: "",
      weight: "",
      targetWeight: "",
      primaryGoal: "",
      activityLevel: "",
      experienceLevel: "",
      workoutDays: [],
      preferredTime: "",
      sessionDuration: "",
      dietaryPreference: "",
      allergies: "",
      medicalConditions: "",
      injuries: "",
      motivation: "",
      challenges: "",
    }
  })

  const calculateBMI = (): string | null => {
    const heightM = parseFloat(formData.height) / 100
    const weightKg = parseFloat(formData.weight)
    if (heightM && weightKg) {
      return (weightKg / (heightM * heightM)).toFixed(1)
    }
    return null
  }

  const getBMICategory = (bmi: number): BMICategory => {
    if (bmi < 18.5) return { text: "Underweight", color: "text-blue-600" }
    if (bmi < 25) return { text: "Normal", color: "text-green-600" }
    if (bmi < 30) return { text: "Overweight", color: "text-yellow-600" }
    return { text: "Obese", color: "text-red-600" }
  }

  const validateStep = (stepIndex: number): boolean => {
    const stepFields = steps[stepIndex].fields
    const newErrors: FormErrors = {}

    stepFields.forEach(field => {
      if (field === "workoutDays") {
        if (formData[field].length === 0) {
          newErrors[field] = "Please select at least one day"
        }
      } else if (field === "allergies" || field === "injuries" || field === "challenges") {
        // Optional fields - no validation is needed
      } else if (!formData[field] || formData[field].toString().trim() === "") {
        newErrors[field] = "This field is required"
      }
    })

    if (stepFields.includes("email") && formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = (): void => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handleBack = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (): Promise<void> => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)

    try {
      // Preparing data for API
      const bodyInfoData = {
        age: formData.age,
        gender: formData.gender,
        height: formData.height,
        weight: formData.weight,
        targetWeight: formData.targetWeight,
        primaryGoal: formData.primaryGoal,
        activityLevel: formData.activityLevel,
        experienceLevel: formData.experienceLevel,
        workoutDays: formData.workoutDays,
        preferredTime: formData.preferredTime,
        sessionDuration: formData.sessionDuration,
        dietaryPreference: formData.dietaryPreference,
        allergies: formData.allergies,
        medicalConditions: formData.medicalConditions,
        injuries: formData.injuries,
        motivation: formData.motivation,
        challenges: formData.challenges,
      }

      // Sending data to API (The Backend API uses upsert, so it works for both create and update)
      const response = await fetch("/api/user/body-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyInfoData),
      })

      const result = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          setErrors({ submit: "Please log in to save your information" })
          setIsSubmitting(false)
          return
        }

        if (result.missingFields) {
          const newErrors: FormErrors = {}
          result.missingFields.forEach((field: string) => {
            newErrors[field] = "This field is required"
          })
          setErrors(newErrors)
          setIsSubmitting(false)
          return
        }

        setErrors({ submit: result.error || "Failed to save information" })
        setIsSubmitting(false)
        return
      }

      setIsSubmitting(false)
      setIsSuccess(true)

      setTimeout(() => {
        router.refresh()
        onCancel() // Closes the form
      }, 1500)
    } catch (error) {
      console.error("Form submission error:", error)
      setErrors({ submit: "Network error. Please try again." })
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | string[]): void => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const toggleWorkoutDay = (day: string): void => {
    setFormData(prev => ({
      ...prev,
      workoutDays: prev.workoutDays.includes(day)
        ? prev.workoutDays.filter(d => d !== day)
        : [...prev.workoutDays, day],
    }))
    if (errors.workoutDays) {
      setErrors(prev => ({ ...prev, workoutDays: "" }))
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl border border-gray-200 p-12 text-center"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {isEditMode ? "Profile Updated!" : "Profile Complete!"}
        </h3>
        <p className="text-gray-600">
          {isEditMode
            ? "Your health profile has been updated successfully."
            : "Your health profile has been saved successfully."}
        </p>
      </motion.div>
    )
  }

  const StepIcon = steps[currentStep].icon
  const bmi = calculateBMI()
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Form Header */}
      <div className="bg-linear-to-r from-rose-500 to-pink-500 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {isEditMode ? "Edit Health Profile" : "Complete Your Health Profile"}
            </h2>
            <p className="text-rose-100 mt-1">
              {isEditMode
                ? "Update your body metrics and fitness goals"
                : "Fill in your details to get personalized workouts"}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close form"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 flex items-center gap-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  index < currentStep
                    ? "bg-white text-rose-500"
                    : index === currentStep
                      ? "bg-white text-rose-500 ring-4 ring-white/30"
                      : "bg-white/30 text-white"
                }`}
              >
                {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-1 rounded-full transition-colors ${
                    index < currentStep ? "bg-white" : "bg-white/30"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 md:p-8">
        {/* Step Title */}
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mr-4">
            <StepIcon className="w-6 h-6 text-rose-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{steps[currentStep].title}</h3>
        </div>

        {/* Step Content - Using dashboard-themed wrapper from globals.css */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="dashboard-form-step min-h-[350px] flex flex-col gap-4"
          >
            {/* Step 0: Personal Info */}
            {currentStep === 0 && (
              <PersonalInfoStep
                fullName={formData.fullName}
                fullNameError={errors.fullName}
                email={formData.email}
                emailError={errors.email}
                age={formData.age}
                ageError={errors.age}
                gender={formData.gender}
                genderError={errors.gender}
                phone={formData.phone}
                phoneError={errors.phone}
                onChange={handleInputChange}
              />
            )}

            {/* Step 1: Body Metrics */}
            {currentStep === 1 && (
              <BodyMetricsStep
                height={formData.height}
                heightError={errors.height}
                weight={formData.weight}
                weightError={errors.weight}
                targetWeight={formData.targetWeight}
                targetWeightError={errors.targetWeight}
                bmi={bmi}
                bmiCategory={bmiCategory}
                onChange={handleInputChange}
              />
            )}

            {/* Step 2: Fitness Goals */}
            {currentStep === 2 && (
              <FitnessGoalsStep
                primaryGoal={formData.primaryGoal}
                primaryGoalError={errors.primaryGoal}
                activityLevel={formData.activityLevel}
                activityLevelError={errors.activityLevel}
                experienceLevel={formData.experienceLevel}
                experienceLevelError={errors.experienceLevel}
                onChange={handleInputChange}
              />
            )}

            {/* Step 3: Workout Routine */}
            {currentStep === 3 && (
              <WorkoutRoutineStep
                workoutDays={formData.workoutDays}
                workoutDaysError={errors.workoutDays}
                preferredTime={formData.preferredTime}
                preferredTimeError={errors.preferredTime}
                sessionDuration={formData.sessionDuration}
                sessionDurationError={errors.sessionDuration}
                toggleWorkoutDay={toggleWorkoutDay}
                onChange={handleInputChange}
              />
            )}

            {/* Step 4: Diet & Health */}
            {currentStep === 4 && (
              <DietAndHealthStep
                dietaryPreference={formData.dietaryPreference}
                dietaryPreferenceError={errors.dietaryPreference}
                allergies={formData.allergies}
                medicalConditions={formData.medicalConditions}
                medicalConditionsError={errors.medicalConditions}
                injuries={formData.injuries}
                onChange={handleInputChange}
              />
            )}

            {/* Step 5: Final Details */}
            {currentStep === 5 && (
              <FinalDetailsStep
                motivation={formData.motivation}
                motivationError={errors.motivation}
                challenges={formData.challenges}
                primaryGoal={formData.primaryGoal}
                experienceLevel={formData.experienceLevel}
                workoutDays={formData.workoutDays}
                sessionDuration={formData.sessionDuration}
                dietaryPreference={formData.dietaryPreference}
                onChange={handleInputChange}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Submission Error */}
        {errors.submit && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
            {errors.submit}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
              currentStep === 0
                ? "opacity-50 cursor-not-allowed text-gray-400"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center px-6 py-3 rounded-xl font-semibold bg-linear-to-r from-rose-500 to-pink-500 text-white transition-all hover:shadow-lg hover:shadow-rose-200"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center px-6 py-3 rounded-xl font-semibold bg-linear-to-r from-rose-500 to-pink-500 text-white transition-all hover:shadow-lg hover:shadow-rose-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {isEditMode ? "Update Profile" : "Complete Profile"}
                  <Check className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardBodyInfoForm

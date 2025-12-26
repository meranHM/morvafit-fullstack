"use client"

import { useState } from "react"
import FormHeader from "./FormHeader"
import FormProgressBar from "./FormProgressBar"
import { steps } from "@/data/statics/body-info-form"
import { FormData } from "@/types/forms"
import PersonalInfoStep from "./PersonalInfoStep"
import BodyMetricsStep from "./BodyMetricsStep"
import FitnessGoalsStep from "./FitnessGoalsStep"
import WorkoutRoutineStep from "./WorkoutRoutineStep"
import DietAndHealthStep from "./DietAndHealthStep"
import FinalDetailsStep from "./FinalDetailsStep"
import NavigationBox from "./NavigationBox"
import SuccessFormState from "./SuccessFormState"

interface MainFormProps {
  className?: string
}

interface BMICategory {
  text: string
  color: string
}

interface FormErrors {
  [key: string]: string
}

const MainForm: React.FC<MainFormProps> = ({ className }) => {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  const [formData, setFormData] = useState<FormData>({
    // Step 1: Personal Info
    fullName: "",
    age: "",
    gender: "",
    email: "",
    phone: "",

    // Step 2: Body Metrics
    height: "",
    weight: "",
    targetWeight: "",

    // Step 3: Fitness Goals
    primaryGoal: "",
    activityLevel: "",
    experienceLevel: "",

    // Step 4: Schedule
    workoutDays: [],
    preferredTime: "",
    sessionDuration: "",

    // Step 5: Diet & Health
    dietaryPreference: "",
    allergies: "",
    medicalConditions: "",
    injuries: "",

    // Step 6: Additional Info
    motivation: "",
    challenges: "",
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
        // Optional fields
      } else if (!formData[field] || formData[field].toString().trim() === "") {
        newErrors[field] = "This field is required"
      }
    })

    // Email validation
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
      // STEP 1: Preparing data for API
      // We send all the body info fields to our API
      // Note: fullName, email, phone are user fields (handled separately during signup)
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

      // STEP 2: Send data to API
      const response = await fetch("/api/user/body-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyInfoData),
      })

      // STEP 3: Parse response
      const result = await response.json()

      // STEP 4: Handle response
      if (!response.ok) {
        // If user is not logged in, show appropriate error
        if (response.status === 401) {
          setErrors({ submit: "Please log in to save your information" })
          setIsSubmitting(false)
          return
        }

        // If there are validation errors, show them
        if (result.missingFields) {
          const newErrors: FormErrors = {}
          result.missingFields.forEach((field: string) => {
            newErrors[field] = "This field is required"
          })
          setErrors(newErrors)
          setIsSubmitting(false)
          return
        }

        // Generic error
        setErrors({ submit: result.error || "Failed to save information" })
        setIsSubmitting(false)
        return
      }

      // STEP 5: Success!
      setIsSubmitting(false)
      setIsSuccess(true)

      // Reset form after showing success message
      setTimeout(() => {
        setIsSuccess(false)
        setCurrentStep(0)
        setFormData({
          fullName: "",
          age: "",
          gender: "",
          email: "",
          phone: "",
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
        })
      }, 3000)
    } catch (error) {
      // ERROR HANDLING: Network or unexpected errors
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

  // Success State
  if (isSuccess) return <SuccessFormState />

  const StepIcon = steps[currentStep].icon
  const bmi = calculateBMI()
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null

  return (
    <section className={`w-full mx-auto bg-background-5 pb-12 ${className}`}>
      <div className="w-full max-w-4xl mx-auto">
        <FormHeader />

        <FormProgressBar steps={steps} currentStep={currentStep} />

        {/* Form Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
          <div className="flex items-center mb-8">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mr-4 bg-background-2">
              <StepIcon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-background">{steps[currentStep].title}</h3>
          </div>

          {/* Step Content */}
          <div className="space-y-6 min-h-[400px]">
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
          </div>

          {/* Display submission errors (e.g., not logged in, network error) */}
          {errors.submit && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-center">
              {errors.submit}
            </div>
          )}

          <NavigationBox
            currentStep={currentStep}
            isSubmitting={isSubmitting}
            handleBack={handleBack}
            handleNext={handleNext}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </section>
  )
}

export default MainForm

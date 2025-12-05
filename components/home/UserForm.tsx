import React, { useState } from "react"
import {
  ChevronRight,
  ChevronLeft,
  Check,
  User,
  Activity,
  Target,
  Calendar,
  Utensils,
  Heart,
  Loader2,
} from "lucide-react"
import { type LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"

interface FormData {
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

interface FormErrors {
  [key: string]: string
}

interface Step {
  id: number
  title: string
  icon: LucideIcon
  fields: (keyof FormData)[]
}

interface BMICategory {
  text: string
  color: string
}

// Moch auth Check - Will replace with actual auth logic later
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  return { isAuthenticated, setIsAuthenticated }
}

const UserForm: React.FC = () => {
  const t = useTranslations("UserForm")
  const { isAuthenticated, setIsAuthenticated } = useAuth()
  const [currentStep, setCurrentStep] = useState<number>(0)
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

  const [errors, setErrors] = useState<FormErrors>({})

  const steps: Step[] = [
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

  // Calculating BMI
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

    // Simulating API call for now - Will Change later
    await new Promise(resolve => setTimeout(resolve, 2000))

    console.log("Form submitted:", formData)
    setIsSubmitting(false)
    setIsSuccess(true)

    // Reset after 3 seconds
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

  // Auth Gate
  if (!isAuthenticated) {
    return (
      <section
        id="contact-form"
        className="py-24 px-4"
        style={{ background: "oklch(0.2389 0.0076 211.07)" }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12">
            <div
              className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ background: "oklch(0.6787 0.1707 3.82)" }}
            >
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: "oklch(0.9465 0.013 17.39)" }}>
              {t("authGate.title") || "Start Your Fitness Journey"}
            </h2>
            <p className="text-lg mb-8 opacity-80" style={{ color: "oklch(0.9465 0.013 17.39)" }}>
              {t("authGate.description") ||
                "Please sign in or create an account to access your personalize fitness assessment form."}
            </p>
            <button
              onClick={() => setIsAuthenticated(true)}
              className="px-8 py-4 rounded-full font-semibold text-white transition-all hover:scale-105"
              style={{ background: "oklch(0.6787 0.1707 3.82)" }}
            >
              {t("authGate.CTA") || "Sign In / Sign Up"}
            </button>
          </div>
        </div>
      </section>
    )
  }

  // Success State
  if (isSuccess) {
    return (
      <section className="py-24 px-4" style={{ background: "oklch(0.2389 0.0076 211.07)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12">
            <div
              className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center animate-pulse"
              style={{ background: "oklch(0.6787 0.1707 3.82)" }}
            >
              <Check className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4" style={{ color: "oklch(0.9465 0.013 17.39)" }}>
              {t("successState.title") || "Assessment Complete!"}
            </h2>
            <p className="text-xl opacity-80" style={{ color: "oklch(0.9465 0.013 17.39)" }}>
              {t("successState.description") ||
                "Your personalized fitness plan is being prepared..."}
            </p>
          </div>
        </div>
      </section>
    )
  }

  const StepIcon = steps[currentStep].icon
  const bmi = calculateBMI()
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null

  return (
    <section className="py-24 px-4" style={{ background: "oklch(0.2389 0.0076 211.07)" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "oklch(0.9465 0.013 17.39)" }}
          >
            {t("title") || "Your Fitness Assessment"}
          </h2>
          <p className="text-lg opacity-80" style={{ color: "oklch(0.9465 0.013 17.39)" }}>
            {t("description") || "Help us create your personalized training plan"}
          </p>
        </div>

        {/* Progress Bar */}
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
                      className={`text-xs mt-2 text-center hidden md:block transition-opacity ${
                        isCurrent ? "opacity-100 font-semibold" : "opacity-60"
                      }`}
                      style={{ color: "oklch(0.9465 0.013 17.39)" }}
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

        {/* Form Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
          <div className="flex items-center mb-8">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mr-4"
              style={{ background: "oklch(0.6787 0.1707 3.82)" }}
            >
              <StepIcon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold" style={{ color: "oklch(0.9465 0.013 17.39)" }}>
              {steps[currentStep].title}
            </h3>
          </div>

          {/* Step Content */}
          <div className="space-y-6 min-h-[400px]">
            {/* Step 0: Personal Info */}
            {currentStep === 0 && (
              <>
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "oklch(0.9465 0.013 17.39)" }}
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={e => handleInputChange("fullName", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "oklch(0.9465 0.013 17.39)" }}
                    >
                      {t("form.age") || "Age"} *
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={e => handleInputChange("age", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                      placeholder="25"
                    />
                    {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age}</p>}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "oklch(0.9465 0.013 17.39)" }}
                    >
                      {t("form.gender") || "Gender"} *
                    </label>
                    <select
                      value={formData.gender}
                      onChange={e => handleInputChange("gender", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 transition-colors"
                    >
                      <option value="" className="bg-gray-800">
                        {t("form.select") || "Select"}
                      </option>
                      <option value="male" className="bg-gray-800">
                        {t("form.male") || "Male"}
                      </option>
                      <option value="female" className="bg-gray-800">
                        {t("form.female") || "Female"}
                      </option>
                    </select>
                    {errors.gender && <p className="text-red-400 text-sm mt-1">{errors.gender}</p>}
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "oklch(0.9465 0.013 17.39)" }}
                  >
                    {t("form.email") || "Email"} *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => handleInputChange("email", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                    placeholder={t("form.emailPlaceholder") || "john@example.com"}
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "oklch(0.9465 0.013 17.39)" }}
                  >
                    {t("form.phoneNumber") || "Phone Number"} *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => handleInputChange("phone", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                    placeholder={t("form.phoneNumberPlaceholder") || "+1 (555) 123-4567"}
                  />
                  {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                </div>
              </>
            )}

            {/* Step 1: Body Metrics */}
            {currentStep === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "oklch(0.9465 0.013 17.39)" }}
                    >
                      {t("form.height") || "height (cm)"} *
                    </label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={e => handleInputChange("height", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                      placeholder={t("form.heightPlaceholder") || "175"}
                    />
                    {errors.height && <p className="text-red-400 text-sm mt-1">{errors.height}</p>}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "oklch(0.9465 0.013 17.39)" }}
                    >
                      {t("form.weight") || "Weight (kg)"} *
                    </label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={e => handleInputChange("weight", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                      placeholder={t("form.weightPlaceholder") || "75"}
                    />
                    {errors.weight && <p className="text-red-400 text-sm mt-1">{errors.weight}</p>}
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "oklch(0.9465 0.013 17.39)" }}
                  >
                    {t("form.targetWeight") || "Target Weight (kg)"} *
                  </label>
                  <input
                    type="number"
                    value={formData.targetWeight}
                    onChange={e => handleInputChange("targetWeight", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                    placeholder={t("form.targetWeightPlaceholder") || "70"}
                  />
                  {errors.targetWeight && (
                    <p className="text-red-400 text-sm mt-1">{errors.targetWeight}</p>
                  )}
                </div>

                {bmi && (
                  <div
                    className="p-6 rounded-lg"
                    style={{ background: "oklch(0.3257 0.0203 269.5)" }}
                  >
                    <h4
                      className="text-lg font-semibold mb-2"
                      style={{ color: "oklch(0.9465 0.013 17.39)" }}
                    >
                      {t("form.bmiTitle") || "Your BMI Analysis"}
                    </h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className="text-3xl font-bold"
                          style={{ color: "oklch(0.6787 0.1707 3.82)" }}
                        >
                          {bmi}
                        </p>
                        <p className={`text-sm font-medium ${bmiCategory?.color || ""}`}>
                          {bmiCategory?.text || ""}
                        </p>
                      </div>
                      <div
                        className="text-right opacity-80"
                        style={{ color: "oklch(0.9465 0.013 17.39)" }}
                      >
                        <p className="text-sm">{t("form.weightToLose") || "Weight to lose"}:</p>
                        <p className="text-lg font-semibold">
                          {(
                            parseFloat(formData.weight) - parseFloat(formData.targetWeight)
                          ).toFixed(1)}{" "}
                          kg
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Step 2: Fitness Goals */}
            {currentStep === 2 && (
              <>
                <div>
                  <label
                    className="block text-sm font-medium mb-3"
                    style={{ color: "oklch(0.9465 0.013 17.39)" }}
                  >
                    {t("form.primaryGoalTitle") || "Primary Fitness Goal"} *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Weight Loss",
                      "Muscle Gain",
                      "Endurance",
                      "General Fitness",
                      "Athletic Performance",
                      "Flexibility",
                    ].map(goal => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => handleInputChange("primaryGoal", goal)}
                        className={`px-4 py-3 rounded-lg border transition-all ${
                          formData.primaryGoal === goal
                            ? "border-transparent"
                            : "border-white/20 bg-white/5 hover:bg-white/10"
                        }`}
                        style={
                          formData.primaryGoal === goal
                            ? { background: "oklch(0.6787 0.1707 3.82)" }
                            : {}
                        }
                      >
                        <span style={{ color: "oklch(0.9465 0.013 17.39)" }}>{goal}</span>
                      </button>
                    ))}
                  </div>
                  {errors.primaryGoal && (
                    <p className="text-red-400 text-sm mt-1">{errors.primaryGoal}</p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-3"
                    style={{ color: "oklch(0.9465 0.013 17.39)" }}
                  >
                    {t("form.currentActivityLevelTitle") || "Current Activity Level"} *
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "sedentary", label: "Sedentary", desc: "Little to no exercise" },
                      { value: "light", label: "Lightly Active", desc: "1-3 days/week" },
                      { value: "moderate", label: "Moderately Active", desc: "3-5 days/week" },
                      { value: "very", label: "Very Active", desc: "6-7 days/week" },
                      { value: "extra", label: "Extra Active", desc: "Professional athlete" },
                    ].map(level => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => handleInputChange("activityLevel", level.value)}
                        className={`w-full px-4 py-3 rounded-lg border text-left transition-all ${
                          formData.activityLevel === level.value
                            ? "border-transparent"
                            : "border-white/20 bg-white/5 hover:bg-white/10"
                        }`}
                        style={
                          formData.activityLevel === level.value
                            ? { background: "oklch(0.6787 0.1707 3.82)" }
                            : {}
                        }
                      >
                        <div style={{ color: "oklch(0.9465 0.013 17.39)" }}>
                          <p className="font-semibold">{level.label}</p>
                          <p className="text-sm opacity-70">{level.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.activityLevel && (
                    <p className="text-red-400 text-sm mt-1">{errors.activityLevel}</p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-3"
                    style={{ color: "oklch(0.9465 0.013 17.39)" }}
                  >
                    {t("form.experienceLevelTitle") || "Experience Level"} *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Beginner", "Intermediate", "Advanced"].map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => handleInputChange("experienceLevel", level)}
                        className={`px-4 py-3 rounded-lg border transition-all ${
                          formData.experienceLevel === level
                            ? "border-transparent"
                            : "border-white/20 bg-white/5 hover:bg-white/10"
                        }`}
                        style={
                          formData.experienceLevel === level
                            ? { background: "oklch(0.6787 0.1707 3.82)" }
                            : {}
                        }
                      >
                        <span style={{ color: "oklch(0.9465 0.013 17.39)" }}>{level}</span>
                      </button>
                    ))}
                  </div>
                  {errors.experienceLevel && (
                    <p className="text-red-400 text-sm mt-1">{errors.experienceLevel}</p>
                  )}
                </div>
              </>
            )}
            {currentStep === 3 && (
              <>
                <div>
                  <label
                    className="block text-sm font-medium mb-3"
                    style={{ color: "oklch(0.9465 0.013 17.39)" }}
                  >
                    {t("form.preferredWorkoutDaysTitle") || "Preferred Workout Days"} *
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleWorkoutDay(day)}
                        className={`px-3 py-3 rounded-lg border transition-all ${
                          formData.workoutDays.includes(day)
                            ? "border-transparent"
                            : "border-white/20 bg-white/5 hover:bg-white/10"
                        }`}
                        style={
                          formData.workoutDays.includes(day)
                            ? { background: "oklch(0.6787 0.1707 3.82)" }
                            : {}
                        }
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
                  {errors.workoutDays && (
                    <p className="text-red-400 text-sm mt-1">{errors.workoutDays}</p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "oklch(0.9465 0.013 17.39)" }}
                  >
                    {t("form.preferredWorkoutTimeTitle") || "Preferred Workout Time"} *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Morning (6-11am)", "Afternoon (12-5pm)", "Evening (6-10pm)"].map(time => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => handleInputChange("preferredTime", time)}
                        className={`px-4 py-3 rounded-lg border transition-all text-sm ${
                          formData.preferredTime === time
                            ? "border-transparent"
                            : "border-white/20 bg-white/5 hover:bg-white/10"
                        }`}
                        style={
                          formData.preferredTime === time
                            ? { background: "oklch(0.6787 0.1707 3.82)" }
                            : {}
                        }
                      >
                        <span style={{ color: "oklch(0.9465 0.013 17.39)" }}>{time}</span>
                      </button>
                    ))}
                  </div>
                  {errors.preferredTime && (
                    <p className="text-red-400 text-sm mt-1">{errors.preferredTime}</p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "oklch(0.9465 0.013 17.39)" }}
                  >
                    {t("form.sessionDurationTitle") || "Session Duration"} *
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {["30 min", "45 min", "60 min", "90 min"].map(duration => (
                      <button
                        key={duration}
                        type="button"
                        onClick={() => handleInputChange("sessionDuration", duration)}
                        className={`px-4 py-3 rounded-lg border transition-all ${
                          formData.sessionDuration === duration
                            ? "border-transparent"
                            : "border-white/20 bg-white/5 hover:bg-white/10"
                        }`}
                        style={
                          formData.sessionDuration === duration
                            ? { background: "oklch(0.6787 0.1707 3.82)" }
                            : {}
                        }
                      >
                        <span style={{ color: "oklch(0.9465 0.013 17.39)" }}>{duration}</span>
                      </button>
                    ))}
                  </div>
                  {errors.sessionDuration && (
                    <p className="text-red-400 text-sm mt-1">{errors.sessionDuration}</p>
                  )}
                </div>
              </>
            )}

            {/* Step 4: Diet & Health */}
            {currentStep === 4 && (
              <>
                <div>
                  <label
                    className="block text-sm font-medium mb-3"
                    style={{ color: "oklch(0.9465 0.013 17.39)" }}
                  >
                    {t("form.dietaryPreferenceTitle") || "Dietary Preference"} *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "No Restrictions",
                      "Vegetarian",
                      "Vegan",
                      "Keto",
                      "Paleo",
                      "Mediterranean",
                    ].map(diet => (
                      <button
                        key={diet}
                        type="button"
                        onClick={() => handleInputChange("dietaryPreference", diet)}
                        className={`px-4 py-3 rounded-lg border transition-all ${
                          formData.dietaryPreference === diet
                            ? "border-transparent"
                            : "border-white/20 bg-white/5 hover:bg-white/10"
                        }`}
                        style={
                          formData.dietaryPreference === diet
                            ? { background: "oklch(0.6787 0.1707 3.82)" }
                            : {}
                        }
                      >
                        <span style={{ color: "oklch(0.9465 0.013 17.39)" }}>{diet}</span>
                      </button>
                    ))}
                  </div>
                  {errors.dietaryPreference && (
                    <p className="text-red-400 text-sm mt-1">{errors.dietaryPreference}</p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "oklch(0.9465 0.013 17.39)" }}
                  >
                    {t("form.foodAllergiesTitle") || "Food Allergies (Optional)"}
                  </label>
                  <input
                    type="text"
                    value={formData.allergies}
                    onChange={e => handleInputChange("allergies", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                    placeholder="e.g., Nuts, Dairy, Gluten"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "oklch(0.9465 0.013 17.39)" }}
                  >
                    {t("form.medicalConditionsTitle") || "Medical Conditions"} *
                  </label>
                  <textarea
                    value={formData.medicalConditions}
                    onChange={e => handleInputChange("medicalConditions", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors resize-none"
                    rows={3}
                    placeholder="List any medical conditions we should be aware of (e.g., diabetes, heart condition, asthma)"
                  />
                  {errors.medicalConditions && (
                    <p className="text-red-400 text-sm mt-1">{errors.medicalConditions}</p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "oklch(0.9465 0.013 17.39)" }}
                  >
                    {t("form.currentInjuriesTitle") || "Current Injuries (Optional)"}
                  </label>
                  <textarea
                    value={formData.injuries}
                    onChange={e => handleInputChange("injuries", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors resize-none"
                    rows={3}
                    placeholder="Describe any injuries or physical limitations"
                  />
                </div>
              </>
            )}

            {/* Step 5: Final Details */}
            {currentStep === 5 && (
              <>
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "oklch(0.9465 0.013 17.39)" }}
                  >
                    {t("form.motivationTitle") || "What Motivates You?"} *
                  </label>
                  <textarea
                    value={formData.motivation}
                    onChange={e => handleInputChange("motivation", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors resize-none"
                    rows={4}
                    placeholder="Tell us what drives you to achieve your fitness goals..."
                  />
                  {errors.motivation && (
                    <p className="text-red-400 text-sm mt-1">{errors.motivation}</p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "oklch(0.9465 0.013 17.39)" }}
                  >
                    {t("form.challengesTitle") || "Biggest Challenges (Optional)"}
                  </label>
                  <textarea
                    value={formData.challenges}
                    onChange={e => handleInputChange("challenges", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors resize-none"
                    rows={4}
                    placeholder="What obstacles have prevented you from reaching your goals in the past?"
                  />
                </div>

                <div
                  className="mt-8 p-6 rounded-lg"
                  style={{ background: "oklch(0.3257 0.0203 269.5)" }}
                >
                  <h4
                    className="text-lg font-semibold mb-3"
                    style={{ color: "oklch(0.9465 0.013 17.39)" }}
                  >
                    📋 {t("form.assessmentSummery.title") || "Assessment Summary"}
                  </h4>
                  <div className="space-y-2 text-sm" style={{ color: "oklch(0.9465 0.013 17.39)" }}>
                    <p>
                      <strong>{t("form.assessmentSummery.goal") || "Goal"}:</strong>{" "}
                      {formData.primaryGoal || "Not set"}
                    </p>
                    <p>
                      <strong>{t("form.assessmentSummery.experience") || "Experience"}:</strong>{" "}
                      {formData.experienceLevel || "Not set"}
                    </p>
                    <p>
                      <strong>{t("form.assessmentSummery.workoutDays") || "Workout Days"}:</strong>{" "}
                      {formData.workoutDays.length > 0
                        ? formData.workoutDays.join(", ")
                        : "Not set"}
                    </p>
                    <p>
                      <strong>
                        {t("form.assessmentSummery.sessionDuration") || "Session Duration"}:
                      </strong>{" "}
                      {formData.sessionDuration || "Not set"}
                    </p>
                    <p>
                      <strong>{t("form.assessmentSummery.diet") || "Diet"}:</strong>{" "}
                      {formData.dietaryPreference || "Not set"}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-white/10"
              }`}
              style={{ color: "oklch(0.9465 0.013 17.39)" }}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              {t("form.backButton") || "Back"}
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center px-6 py-3 rounded-lg font-semibold text-white transition-all hover:scale-105"
                style={{ background: "oklch(0.6787 0.1707 3.82)" }}
              >
                {t("form.nextButton") || "Next"}
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center px-8 py-3 rounded-lg font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "oklch(0.6787 0.1707 3.82)" }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t("form.submitting") || "Submitting..."}
                  </>
                ) : (
                  <>
                    {t("form.completeAssessment") || "Complete Assessment"}
                    <Check className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default UserForm

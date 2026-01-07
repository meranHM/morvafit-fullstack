import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import HealthProfileTab from "@/components/dashboard/HealthProfileTab"
import { HealthData } from "@/types/bodyInfo"
import { RawBodyInfoData } from "@/components/dashboard/DashboardBodyInfoForm"

// Raw body info data from database (includes all fields needed for editing)
type BodyInfoData = {
  age: number
  gender: string
  height: number
  weight: number
  targetWeight: number
  bmi: number
  primaryGoal: string
  activityLevel: string
  experienceLevel: string
  workoutDays: string[]
  preferredTime: string
  sessionDuration: string
  dietaryPreference: string
  allergies: string | null
  medicalConditions: string | null
  injuries: string | null
  motivation: string | null
  challenges: string | null
  updatedAt: Date
}

export default async function DashboardHealthProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user.id) {
    redirect("/login")
  }

  // Fetching user data from database
  // Including all body info fields needed for both display and editing
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      bodyInfo: {
        select: {
          age: true,
          gender: true,
          height: true,
          weight: true,
          targetWeight: true,
          bmi: true,
          primaryGoal: true,
          activityLevel: true,
          experienceLevel: true,
          workoutDays: true,
          preferredTime: true,
          sessionDuration: true,
          dietaryPreference: true,
          allergies: true,
          medicalConditions: true,
          injuries: true,
          motivation: true,
          challenges: true,
          updatedAt: true,
        },
      },
    },
  })

  if (!user) {
    redirect("/login")
  }

  // Preparing body info data (if it exists)
  // This includes all fields from the database for both display and editing
  const bodyInfo: BodyInfoData | null = user.bodyInfo
    ? {
        age: user.bodyInfo.age,
        gender: user.bodyInfo.gender,
        height: user.bodyInfo.height,
        weight: user.bodyInfo.weight,
        targetWeight: user.bodyInfo.targetWeight,
        bmi: user.bodyInfo.bmi,
        primaryGoal: user.bodyInfo.primaryGoal,
        activityLevel: user.bodyInfo.activityLevel,
        experienceLevel: user.bodyInfo.experienceLevel,
        workoutDays: user.bodyInfo.workoutDays,
        preferredTime: user.bodyInfo.preferredTime,
        sessionDuration: user.bodyInfo.sessionDuration,
        dietaryPreference: user.bodyInfo.dietaryPreference,
        allergies: user.bodyInfo.allergies,
        medicalConditions: user.bodyInfo.medicalConditions,
        injuries: user.bodyInfo.injuries,
        motivation: user.bodyInfo.motivation,
        challenges: user.bodyInfo.challenges,
        updatedAt: user.bodyInfo.updatedAt,
      }
    : null

  // PREPARE RAW DATA FOR EDITING
  // This data structure matches what DashboardBodyInfoForm expects
  const rawBodyInfo: RawBodyInfoData | null = bodyInfo
    ? {
        age: bodyInfo.age,
        gender: bodyInfo.gender,
        height: bodyInfo.height,
        weight: bodyInfo.weight,
        targetWeight: bodyInfo.targetWeight,
        primaryGoal: bodyInfo.primaryGoal,
        activityLevel: bodyInfo.activityLevel,
        experienceLevel: bodyInfo.experienceLevel,
        workoutDays: bodyInfo.workoutDays,
        preferredTime: bodyInfo.preferredTime,
        sessionDuration: bodyInfo.sessionDuration,
        dietaryPreference: bodyInfo.dietaryPreference,
        allergies: bodyInfo.allergies,
        medicalConditions: bodyInfo.medicalConditions,
        injuries: bodyInfo.injuries,
        motivation: bodyInfo.motivation,
        challenges: bodyInfo.challenges,
      }
    : null

  // HELPER FUNCTIONS
  // =================================
  // Formatting enum values for display
  // Converts "WEIGHT_LOSS" -> "Weight Loss"
  function formatEnumValue(value: string): string {
    return value
      .split("_")
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ")
  }

  // Formatting Body Info for Display
  function formatBodyInfo(bodyInfo: BodyInfoData | null): HealthData | null {
    if (!bodyInfo) return null

    // Formatting workout days: ["MON", "WED", "FRI"] -> "3 days/week"
    const workoutFrequency = `${bodyInfo.workoutDays.length} days/week`

    return {
      height: `${bodyInfo.height} cm`,
      weight: `${bodyInfo.weight} kg`,
      age: `${bodyInfo.age} years`,
      goal: formatEnumValue(bodyInfo.primaryGoal),
      fitnessLevel: formatEnumValue(bodyInfo.activityLevel),
      medicalConditions: bodyInfo.medicalConditions || "None",
      dietaryPreferences: formatEnumValue(bodyInfo.dietaryPreference),
      workoutFrequency: workoutFrequency,
      lastUpdated: new Date(bodyInfo.updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    }
  }

  const healthData = formatBodyInfo(bodyInfo)

  // Passing both formatted display data and raw data for editing
  return (
    <HealthProfileTab
      healthData={healthData}
      rawBodyInfo={rawBodyInfo}
      userName={user.name || ""}
      userEmail={user.email || ""}
      userPhone={user.phone || ""}
    />
  )
}

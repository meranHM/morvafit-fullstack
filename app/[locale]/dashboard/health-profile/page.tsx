import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import HealthProfileTab from "@/components/dashboard/HealthProfileTab"
import { HealthData } from "@/types/bodyInfo"

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
  medicalConditions: string | null
  updatedAt: Date
}

export default async function DashboardHealthProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user.id) {
    redirect("/login")
  }

  // Fetching user data from database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      // Including body info if it exists (one-to-one relationship)
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
          medicalConditions: true,
          updatedAt: true,
        },
      },
    },
  })

  if (!user) {
    redirect("/login")
  }

  // Preparing body info data (if it exists)
  const bodyInfo = user.bodyInfo
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
        medicalConditions: user.bodyInfo.medicalConditions,
        updatedAt: user.bodyInfo.updatedAt,
      }
    : null

  // HELPER FUNCTION: Format enum values for display
  // Converts "WEIGHT_LOSS" -> "Weight Loss"
  function formatEnumValue(value: string): string {
    return value
      .split("_")
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ")
  }

  // HELPER FUNCTION: Format Body Info for Display
  function formatBodyInfo(bodyInfo: BodyInfoData | null): HealthData | null {
    if (!bodyInfo) return null

    // Format workout days: ["MON", "WED", "FRI"] -> "3 days/week"
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

  return <HealthProfileTab healthData={healthData} />
}

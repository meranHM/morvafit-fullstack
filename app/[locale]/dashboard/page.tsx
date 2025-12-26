import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import UserDashboard from "@/components/dashboard/UserDashboard"

export default async function DashboardPage() {
  // STEP 1: Checking if user is authenticated
  const session = await getServerSession(authOptions)

  if (!session?.user.id) {
    redirect("login")
  }

  // STEP 2: Fetching user data from database
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
    redirect("login")
  }

  // STEP 3: Preparing safe user data for client component
  const safeUser = {
    name: user.name ?? "Anonymous",
    email: user.email ?? "",
    phone: user.phone ?? "",
    createdAt: user.createdAt,
  }

  // STEP 4: Preparing body info data (if it exists)
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

  return <UserDashboard user={safeUser} bodyInfo={bodyInfo} />
}

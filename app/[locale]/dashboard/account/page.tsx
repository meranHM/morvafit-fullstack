import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import AccountTab from "@/components/dashboard/AccountTab"

export default async function DashboardAccountPage() {
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

  // Preparing safe user data for client component
  const safeUser = {
    name: user.name ?? "Anonymous",
    email: user.email ?? "",
    phone: user.phone ?? "",
    createdAt: user.createdAt,
  }
  return <AccountTab name={safeUser.name} email={safeUser.email} phone={safeUser.phone} />
}

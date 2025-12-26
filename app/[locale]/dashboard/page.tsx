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
          height: true,
          weight: true,
          bmi: true,
          goal: true,
          activityLevel: true,
          healthConditions: true,
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
        height: user.bodyInfo.height,
        weight: user.bodyInfo.weight,
        bmi: user.bodyInfo.bmi,
        goal: user.bodyInfo.goal,
        activityLevel: user.bodyInfo.activityLevel,
        healthConditions: user.bodyInfo.healthConditions,
        updatedAt: user.bodyInfo.updatedAt,
      }
    : null

  return <UserDashboard user={safeUser} bodyInfo={bodyInfo} />
}

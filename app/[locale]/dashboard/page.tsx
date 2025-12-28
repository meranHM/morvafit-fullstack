import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import OverviewTab from "@/components/dashboard/OverviewTab"

const mockVideos = [
  {
    id: 1,
    title: "Full Body Strength Training",
    duration: "45 min",
    level: "Intermediate",
    thumbnail: "/thumb1.jpg",
    assignedDate: "Mar 10, 2024",
    completed: true,
  },
  {
    id: 2,
    title: "HIIT Cardio Blast",
    duration: "30 min",
    level: "Advanced",
    thumbnail: "/thumb2.jpg",
    assignedDate: "Mar 12, 2024",
    completed: false,
  },
  {
    id: 3,
    title: "Core & Abs Workout",
    duration: "25 min",
    level: "Beginner",
    thumbnail: "/thumb3.jpg",
    assignedDate: "Mar 15, 2024",
    completed: false,
  },
]

export default async function DashboardPage() {
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

  return <OverviewTab name={safeUser.name} nextPayment={"N/A"} videos={mockVideos} />
}

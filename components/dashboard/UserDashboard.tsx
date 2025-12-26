import DashboardHeader from "@/components/dashboard/Header"
import MainSection from "@/components/dashboard/MainSection"
import type { HealthData } from "@/types/bodyInfo"

// Mock data
const mockUser = {
  name: "Morvarid Haji",
  email: "morvaridfitness@gmail.com",
  phone: "+971 (58) 849-8855",
  avatar: "/avatar.jpg",
  memberSince: "December 2025",
  planStatus: "Active",
  nextPayment: "April 15, 2024",
}

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

const mockPayments = [
  {
    id: 1,
    amount: "$150",
    date: "Mar 1, 2024",
    status: "approved",
    method: "Bank Transfer",
    receiptUrl: "#",
  },
  {
    id: 2,
    amount: "$150",
    date: "Feb 1, 2024",
    status: "approved",
    method: "Bank Transfer",
    receiptUrl: "#",
  },
  {
    id: 3,
    amount: "$150",
    date: "Jan 1, 2024",
    status: "approved",
    method: "Bank Transfer",
    receiptUrl: "#",
  },
]

// TYPE DEFINITIONS
type DashboardUser = {
  name: string
  email: string
  phone: string
  createdAt: Date
}

type BodyInfoData = {
  height: number
  weight: number
  bmi: number
  goal: string
  activityLevel: string
  healthConditions: string | null
  updatedAt: Date
}

// HELPER FUNCTION: Format Body Info for Display
function formatBodyInfo(bodyInfo: BodyInfoData | null): HealthData | null {
  if (!bodyInfo) return null

  // Format goal: "WEIGHT_LOSS" -> "Weight Loss"
  const formatGoal = (goal: string) => {
    return goal
      .split("_")
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ")
  }

  // Format activity level: "MODERATE" -> "Moderate"
  const formatActivityLevel = (level: string) => {
    return level.charAt(0) + level.slice(1).toLowerCase()
  }

  return {
    height: `${bodyInfo.height} cm`,
    weight: `${bodyInfo.weight} kg`,
    age: "N/A", // We don't have age in body info yet
    goal: formatGoal(bodyInfo.goal),
    fitnessLevel: formatActivityLevel(bodyInfo.activityLevel),
    medicalConditions: bodyInfo.healthConditions || "None",
    dietaryPreferences: "N/A", // We don't track this yet
    workoutFrequency: "N/A", // We don't track this yet
    lastUpdated: new Date(bodyInfo.updatedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  }
}

const UserDashboard = ({
  user,
  bodyInfo,
}: {
  user: DashboardUser
  bodyInfo: BodyInfoData | null
}) => {
  const healthData = formatBodyInfo(bodyInfo)

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-rose-50/30">
      <DashboardHeader name={user.name} plan={mockUser.planStatus} />

      <MainSection
        memberSince={mockUser.memberSince}
        nextPayment={mockUser.nextPayment}
        name={user.name}
        email={user.email}
        phone={user.phone}
        videos={mockVideos}
        payments={mockPayments}
        healthData={healthData}
      />
    </div>
  )
}

export default UserDashboard

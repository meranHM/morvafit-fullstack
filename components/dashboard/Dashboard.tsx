import DashboardHeader from "@/components/dashboard/Header"
import MainSection from "@/components/dashboard/MainSection"

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

const mockHealthData = {
  height: "165 cm",
  weight: "60 kg",
  age: "28",
  goal: "Weight Loss & Toning",
  fitnessLevel: "Intermediate",
  medicalConditions: "None",
  dietaryPreferences: "Vegetarian",
  workoutFrequency: "4-5 times per week",
  lastUpdated: "Jan 15, 2024",
}

type DashboardUser = {
  name: string
  email: string
  phone: string
  createdAt: Date
}

const UserDashboard = ({ user }: { user: DashboardUser }) => {
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
        healthData={mockHealthData}
      />
    </div>
  )
}

export default UserDashboard

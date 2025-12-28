import {
  Activity,
  Video,
  Receipt,
  FileText,
  TrendingUp,
  User,
  Check,
  Clock,
  Zap,
  Target,
} from "lucide-react"

export const navigation = [
  { id: "overview", label: "Overview", icon: Activity, href: "/dashboard" },
  { id: "videos", label: "My Workouts", icon: Video, href: "/dashboard/workouts" },
  { id: "payments", label: "Payments", icon: Receipt, href: "/dashboard/payments" },
  { id: "health", label: "Health Profile", icon: FileText, href: "/dashboard/health-profile" },
  { id: "account", label: "Account", icon: User, href: "/dashboard/account" },
]

export const stats = [
  { label: "Workouts Completed", value: "24", icon: Check, color: "from-rose-500 to-pink-500" },
  { label: "Total Hours", value: "18.5", icon: Clock, color: "from-purple-500 to-indigo-500" },
  { label: "Current Streak", value: "7 days", icon: Zap, color: "from-orange-500 to-yellow-500" },
  {
    label: "Calories Burned",
    value: "2,840",
    icon: Target,
    color: "from-green-500 to-emerald-500",
  },
]

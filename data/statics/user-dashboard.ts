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

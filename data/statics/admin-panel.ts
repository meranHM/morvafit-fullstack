import { Users, FileText, Receipt, Video, LayoutDashboard } from "lucide-react"

export const navigation = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "clients", label: "Clients", icon: Users },
  { id: "forms", label: "Health Forms", icon: FileText },
  { id: "payments", label: "Payments", icon: Receipt },
  { id: "videos", label: "Workout Plans", icon: Video },
]

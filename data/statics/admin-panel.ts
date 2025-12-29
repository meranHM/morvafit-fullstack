import { Users, FileText, Receipt, Video, LayoutDashboard } from "lucide-react"

export const navigation = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/admin" },
  { id: "clients", label: "Clients", icon: Users, href: "/admin/clients" },
  { id: "forms", label: "Health Forms", icon: FileText, href: "/admin/health-forms" },
  { id: "payments", label: "Payments", icon: Receipt, href: "/admin/payments" },
  { id: "videos", label: "Workout Plans", icon: Video, href: "/admin/workout-videos" },
]

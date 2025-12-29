import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPanelSidebar from "@/components/admin/AdminPanelSidebar"
import AdminPanelHeader from "@/components/admin/AdminPanelHeader"

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session?.user.id) {
    redirect("/login")
  }

  // Fetching admin data
  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  })

  /* if (!admin || admin.role !== "ADMIN") {
    redirect("/")
  } */

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminPanelSidebar />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <AdminPanelHeader />

        {/* Content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

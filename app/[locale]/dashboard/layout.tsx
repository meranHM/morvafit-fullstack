import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import DashboardHeader from "@/components/dashboard/UserDashboardHeader"
import UserDashboardSidebar from "@/components/dashboard/UserDashboardSidebar"

export default async function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session?.user.id) {
    redirect("/login")
  }

  // Fetch user data along with their latest approved receipt for payment status
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      // Get the most recent approved receipt to show payment status
      receipts: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true },
      },
    },
  })

  if (!user) {
    redirect("/login")
  }

  // Format memberSince date (when user signed up)
  const memberSince = user.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  // Calculate next payment status based on last approved receipt
  // If user has an approved receipt, show when it was made
  // Otherwise show "No payments yet"
  const lastApprovedReceipt = user.receipts[0]
  const nextPayment = lastApprovedReceipt
    ? `Last: ${lastApprovedReceipt.createdAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`
    : "No payments yet"

  // Preparing safe user data for client component
  const safeUser = {
    name: user.name ?? "Anonymous",
    email: user.email ?? "",
    phone: user.phone ?? "",
    createdAt: user.createdAt,
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-rose-50/30">
      <DashboardHeader name={safeUser.name} plan={"Active"} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <UserDashboardSidebar nextPayment={nextPayment} memberSince={memberSince} />
          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>
    </div>
  )
}

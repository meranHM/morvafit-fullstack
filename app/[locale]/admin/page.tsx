import { prisma } from "@/lib/prisma"
import OverviewTab from "@/components/admin/OverviewTab"

// Define types for the data we'll pass to the component
export type StatsData = {
  totalClients: number
  pendingPayments: number
  activePlans: number
  pendingForms: number
}

export type RecentPayment = {
  id: string
  clientName: string
  amount: number
  date: string
  status: "pending" | "approved" | "rejected"
  receiptUrl: string
}

export default async function AdminPanelOverviewPage() {
  // Fetch all statistics in parallel for better performance
  const [totalClients, pendingPayments, approvedPayments, pendingForms, recentPayments] =
    await Promise.all([
      // Count total users (excluding admins)
      prisma.user.count({
        where: { role: "USER" },
      }),

      // Count pending receipts
      prisma.receipt.count({
        where: { status: "PENDING" },
      }),

      // Count approved receipts (active plans)
      prisma.receipt.count({
        where: { status: "APPROVED" },
      }),

      // Count users with body info forms
      prisma.bodyInfo.count(),

      // Get 5 most recent payments with user info
      prisma.receipt.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
    ])

  // Format stats for dashboard
  const stats: StatsData = {
    totalClients,
    pendingPayments,
    activePlans: approvedPayments,
    pendingForms,
  }

  // Format recent payments for display
  const formattedPayments: RecentPayment[] = recentPayments.map(payment => ({
    id: payment.id,
    clientName: payment.user.name || payment.user.email,
    amount: payment.amount,
    date: payment.createdAt.toISOString().split("T")[0],
    status: payment.status.toLowerCase() as "pending" | "approved" | "rejected",
    receiptUrl: payment.imageUrl,
  }))

  return <OverviewTab stats={stats} recentPayments={formattedPayments} />
}

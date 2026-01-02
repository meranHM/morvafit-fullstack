import { prisma } from "@/lib/prisma"
import PaymentsTab from "@/components/admin/PaymentsTab"

// Type for payment data passed to component
export type PaymentData = {
  id: string
  userId: string
  clientName: string
  clientEmail: string
  amount: number
  date: string
  status: "pending" | "approved" | "rejected"
  receiptUrl: string
  reviewNotes: string | null
}

export default async function AdminPanelPaymentsPage() {
  // Fetch all receipts with user info
  const receipts = await prisma.receipt.findMany({
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
  })

  // Format receipts for frontend
  const payments: PaymentData[] = receipts.map(receipt => ({
    id: receipt.id,
    userId: receipt.userId,
    clientName: receipt.user.name || receipt.user.email,
    clientEmail: receipt.user.email,
    amount: receipt.amount,
    date: receipt.createdAt.toISOString().split("T")[0],
    status: receipt.status.toLowerCase() as "pending" | "approved" | "rejected",
    receiptUrl: receipt.imageUrl,
    reviewNotes: receipt.reviewNotes,
  }))

  return <PaymentsTab payments={payments} />
}

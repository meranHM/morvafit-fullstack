import PaymentTab from "@/components/dashboard/PaymentTab"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function DashboardPaymentsPage() {
  // Get session with authOptions for proper user data
  const session = await getServerSession(authOptions)

  // Fetch user's email verification status
  const user = await prisma.user.findUnique({
    where: { id: session?.user.id },
    select: { emailVerified: true },
  })

  // Fetch all receipts for this user
  const receipts = await prisma.receipt.findMany({
    where: { userId: session?.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      imageUrl: true,
      amount: true,
      status: true,
      createdAt: true,
    },
  })

  // Serialize Date objects to ISO strings for client component
  const serializedReceipts = receipts.map((receipt) => ({
    ...receipt,
    createdAt: receipt.createdAt.toISOString(),
  }))

  return (
    <PaymentTab
      receitps={serializedReceipts}
      emailVerified={!!user?.emailVerified} // Convert to boolean (null -> false)
    />
  )
}

import PaymentTab from "@/components/dashboard/PaymentTab"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"

export default async function DashboardPaymentsPage() {
  const session = await getServerSession()

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

  return <PaymentTab receitps={serializedReceipts} />
}

import { prisma } from "@/lib/prisma"
import ClientsTab from "@/components/admin/ClientsTab"

// Type for client data passed to component
export type ClientData = {
  id: string
  name: string
  email: string
  phone: string | null
  status: "active" | "pending" | "inactive"
  joinDate: string
  hasForm: boolean
  hasPlan: boolean
}

export default async function AdminPanelClientsPage() {
  // Fetch all users (excluding admins) with their related data
  const users = await prisma.user.findMany({
    where: { role: "USER" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      isBlocked: true,
      createdAt: true,
      // Check if user has body info form
      bodyInfo: {
        select: { id: true },
      },
      // Check if user has any approved receipt (meaning they have a plan)
      receipts: {
        where: { status: "APPROVED" },
        select: { id: true },
        take: 1,
      },
    },
  })

  // Format users for frontend
  const clients: ClientData[] = users.map(user => ({
    id: user.id,
    name: user.name || "No name",
    email: user.email,
    phone: user.phone,
    // Determine status: active (has approved payment), pending (no payment), inactive (blocked)
    status: user.isBlocked ? "inactive" : user.receipts.length > 0 ? "active" : "pending",
    joinDate: user.createdAt.toISOString().split("T")[0],
    hasForm: !!user.bodyInfo,
    hasPlan: user.receipts.length > 0,
  }))

  return <ClientsTab clients={clients} />
}

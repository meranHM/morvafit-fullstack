import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import UserDashboard from "@/components/dashboard/Dashboard"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user.id) {
    redirect("login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      phone: true,
      createdAt: true,
    },
  })

  if (!user) {
    redirect("login")
  }

  const safeUser = {
    name: user.name ?? "Anonymous",
    email: user.email ?? "",
    phone: user.phone ?? "",
    createdAt: user.createdAt,
  }

  return <UserDashboard user={safeUser} />
}

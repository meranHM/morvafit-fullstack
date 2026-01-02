// Admin Users API
// This endpoint returns all users for the admin panel

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  // Step 1: Check if user is authenticated
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  // Step 2: Check if user is admin
  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }

  try {
    // Step 3: Fetch all users (excluding admins) with their related data
    const users = await prisma.user.findMany({
      where: { role: "USER" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isBlocked: true,
        emailVerified: true,
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

    // Step 4: Format users for frontend
    const formattedUsers = users.map(user => ({
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

    return NextResponse.json({ users: formattedUsers })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

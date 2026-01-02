// Admin Dashboard Statistics API
// This endpoint returns overview stats for the admin dashboard

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
    // Step 3: Fetch all statistics in parallel for better performance
    const [
      totalClients,
      pendingPayments,
      approvedPayments,
      pendingForms,
      totalVideos,
      recentPayments,
    ] = await Promise.all([
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

      // Count users with body info forms (pending review)
      prisma.bodyInfo.count(),

      // Count total videos
      prisma.video.count(),

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

    // Step 4: Format stats for dashboard
    const stats = {
      totalClients,
      pendingPayments,
      activePlans: approvedPayments,
      pendingForms,
      totalVideos,
    }

    // Step 5: Format recent payments for display
    const formattedPayments = recentPayments.map(payment => ({
      id: payment.id,
      clientName: payment.user.name || payment.user.email,
      amount: payment.amount,
      date: payment.createdAt.toISOString().split("T")[0],
      status: payment.status.toLowerCase(),
      receiptUrl: payment.imageUrl,
    }))

    return NextResponse.json({
      stats,
      recentPayments: formattedPayments,
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}

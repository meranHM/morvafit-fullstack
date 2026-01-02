// Admin Receipts API
// This endpoint returns all payment receipts for admin review

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
    // Step 3: Fetch all receipts with user info
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

    // Step 4: Format receipts for frontend
    const formattedReceipts = receipts.map(receipt => ({
      id: receipt.id,
      userId: receipt.userId,
      clientName: receipt.user.name || receipt.user.email,
      clientEmail: receipt.user.email,
      amount: receipt.amount,
      date: receipt.createdAt.toISOString().split("T")[0],
      status: receipt.status.toLowerCase(),
      receiptUrl: receipt.imageUrl,
      reviewNotes: receipt.reviewNotes,
      reviewedAt: receipt.reviewedAt?.toISOString().split("T")[0] || null,
    }))

    return NextResponse.json({ receipts: formattedReceipts })
  } catch (error) {
    console.error("Error fetching receipts:", error)
    return NextResponse.json({ error: "Failed to fetch receipts" }, { status: 500 })
  }
}

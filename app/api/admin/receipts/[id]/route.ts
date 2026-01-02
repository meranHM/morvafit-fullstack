// Admin Receipt Action API
// This endpoint handles approve/reject actions for a specific receipt
// When approving, it auto-assigns videos based on user's BMI

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// PATCH - Update receipt status (approve/reject)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    // Step 3: Get the receipt ID from params
    const { id } = await params

    // Step 4: Parse request body to get new status
    const body = await request.json()
    const { status, reviewNotes } = body

    // Step 5: Validate status
    if (!status || !["APPROVED", "REJECTED"].includes(status.toUpperCase())) {
      return NextResponse.json(
        { error: "Invalid status. Must be APPROVED or REJECTED" },
        { status: 400 }
      )
    }

    // Step 6: Check if receipt exists
    const receipt = await prisma.receipt.findUnique({
      where: { id },
    })

    if (!receipt) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 })
    }

    // Step 7: Update receipt status
    const updatedReceipt = await prisma.receipt.update({
      where: { id },
      data: {
        status: status.toUpperCase() as "APPROVED" | "REJECTED",
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
        reviewNotes: reviewNotes || null,
      },
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

    // Step 8: Auto-assign videos if receipt is APPROVED
    let assignedVideosCount = 0

    if (status.toUpperCase() === "APPROVED") {
      // Get user's body info to find their BMI
      const bodyInfo = await prisma.bodyInfo.findUnique({
        where: { userId: receipt.userId },
        select: { bmi: true },
      })

      if (bodyInfo) {
        const userBmi = bodyInfo.bmi

        // Find all videos that match this user's BMI range
        // Videos with no BMI restrictions (null/null) match ALL users
        // Videos with only min match users >= min
        // Videos with only max match users <= max
        // Videos with both match users within range (inclusive)
        const matchingVideos = await prisma.video.findMany({
          where: {
            OR: [
              // Videos with no BMI restrictions - match all
              { targetBmiMin: null, targetBmiMax: null },
              // Videos with only min BMI - user's BMI must be >= min
              {
                targetBmiMin: { lte: userBmi },
                targetBmiMax: null,
              },
              // Videos with only max BMI - user's BMI must be <= max
              {
                targetBmiMin: null,
                targetBmiMax: { gte: userBmi },
              },
              // Videos with both min and max - user's BMI must be within range
              {
                targetBmiMin: { lte: userBmi },
                targetBmiMax: { gte: userBmi },
              },
            ],
          },
          select: { id: true },
        })

        // Create video assignments for each matching video
        // Use upsert to avoid duplicates (in case user was already assigned some videos)
        for (const video of matchingVideos) {
          try {
            await prisma.videoAssignment.upsert({
              where: {
                userId_videoId: {
                  userId: receipt.userId,
                  videoId: video.id,
                },
              },
              create: {
                userId: receipt.userId,
                videoId: video.id,
                assignedBy: session.user.id,
                notes: "Auto-assigned based on BMI match",
              },
              update: {}, // Don't update if already exists
            })
            assignedVideosCount++
          } catch {
            // Skip if there's an error with this specific video (e.g., constraint violation)
            console.error(`Failed to assign video ${video.id} to user ${receipt.userId}`)
          }
        }
      }
    }

    // Step 9: Return updated receipt with assignment info
    return NextResponse.json({
      receipt: {
        id: updatedReceipt.id,
        userId: updatedReceipt.userId,
        clientName: updatedReceipt.user.name || updatedReceipt.user.email,
        amount: updatedReceipt.amount,
        date: updatedReceipt.createdAt.toISOString().split("T")[0],
        status: updatedReceipt.status.toLowerCase(),
        receiptUrl: updatedReceipt.imageUrl,
        reviewNotes: updatedReceipt.reviewNotes,
        reviewedAt: updatedReceipt.reviewedAt?.toISOString().split("T")[0] || null,
      },
      // Include assignment info for approved receipts
      ...(status.toUpperCase() === "APPROVED" && {
        autoAssignment: {
          videosAssigned: assignedVideosCount,
        },
      }),
    })
  } catch (error) {
    console.error("Error updating receipt:", error)
    return NextResponse.json({ error: "Failed to update receipt" }, { status: 500 })
  }
}

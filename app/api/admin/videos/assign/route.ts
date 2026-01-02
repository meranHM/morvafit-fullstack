// Admin Video Assignment API
// This endpoint handles manual video assignment to users

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// POST - Assign videos to a user
export async function POST(request: NextRequest) {
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
    // Step 3: Parse request body
    const body = await request.json()
    const { userId, videoIds, notes } = body

    // Step 4: Validate required fields
    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    if (!videoIds || !Array.isArray(videoIds) || videoIds.length === 0) {
      return NextResponse.json({ error: "At least one video ID is required" }, { status: 400 })
    }

    // Step 5: Check if user exists and has an approved receipt
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        receipts: {
          where: { status: "APPROVED" },
          take: 1,
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.receipts.length === 0) {
      return NextResponse.json(
        { error: "User does not have an approved payment. Please approve their payment first." },
        { status: 400 }
      )
    }

    // Step 6: Check if all videos exist
    const videos = await prisma.video.findMany({
      where: { id: { in: videoIds } },
      select: { id: true },
    })

    if (videos.length !== videoIds.length) {
      return NextResponse.json({ error: "One or more videos not found" }, { status: 404 })
    }

    // Step 7: Create video assignments (skip duplicates using upsert)
    const assignments = []
    let newAssignmentsCount = 0
    let skippedCount = 0

    for (const videoId of videoIds) {
      try {
        // Check if assignment already exists
        const existing = await prisma.videoAssignment.findUnique({
          where: {
            userId_videoId: {
              userId,
              videoId,
            },
          },
        })

        if (existing) {
          // Already assigned, skip
          skippedCount++
          continue
        }

        // Create new assignment
        const assignment = await prisma.videoAssignment.create({
          data: {
            userId,
            videoId,
            assignedBy: session.user.id,
            notes: notes || "Manually assigned by admin",
          },
          include: {
            video: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        })

        assignments.push(assignment)
        newAssignmentsCount++
      } catch {
        // Skip if there's an error with this specific video
        console.error(`Failed to assign video ${videoId} to user ${userId}`)
      }
    }

    // Step 8: Return result
    return NextResponse.json({
      message: `Successfully assigned ${newAssignmentsCount} video(s)`,
      assignments: assignments.map(a => ({
        id: a.id,
        videoId: a.videoId,
        videoTitle: a.video.title,
        assignedAt: a.assignedAt.toISOString(),
      })),
      summary: {
        requested: videoIds.length,
        assigned: newAssignmentsCount,
        skipped: skippedCount,
      },
    })
  } catch (error) {
    console.error("Error assigning videos:", error)
    return NextResponse.json({ error: "Failed to assign videos" }, { status: 500 })
  }
}

// GET - Get users eligible for video assignment (has approved receipt)
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
    // Step 3: Fetch users with approved receipts
    const users = await prisma.user.findMany({
      where: {
        role: "USER",
        receipts: {
          some: { status: "APPROVED" },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        bodyInfo: {
          select: { bmi: true },
        },
        _count: {
          select: { videoAssignments: true },
        },
      },
      orderBy: { name: "asc" },
    })

    // Step 4: Format users for frontend
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name || user.email,
      email: user.email,
      bmi: user.bodyInfo?.bmi?.toFixed(1) || null,
      assignedVideosCount: user._count.videoAssignments,
    }))

    return NextResponse.json({ users: formattedUsers })
  } catch (error) {
    console.error("Error fetching eligible users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

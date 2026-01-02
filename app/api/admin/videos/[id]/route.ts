// Admin Single Video API
// This endpoint handles get, update, and delete for a specific video

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { deleteFromS3 } from "@/lib/arvancloud"
import { NextRequest, NextResponse } from "next/server"
import { VideoLevel, VideoCategory, Prisma } from "@prisma/client"

// GET - Get single video details
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    // Step 3: Get video ID from params
    const { id } = await params

    // Step 4: Fetch video with tags and assignment count
    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        _count: {
          select: { assignments: true },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    // Step 5: Return formatted video
    return NextResponse.json({
      video: {
        id: video.id,
        title: video.title,
        description: video.description,
        videoUrl: video.videoUrl,
        thumbnailUrl: video.thumbnailUrl,
        duration: video.duration ? `${Math.round(video.duration / 60)} min` : null,
        durationSeconds: video.duration,
        level: video.level,
        category: video.category,
        targetBmiMin: video.targetBmiMin,
        targetBmiMax: video.targetBmiMax,
        assignedCount: video._count.assignments,
        tags: video.tags.map(vt => ({
          id: vt.tag.id,
          name: vt.tag.name,
          color: vt.tag.color,
        })),
        createdAt: video.createdAt.toISOString().split("T")[0],
      },
    })
  } catch (error) {
    console.error("Error fetching video:", error)
    return NextResponse.json({ error: "Failed to fetch video" }, { status: 500 })
  }
}

// PATCH - Update video metadata
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    // Step 3: Get video ID from params
    const { id } = await params

    // Step 4: Check if video exists
    const existingVideo = await prisma.video.findUnique({
      where: { id },
    })

    if (!existingVideo) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    // Step 5: Parse request body
    const body = await request.json()
    const {
      title,
      description,
      level,
      category,
      duration,
      targetBmiMin,
      targetBmiMax,
      tagIds,
    } = body

    // Step 6: Validate enums if provided
    const validLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"]
    const validCategories = ["STRENGTH", "CARDIO", "FLEXIBILITY", "HIIT", "CORE", "FULL_BODY"]

    if (level && !validLevels.includes(level.toUpperCase())) {
      return NextResponse.json(
        { error: "Invalid level. Must be BEGINNER, INTERMEDIATE, or ADVANCED" },
        { status: 400 }
      )
    }

    if (category && !validCategories.includes(category.toUpperCase())) {
      return NextResponse.json(
        {
          error:
            "Invalid category. Must be STRENGTH, CARDIO, FLEXIBILITY, HIIT, CORE, or FULL_BODY",
        },
        { status: 400 }
      )
    }

    // Step 7: Build update data using Prisma's input type
    const updateData: Prisma.VideoUpdateInput = {}

    if (title !== undefined) updateData.title = title.trim()
    if (description !== undefined) updateData.description = description?.trim() || null
    if (level !== undefined) updateData.level = level.toUpperCase() as VideoLevel
    if (category !== undefined) updateData.category = category.toUpperCase() as VideoCategory
    if (duration !== undefined) updateData.duration = duration ? parseInt(duration) : null
    if (targetBmiMin !== undefined)
      updateData.targetBmiMin = targetBmiMin ? parseFloat(targetBmiMin) : null
    if (targetBmiMax !== undefined)
      updateData.targetBmiMax = targetBmiMax ? parseFloat(targetBmiMax) : null

    // Step 8: Update video in database (use transaction if updating tags)
    let updatedVideo

    if (tagIds !== undefined) {
      // Update video and tags in transaction
      updatedVideo = await prisma.$transaction(async tx => {
        // Delete existing tags
        await tx.videoTag.deleteMany({
          where: { videoId: id },
        })

        // Update video and create new tags
        return tx.video.update({
          where: { id },
          data: {
            ...updateData,
            tags: {
              create: (tagIds as string[]).map(tagId => ({
                tagId,
              })),
            },
          },
          include: {
            _count: {
              select: { assignments: true },
            },
            tags: {
              include: {
                tag: true,
              },
            },
          },
        })
      })
    } else {
      // Just update video metadata (no tag changes)
      updatedVideo = await prisma.video.update({
        where: { id },
        data: updateData,
        include: {
          _count: {
            select: { assignments: true },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
      })
    }

    // TypeScript needs explicit type for the response
    type VideoWithRelations = Prisma.VideoGetPayload<{
      include: {
        _count: { select: { assignments: true } }
        tags: { include: { tag: true } }
      }
    }>
    const typedVideo = updatedVideo as VideoWithRelations

    // Step 9: Return updated video
    return NextResponse.json({
      video: {
        id: typedVideo.id,
        title: typedVideo.title,
        description: typedVideo.description,
        videoUrl: typedVideo.videoUrl,
        thumbnailUrl: typedVideo.thumbnailUrl,
        duration: typedVideo.duration ? `${Math.round(typedVideo.duration / 60)} min` : null,
        durationSeconds: typedVideo.duration,
        level: typedVideo.level,
        category: typedVideo.category,
        targetBmiMin: typedVideo.targetBmiMin,
        targetBmiMax: typedVideo.targetBmiMax,
        assignedCount: typedVideo._count.assignments,
        tags: typedVideo.tags.map(vt => ({
          id: vt.tag.id,
          name: vt.tag.name,
          color: vt.tag.color,
        })),
        createdAt: typedVideo.createdAt.toISOString().split("T")[0],
      },
    })
  } catch (error) {
    console.error("Error updating video:", error)
    return NextResponse.json({ error: "Failed to update video" }, { status: 500 })
  }
}

// DELETE - Delete video and its files from S3
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    // Step 3: Get video ID from params
    const { id } = await params

    // Step 4: Check if video exists
    const video = await prisma.video.findUnique({
      where: { id },
      select: {
        id: true,
        videoUrl: true,
        thumbnailUrl: true,
      },
    })

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    // Step 5: Delete files from S3
    try {
      await deleteFromS3(video.videoUrl)
      if (video.thumbnailUrl) {
        await deleteFromS3(video.thumbnailUrl)
      }
    } catch (s3Error) {
      // Log S3 error but continue with database deletion
      console.error("Error deleting files from S3:", s3Error)
    }

    // Step 6: Delete video from database (cascades to VideoTag and VideoAssignment)
    await prisma.video.delete({
      where: { id },
    })

    // Step 7: Return success response
    return NextResponse.json({ message: "Video deleted successfully" })
  } catch (error) {
    console.error("Error deleting video:", error)
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 })
  }
}

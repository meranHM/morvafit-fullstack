// Admin Videos API
// This endpoint handles video listing and creation with file upload

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { uploadToS3, generateUniqueFileName } from "@/lib/arvancloud"
import { NextRequest, NextResponse } from "next/server"

// Validation constants for video uploads
const MAX_VIDEO_SIZE = 100 * 1024 * 1024 // 100MB
const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"]
const ALLOWED_THUMBNAIL_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

// GET - List all videos with tags
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
    // Step 3: Fetch all videos with assignment count and tags
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { assignments: true },
        },
        // Include tags via the junction table
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    // Step 4: Format videos for frontend
    const formattedVideos = videos.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      // Format duration as "X min"
      duration: video.duration ? `${Math.round(video.duration / 60)} min` : null,
      durationSeconds: video.duration,
      level: video.level,
      category: video.category,
      targetBmiMin: video.targetBmiMin,
      targetBmiMax: video.targetBmiMax,
      assignedCount: video._count.assignments,
      // Format tags as array of tag objects
      tags: video.tags.map(vt => ({
        id: vt.tag.id,
        name: vt.tag.name,
        color: vt.tag.color,
      })),
      createdAt: video.createdAt.toISOString().split("T")[0],
    }))

    return NextResponse.json({ videos: formattedVideos })
  } catch (error) {
    console.error("Error fetching videos:", error)
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
  }
}

// POST - Upload and create a new video
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
    // Step 3: Parse FormData from request
    const formData = await request.formData()

    // Step 4: Extract fields from FormData
    const videoFile = formData.get("video") as File | null
    const thumbnailFile = formData.get("thumbnail") as File | null
    const title = formData.get("title") as string | null
    const description = formData.get("description") as string | null
    const level = formData.get("level") as string | null
    const category = formData.get("category") as string | null
    const duration = formData.get("duration") as string | null
    const targetBmiMin = formData.get("targetBmiMin") as string | null
    const targetBmiMax = formData.get("targetBmiMax") as string | null
    // Tag IDs can be multiple values with same key name
    const tagIds = formData.getAll("tagIds") as string[]

    // Step 5: Validate required fields
    if (!videoFile) {
      return NextResponse.json({ error: "Video file is required" }, { status: 400 })
    }

    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    if (!level || !category) {
      return NextResponse.json({ error: "Level and category are required" }, { status: 400 })
    }

    // Step 6: Validate video file type
    if (!ALLOWED_VIDEO_TYPES.includes(videoFile.type)) {
      return NextResponse.json(
        { error: "Invalid video type. Allowed: MP4, WebM, MOV" },
        { status: 400 }
      )
    }

    // Step 7: Validate video file size
    if (videoFile.size > MAX_VIDEO_SIZE) {
      return NextResponse.json({ error: "Video file too large. Maximum: 100MB" }, { status: 400 })
    }

    // Step 8: Validate thumbnail if provided
    if (thumbnailFile) {
      if (!ALLOWED_THUMBNAIL_TYPES.includes(thumbnailFile.type)) {
        return NextResponse.json(
          { error: "Invalid thumbnail type. Allowed: JPG, PNG, WebP" },
          { status: 400 }
        )
      }

      if (thumbnailFile.size > MAX_THUMBNAIL_SIZE) {
        return NextResponse.json({ error: "Thumbnail too large. Maximum: 5MB" }, { status: 400 })
      }
    }

    // Step 9: Validate enums
    const validLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"]
    const validCategories = ["STRENGTH", "CARDIO", "FLEXIBILITY", "HIIT", "CORE", "FULL_BODY"]

    if (!validLevels.includes(level.toUpperCase())) {
      return NextResponse.json(
        { error: "Invalid level. Must be BEGINNER, INTERMEDIATE, or ADVANCED" },
        { status: 400 }
      )
    }

    if (!validCategories.includes(category.toUpperCase())) {
      return NextResponse.json(
        {
          error:
            "Invalid category. Must be STRENGTH, CARDIO, FLEXIBILITY, HIIT, CORE, or FULL_BODY",
        },
        { status: 400 }
      )
    }

    // Step 10: Upload video file to ArvanCloud S3
    const videoBuffer = Buffer.from(await videoFile.arrayBuffer())
    const videoFileName = generateUniqueFileName(videoFile.name)

    const videoUrl = await uploadToS3({
      file: videoBuffer,
      fileName: videoFileName,
      contentType: videoFile.type,
      folder: "videos",
    })

    // Step 11: Upload thumbnail if provided
    let thumbnailUrl: string | null = null

    if (thumbnailFile) {
      const thumbnailBuffer = Buffer.from(await thumbnailFile.arrayBuffer())
      const thumbnailFileName = generateUniqueFileName(thumbnailFile.name)

      thumbnailUrl = await uploadToS3({
        file: thumbnailBuffer,
        fileName: thumbnailFileName,
        contentType: thumbnailFile.type,
        folder: "thumbnails",
      })
    }

    // Step 12: Create video in database with tags
    const video = await prisma.video.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        videoUrl,
        thumbnailUrl,
        duration: duration ? parseInt(duration) : null,
        level: level.toUpperCase() as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
        category: category.toUpperCase() as
          | "UPPER_BODY"
          | "LEGS"
          | "GLUTES"
          | "CORE"
          | "ABS"
          | "CARDIO"
          | "CARDIO_BOXING"
          | "FULL_BODY"
          | "FULL_BODY_SCULPT"
          | "HIIT"
          | "PILATES"
          | "ABS_CARDIO"
          | "BODYWEIGHT_TRAINING"
          | "TRX"
          | "FUNCTIONAL_TRAINING",
        targetBmiMin: targetBmiMin ? parseFloat(targetBmiMin) : null,
        targetBmiMax: targetBmiMax ? parseFloat(targetBmiMax) : null,
        // Create VideoTag records for each tagId
        tags: {
          create: tagIds.map(tagId => ({
            tagId,
          })),
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    // Step 13: Return created video with tags
    return NextResponse.json(
      {
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
          tags: video.tags.map(vt => ({
            id: vt.tag.id,
            name: vt.tag.name,
            color: vt.tag.color,
          })),
          createdAt: video.createdAt.toISOString().split("T")[0],
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating video:", error)
    return NextResponse.json({ error: "Failed to create video" }, { status: 500 })
  }
}

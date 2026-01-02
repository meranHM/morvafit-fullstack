// CONFIRM UPLOAD API ROUTE
// ============================================
// This endpoint is called after a successful direct S3 upload.
// It saves the video metadata to the database.
//
// POST /api/upload/confirm
// Body: { videoUrl, thumbnailUrl?, title, description?, level, category,
//         duration?, targetBmiMin?, targetBmiMax?, tagIds? }
// Returns: { video: VideoData }

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Allowed levels and categories (matching Prisma schema)
const ALLOWED_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"]
const ALLOWED_CATEGORIES = ["STRENGTH", "CARDIO", "FLEXIBILITY", "HIIT", "CORE", "FULL_BODY"]

export async function POST(request: NextRequest) {
  try {
    // STEP 1: Check authentication
    // Only logged-in admins can confirm video uploads
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // STEP 2: Parse and validate request body
    const body = await request.json()
    const {
      videoUrl,
      thumbnailUrl,
      title,
      description,
      level,
      category,
      duration,
      targetBmiMin,
      targetBmiMax,
      tagIds,
    } = body

    // STEP 3: Validate required fields
    if (!videoUrl) {
      return NextResponse.json({ error: "videoUrl is required" }, { status: 400 })
    }

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ error: "title is required" }, { status: 400 })
    }

    if (!level || !ALLOWED_LEVELS.includes(level)) {
      return NextResponse.json(
        { error: `level must be one of: ${ALLOWED_LEVELS.join(", ")}` },
        { status: 400 }
      )
    }

    if (!category || !ALLOWED_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: `category must be one of: ${ALLOWED_CATEGORIES.join(", ")}` },
        { status: 400 }
      )
    }

    // STEP 4: Validate optional fields
    // Duration should be a positive number (in seconds)
    let parsedDuration: number | null = null
    if (duration !== undefined && duration !== null && duration !== "") {
      parsedDuration = parseInt(duration, 10)
      if (isNaN(parsedDuration) || parsedDuration <= 0) {
        return NextResponse.json(
          { error: "duration must be a positive number (in seconds)" },
          { status: 400 }
        )
      }
    }

    // BMI values should be between 10 and 60
    let parsedBmiMin: number | null = null
    let parsedBmiMax: number | null = null

    if (targetBmiMin !== undefined && targetBmiMin !== null && targetBmiMin !== "") {
      parsedBmiMin = parseFloat(targetBmiMin)
      if (isNaN(parsedBmiMin) || parsedBmiMin < 10 || parsedBmiMin > 60) {
        return NextResponse.json(
          { error: "targetBmiMin must be between 10 and 60" },
          { status: 400 }
        )
      }
    }

    if (targetBmiMax !== undefined && targetBmiMax !== null && targetBmiMax !== "") {
      parsedBmiMax = parseFloat(targetBmiMax)
      if (isNaN(parsedBmiMax) || parsedBmiMax < 10 || parsedBmiMax > 60) {
        return NextResponse.json(
          { error: "targetBmiMax must be between 10 and 60" },
          { status: 400 }
        )
      }
    }

    // If both are set, min should be less than max
    if (parsedBmiMin !== null && parsedBmiMax !== null && parsedBmiMin > parsedBmiMax) {
      return NextResponse.json(
        { error: "targetBmiMin must be less than targetBmiMax" },
        { status: 400 }
      )
    }

    // STEP 5: Validate tagIds if provided
    // tagIds should be an array of valid tag IDs
    let validTagIds: string[] = []
    if (tagIds && Array.isArray(tagIds) && tagIds.length > 0) {
      // Verify all tags exist
      const existingTags = await prisma.tag.findMany({
        where: { id: { in: tagIds } },
        select: { id: true },
      })
      validTagIds = existingTags.map(t => t.id)
    }

    // STEP 6: Create the video record in database
    const video = await prisma.video.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        videoUrl,
        thumbnailUrl: thumbnailUrl || null,
        duration: parsedDuration,
        level,
        category,
        targetBmiMin: parsedBmiMin,
        targetBmiMax: parsedBmiMax,
        // Create tag associations if any tags provided
        tags:
          validTagIds.length > 0
            ? {
                create: validTagIds.map(tagId => ({
                  tagId,
                })),
              }
            : undefined,
      },
      // Include tags in response
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    // STEP 7: Format and return the created video
    return NextResponse.json({
      video: {
        id: video.id,
        title: video.title,
        description: video.description,
        videoUrl: video.videoUrl,
        thumbnailUrl: video.thumbnailUrl,
        duration: video.duration,
        level: video.level,
        category: video.category,
        targetBmiMin: video.targetBmiMin,
        targetBmiMax: video.targetBmiMax,
        tags: video.tags.map(vt => ({
          id: vt.tag.id,
          name: vt.tag.name,
          color: vt.tag.color,
        })),
        createdAt: video.createdAt.toISOString(),
      },
    })
  } catch (error) {
    console.error("Confirm upload error:", error)
    return NextResponse.json({ error: "Failed to save video metadata" }, { status: 500 })
  }
}

// PRESIGNED URL API ROUTE
// ============================================
// This endpoint generates presigned URLs for direct S3 uploads.
// Used for large files (videos) that can't go through the server.
//
// POST /api/upload/presigned-url
// Body: { fileName, contentType, folder, fileType }
// Returns: { uploadUrl, publicUrl, fileKey }

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { generatePresignedUploadUrl, generateUniqueFileName } from "@/lib/arvancloud"

// Allowed video MIME types
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"]

// Allowed image MIME types (for thumbnails)
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

export async function POST(request: NextRequest) {
  try {
    // STEP 1: Check authentication
    // Only logged-in admins can upload videos
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
    const { fileName, contentType, fileType } = body

    // fileName: original file name (e.g., "my-video.mp4")
    // contentType: MIME type (e.g., "video/mp4")
    // fileType: "video" or "thumbnail" - determines folder and validation

    if (!fileName || !contentType || !fileType) {
      return NextResponse.json(
        { error: "Missing required fields: fileName, contentType, fileType" },
        { status: 400 }
      )
    }

    // STEP 3: Validate file type based on fileType
    if (fileType === "video") {
      // Check if it's an allowed video type
      if (!ALLOWED_VIDEO_TYPES.includes(contentType)) {
        return NextResponse.json(
          { error: "Invalid video type. Allowed: MP4, WebM, MOV" },
          { status: 400 }
        )
      }
    } else if (fileType === "thumbnail") {
      // Check if it's an allowed image type
      if (!ALLOWED_IMAGE_TYPES.includes(contentType)) {
        return NextResponse.json(
          { error: "Invalid image type. Allowed: JPG, PNG, WebP" },
          { status: 400 }
        )
      }
    } else {
      return NextResponse.json(
        { error: "Invalid fileType. Allowed: video, thumbnail" },
        { status: 400 }
      )
    }

    // STEP 4: Generate unique filename
    // This prevents filename conflicts and adds timestamp
    const uniqueFileName = generateUniqueFileName(fileName)

    // STEP 5: Determine folder based on fileType
    // Videos go to "videos/" folder, thumbnails to "thumbnails/"
    const folder = fileType === "video" ? "videos" : "thumbnails"

    // STEP 6: Generate presigned URL
    // This URL allows direct upload to S3 for 1 hour
    const { uploadUrl, publicUrl, fileKey } = await generatePresignedUploadUrl({
      fileName: uniqueFileName,
      contentType,
      folder,
      expiresIn: 3600, // 1 hour - enough time for large uploads
    })

    // STEP 7: Return the presigned URL and related info
    return NextResponse.json({
      uploadUrl, // Client will PUT the file to this URL
      publicUrl, // The permanent public URL after upload
      fileKey, // The S3 key (path) of the file
    })
  } catch (error) {
    console.error("Presigned URL generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    )
  }
}

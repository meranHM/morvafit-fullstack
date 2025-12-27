// RECEIPT API ENDPOINT
// ============================================
// This endpoint manages user receipt uploads for payment verification
// GET - Fetches user's receipts
// POST - Uploads new receipt

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { uploadToS3, generateUniqueFileName } from "@/lib/arvancloud"

// GET HANDLER - Fetching User's Receipts
// ============================================
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized - Please log in" }, { status: 401 })
    }

    // Fetching receipts from database
    // Getting all receipts for this user, ordered by newest first
    const receipts = await prisma.receipt.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        imageUrl: true,
        amount: true,
        status: true,
        reviewedBy: true,
        reviewedAt: true,
        reviewNotes: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // Returning receipts
    return NextResponse.json({
      success: true,
      data: receipts,
      count: receipts.length,
    })
  } catch (error) {
    console.error("GET Receipts error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch receipts",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

// POST HANDLER - Upload Receipt
// ============================================
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized - Please log in" }, { status: 401 })
    }

    // Parsing form data (multipart/form-data)
    // Files are uploaded using FormData, not JSON
    const formData = await request.formData()

    // Getting the uploaded file
    const file = formData.get("file") as File | null
    // Getting the payment amount
    const amount = formData.get("amount") as string | null

    // Validating inputs
    // Checking if file was provided
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Checking if amount was provided
    if (!amount) {
      return NextResponse.json({ error: "Payment amount is required" }, { status: 400 })
    }

    // Validating amount is a number and positive
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 })
    }

    // Validating file type
    // Only allowimg images and PDFs for receipts
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Only JPG, PNG, WEBP, and PDF files are allowed.",
        },
        { status: 400 }
      )
    }

    // Validating file size
    // Maximum file size: 5MB (5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: "File too large. Maximum size is 5MB.",
        },
        { status: 400 }
      )
    }

    // Generating unique filename
    // Create a unique name to prevent conflicts
    // Format: timestamp-random-originalname.ext
    const uniqueFileName = generateUniqueFileName(file.name)

    // Uploading file to ArvanCloud S3
    console.log(`Uploading receipt for user ${session.user.id}...`)

    const imageUrl = await uploadToS3({
      file: Buffer.from(await file.arrayBuffer()),
      fileName: uniqueFileName,
      contentType: file.type,
      folder: "receipts", // Storing all receipts in "receipts/" folder
    })

    console.log(`Receipt uploaded successfully: ${imageUrl}`)

    // Saving receipt metadata to database
    const receipt = await prisma.receipt.create({
      data: {
        userId: session.user.id,
        imageUrl: imageUrl,
        amount: amountNum,
        // Status defaults to "PENDING" (from schema)
        // createdAt and updatedAt are set automatically
      },
    })

    // Returning success response
    return NextResponse.json(
      {
        success: true,
        message: "Receipt uploaded successfully! Waiting for admin approval.",
        data: {
          id: receipt.id,
          imageUrl: receipt.imageUrl,
          amount: receipt.amount,
          status: receipt.status,
          createdAt: receipt.createdAt,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    // ERROR HANDLING
    console.error("POST Receipt error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload receipt",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

// ============================================
// HOW TO USE THESE ENDPOINTS
// ============================================
//
// GET - Fetch receipts:
// GET /api/user/receipts
// Headers: Cookie with session token (automatic from NextAuth)
// Response: {
//   success: true,
//   data: [
//     { id: "...", imageUrl: "...", amount: 150, status: "PENDING", ... }
//   ],
//   count: 1
// }
//
// POST - Upload receipt:
// POST /api/user/receipts
// Headers:
//   - Cookie with session token (automatic from NextAuth)
//   - Content-Type: multipart/form-data
// Body (FormData):
//   - file: File (image or PDF, max 5MB)
//   - amount: "150" (payment amount in your currency)
//
// Response: {
//   success: true,
//   message: "Receipt uploaded successfully!",
//   data: { id: "...", imageUrl: "...", status: "PENDING", ... }
// }
//
// ============================================

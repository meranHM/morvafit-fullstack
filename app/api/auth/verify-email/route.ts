// ============================================
// EMAIL VERIFICATION API ENDPOINT
// ============================================
// This endpoint verifies a user's email when they click the magic link
// The magic link looks like: https://yoursite.com/verify-email?token=abc123
// The frontend page calls this API with the token from the URL
//
// Flow:
// 1. User clicks magic link in email
// 2. Frontend verify-email page extracts the token from URL
// 3. Frontend calls this API: GET /api/auth/verify-email?token=abc123
// 4. This API validates the token and marks email as verified
// 5. Returns success/error to frontend

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/verification"

// ============================================
// GET HANDLER - Verify Email Token
// ============================================
// GET /api/auth/verify-email?token=abc123
export async function GET(request: Request) {
  try {
    // ============================================
    // STEP 1: Get the token from URL query parameters
    // ============================================
    // The URL looks like: /api/auth/verify-email?token=abc123
    // We need to extract the "token" parameter
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    // ============================================
    // STEP 2: Validate token was provided
    // ============================================
    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 } // 400 = Bad Request
      )
    }

    // ============================================
    // STEP 3: Verify the token using our utility
    // ============================================
    // verifyToken() does:
    // - Finds the token in database
    // - Checks if it's expired (24 hours)
    // - Deletes the token (one-time use)
    // - Returns the email if valid, null if invalid
    const email = await verifyToken(token)

    // ============================================
    // STEP 4: Check if token was valid
    // ============================================
    if (!email) {
      // Token was invalid or expired
      return NextResponse.json(
        { error: "Invalid or expired verification token. Please request a new verification email." },
        { status: 400 }
      )
    }

    // ============================================
    // STEP 5: Update user's emailVerified field
    // ============================================
    // This marks the user's email as verified
    // We store the current timestamp so we know when they verified
    const user = await prisma.user.update({
      where: { email },
      data: {
        emailVerified: new Date(), // Set to current timestamp
      },
    })

    // ============================================
    // STEP 6: Return success
    // ============================================
    // Frontend will use this to show success message and redirect
    return NextResponse.json({
      success: true,
      message: "Email verified successfully! You can now access all features.",
      user: {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
      },
    })
  } catch (error) {
    // ============================================
    // ERROR HANDLING
    // ============================================
    console.error("Email verification error:", error)

    return NextResponse.json(
      {
        error: "Failed to verify email. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 } // 500 = Internal Server Error
    )
  }
}

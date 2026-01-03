// ============================================
// RESEND VERIFICATION EMAIL API ENDPOINT
// ============================================
// This endpoint resends the verification email to a logged-in user
// Used when user didn't receive the email or it expired
//
// Flow:
// 1. User logs in but hasn't verified their email
// 2. User sees a banner saying "Please verify your email"
// 3. User clicks "Resend verification email" button
// 4. Frontend calls this API: POST /api/auth/resend-verification
// 5. This API creates a new token and sends a new email

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createVerificationToken } from "@/lib/verification"
import { sendVerificationEmail } from "@/lib/email"

// ============================================
// POST HANDLER - Resend Verification Email
// ============================================
// POST /api/auth/resend-verification
// No body required - we get the user from the session
export async function POST() {
  try {
    // ============================================
    // STEP 1: Get the current user's session
    // ============================================
    // getServerSession checks if user is logged in
    // authOptions comes from our auth configuration
    const session = await getServerSession(authOptions)

    // ============================================
    // STEP 2: Check if user is logged in
    // ============================================
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to resend verification email" },
        { status: 401 } // 401 = Unauthorized
      )
    }

    // ============================================
    // STEP 3: Get user from database
    // ============================================
    // We need to check their verification status
    // and get their email and name for the verification email
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        email: true,
        name: true,
        emailVerified: true,
      },
    })

    // ============================================
    // STEP 4: Check if user exists
    // ============================================
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 } // 404 = Not Found
      )
    }

    // ============================================
    // STEP 5: Check if email is already verified
    // ============================================
    // No need to send another email if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Your email is already verified" },
        { status: 400 } // 400 = Bad Request
      )
    }

    // ============================================
    // STEP 6: Generate a new verification token
    // ============================================
    // createVerificationToken() does:
    // - Creates a random 64-character token
    // - Deletes any old tokens for this email
    // - Saves new token with 24-hour expiration
    const token = await createVerificationToken(user.email)

    // ============================================
    // STEP 7: Send the verification email
    // ============================================
    const emailResult = await sendVerificationEmail({
      email: user.email,
      token,
      name: user.name || undefined,
    })

    // ============================================
    // STEP 8: Check if email was sent successfully
    // ============================================
    if (!emailResult.success) {
      return NextResponse.json(
        { error: "Failed to send verification email. Please try again later." },
        { status: 500 } // 500 = Server Error
      )
    }

    // ============================================
    // STEP 9: Return success
    // ============================================
    return NextResponse.json({
      success: true,
      message: "Verification email sent! Please check your inbox.",
    })
  } catch (error) {
    // ============================================
    // ERROR HANDLING
    // ============================================
    console.error("Resend verification error:", error)

    return NextResponse.json(
      {
        error: "Failed to resend verification email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

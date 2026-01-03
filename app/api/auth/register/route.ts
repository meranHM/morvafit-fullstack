// ============================================
// USER REGISTRATION API ENDPOINT
// ============================================
// This endpoint allows new users to create an account
// After creating the account, we send a verification email

import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { createVerificationToken } from "@/lib/verification"
import { sendVerificationEmail } from "@/lib/email"

// POST HANDLER - Registering a New User
// ============================================
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Validating email format (basic at the moment, will update later)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validating password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hashing the password
    const hashedPassword = await hash(password, 12)

    // Creating user in database
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name || null, // Optional name field
        // role defaults to "USER" (from schema)
        // isBlocked defaults to false (from schema)
        // emailVerified stays null until they verify
        // createdAt and updatedAt set automatically
      },
    })

    // Sending verification email
    // Generating a verification token for this new user
    // This token will be included in the magic link URL
    const verificationToken = await createVerificationToken(user.email)

    // Send the verification email with the magic link
    // Even if this fails, we still created the account successfully
    // User can request a new verification email later
    const emailResult = await sendVerificationEmail({
      email: user.email,
      token: verificationToken,
      name: user.name || undefined,
    })

    // Log if email failed (but we don't fail the registration)
    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error)
    }

    return NextResponse.json(
      {
        success: true,
        message: "Account created! Please check your email to verify your account.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        // Letting frontend know if verification email was sent
        verificationEmailSent: emailResult.success,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)

    return NextResponse.json(
      {
        error: "An error occurred during registration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

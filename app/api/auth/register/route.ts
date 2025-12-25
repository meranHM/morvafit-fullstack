// ============================================
// USER REGISTRATION API ENDPOINT
// ============================================
// This endpoint allows new users to create an account
// POST /api/auth/register

import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"

// ============================================
// POST HANDLER - Registering a New User
// ============================================
export async function POST(request: Request) {
  try {
    // ============================================
    // STEP 1: Getting data from request body
    // ============================================
    const body = await request.json()
    const { email, password, name } = body

    // ============================================
    // STEP 2: Validating required fields
    // ============================================
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // ============================================
    // STEP 3: Validating email format (basic at the moment, will update later)
    // ============================================
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // ============================================
    // STEP 4: Validate password strength
    // ============================================
    // Require at least 8 characters
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      )
    }

    // ============================================
    // STEP 5: Check if user already exists
    // ============================================
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(), // Storing emails in lowercase for consistency
      },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 }) // 409 = Conflict
    }

    // ============================================
    // STEP 6: Hashing the password
    // ============================================
    // hash() creates a one-way encrypted version
    // The number 12 is the "salt rounds" - higher = more secure but slower
    const hashedPassword = await hash(password, 12)

    // ============================================
    // STEP 7: Creating user in database
    // ============================================
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name || null, // Optional name field
        // role defaults to "USER" (from schema)
        // isBlocked defaults to false (from schema)
        // createdAt and updatedAt set automatically
      },
    })

    // ============================================
    // STEP 8: Returning success (we don't send the password!)
    // ============================================
    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully!",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 } // 201 = Created
    )
  } catch (error) {
    // ============================================
    // ERROR HANDLING
    // ============================================
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

// ============================================
// HOW TO USE THIS ENDPOINT
// ============================================
//
// We send a POST request to: /api/auth/register
//
// Request body (JSON):
// {
//   "email": "user@example.com",
//   "password": "securepassword123",
//   "name": "John Doe" (optional)
// }
//
// Success response (201):
// {
//   "success": true,
//   "message": "Account created successfully!",
//   "user": {
//     "id": "clx...",
//     "email": "user@example.com",
//     "name": "John Doe",
//     "role": "USER"
//   }
// }
//
// Error responses:
// - 400: Invalid input (missing fields, invalid email, weak password)
// - 409: Email already exists
// - 500: Server error
// ============================================

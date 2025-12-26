// ============================================
// BODY INFO API ENDPOINT
// ============================================
// This endpoint manages user's body information (height, weight, BMI, fitness goals)
// GET - Fetch user's body info
// POST - Create or update body info

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// ============================================
// HELPER FUNCTION: Calculating BMI
// ============================================
// BMI Formula: weight (kg) / (height (m))²
// Example: 70kg / (1.75m)² = 22.86
function calculateBMI(weight: number, height: number): number {
  // Converting height from centimeters to meters
  const heightInMeters = height / 100

  // Calculating BMI
  const bmi = weight / (heightInMeters * heightInMeters)

  // Rounding to 2 decimal places
  return Math.round(bmi * 100) / 100
}

// ============================================
// GET HANDLER - Fetching User's Body Info
// ============================================
export async function GET() {
  try {
    // ============================================
    // STEP 1: Checking authentication
    // ============================================
    // Get the current user's session
    const session = await getServerSession(authOptions)

    // If user is not logged in, return 401 Unauthorized
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized - Please log in" }, { status: 401 })
    }

    // ============================================
    // STEP 2: Fetching body info from database
    // ============================================
    // Finding the body info for this specific user
    const bodyInfo = await prisma.bodyInfo.findUnique({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        height: true,
        weight: true,
        bmi: true,
        goal: true,
        activityLevel: true,
        healthConditions: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // ============================================
    // STEP 3: Returning response
    // ============================================
    // If no body info exists yet, we return null
    if (!bodyInfo) {
      return NextResponse.json({
        success: true,
        data: null,
        message: "No body info found. Please create one.",
      })
    }

    // Returning the body info
    return NextResponse.json({
      success: true,
      data: bodyInfo,
    })
  } catch (error) {
    // ============================================
    // ERROR HANDLING
    // ============================================
    console.error("GET Body Info error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch body info",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

// ============================================
// POST HANDLER - Creating or Updating Body Info
// ============================================
export async function POST(request: Request) {
  try {
    // ============================================
    // STEP 1: Checking authentication
    // ============================================
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized - Please log in" }, { status: 401 })
    }

    // ============================================
    // STEP 2: Getting data from request body
    // ============================================
    const body = await request.json()
    const { height, weight, goal, activityLevel, healthConditions } = body

    // ============================================
    // STEP 3: Validating required fields
    // ============================================
    if (!height || !weight || !goal || !activityLevel) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["height", "weight", "goal", "activityLevel"],
        },
        { status: 400 }
      )
    }

    // ============================================
    // STEP 4: Validating data types and ranges
    // ============================================
    // Height should be between 100cm and 250cm
    if (typeof height !== "number" || height < 100 || height > 250) {
      return NextResponse.json(
        { error: "Height must be a number between 100 and 250 cm" },
        { status: 400 }
      )
    }

    // Weight should be between 30kg and 300kg
    if (typeof weight !== "number" || weight < 30 || weight > 300) {
      return NextResponse.json(
        { error: "Weight must be a number between 30 and 300 kg" },
        { status: 400 }
      )
    }

    // Validating goal enum
    const validGoals = ["WEIGHT_LOSS", "MUSCLE_GAIN", "GENERAL_FITNESS", "STRENGTH", "ENDURANCE"]
    if (!validGoals.includes(goal)) {
      return NextResponse.json(
        { error: "Invalid goal. Must be one of: " + validGoals.join(", ") },
        { status: 400 }
      )
    }

    // Validating activity level enum
    const validActivityLevels = ["SEDENTARY", "LIGHT", "MODERATE", "ACTIVE", "VERY_ACTIVE"]
    if (!validActivityLevels.includes(activityLevel)) {
      return NextResponse.json(
        { error: "Invalid activity level. Must be one of: " + validActivityLevels.join(", ") },
        { status: 400 }
      )
    }

    // ============================================
    // STEP 5: Calculating BMI
    // ============================================
    const bmi = calculateBMI(weight, height)

    // ============================================
    // STEP 6: Creating or update body info
    // ============================================
    // Using upsert: if body info exists, update it; otherwise, create a new one
    const bodyInfo = await prisma.bodyInfo.upsert({
      where: {
        userId: session.user.id,
      },
      // If body info exists, update these fields
      update: {
        height,
        weight,
        bmi,
        goal,
        activityLevel,
        healthConditions: healthConditions || null,
        // updatedAt will be set automatically by Prisma
      },
      // If body info doesn't exist, create with these fields
      create: {
        userId: session.user.id,
        height,
        weight,
        bmi,
        goal,
        activityLevel,
        healthConditions: healthConditions || null,
        // createdAt and updatedAt will be set automatically
      },
    })

    // ============================================
    // STEP 7: Returning success response
    // ============================================
    return NextResponse.json(
      {
        success: true,
        message: "Body info saved successfully!",
        data: {
          id: bodyInfo.id,
          height: bodyInfo.height,
          weight: bodyInfo.weight,
          bmi: bodyInfo.bmi,
          goal: bodyInfo.goal,
          activityLevel: bodyInfo.activityLevel,
          healthConditions: bodyInfo.healthConditions,
          updatedAt: bodyInfo.updatedAt,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    // ============================================
    // ERROR HANDLING
    // ============================================
    console.error("POST Body Info error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to save body info",
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
// GET - Fetch body info:
// GET /api/user/body-info
// Headers: Cookie with session token (automatic from NextAuth)
// Response: { success: true, data: { height, weight, bmi, ... } }
//
// POST - Create/Update body info:
// POST /api/user/body-info
// Headers: Cookie with session token (automatic from NextAuth)
// Body: {
//   "height": 175,           // in cm (required)
//   "weight": 70,            // in kg (required)
//   "goal": "WEIGHT_LOSS",   // required
//   "activityLevel": "MODERATE", // required
//   "healthConditions": "None" // optional
// }
// Response: { success: true, message: "Body info saved!", data: {...} }
//
// ============================================

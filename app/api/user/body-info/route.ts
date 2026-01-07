// ============================================
// BODY INFO API ENDPOINT
// ============================================
// This endpoint manages user's body information
// GET - Fetch user's body info
// POST - Create or update body info

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
  Gender,
  PrimaryGoal,
  ActivityLevel,
  ExperienceLevel,
  WorkoutDays,
  PreferredTime,
  SessionDurations,
  DietaryPreference,
} from "@prisma/client"

// ENUM MAPPING HELPERS
// ============================================
// These functions convert form values to database enum values
// Form uses user-friendly strings, database uses SCREAMING_CASE enums

// Mapping gender from form ("male", "female") to database enum
function mapGender(value: string): Gender {
  const mapping: Record<string, Gender> = {
    male: Gender.MALE,
    female: Gender.FEMALE,
  }
  return mapping[value.toLowerCase()] || Gender.MALE
}

// Mapping primary goal from form ("Weight Loss") to database enum
function mapPrimaryGoal(value: string): PrimaryGoal {
  const mapping: Record<string, PrimaryGoal> = {
    "weight loss": PrimaryGoal.WEIGHT_LOSS,
    "muscle gain": PrimaryGoal.MUSCLE_GAIN,
    endurance: PrimaryGoal.ENDURANCE,
    "general fitness": PrimaryGoal.GENERAL_FITNESS,
    "athletic performance": PrimaryGoal.STRENGTH,
    flexibility: PrimaryGoal.GENERAL_FITNESS,
  }
  return mapping[value.toLowerCase()] || PrimaryGoal.GENERAL_FITNESS
}

// Mapping activity level from form ("sedentary") to database enum
function mapActivityLevel(value: string): ActivityLevel {
  const mapping: Record<string, ActivityLevel> = {
    sedentary: ActivityLevel.SEDENTARY,
    light: ActivityLevel.LIGHT,
    moderate: ActivityLevel.MODERATE,
    very: ActivityLevel.ACTIVE,
    extra: ActivityLevel.VERY_ACTIVE,
  }
  return mapping[value.toLowerCase()] || ActivityLevel.MODERATE
}

// Mapping experience level from form ("Beginner") to database enum
function mapExperienceLevel(value: string): ExperienceLevel {
  const mapping: Record<string, ExperienceLevel> = {
    beginner: ExperienceLevel.BEGINNER,
    intermediate: ExperienceLevel.INTERMEDIATE,
    advanced: ExperienceLevel.ADVANCED,
  }
  return mapping[value.toLowerCase()] || ExperienceLevel.BEGINNER
}

// Mapping workout days from form (["Mon", "Tue"]) to database enums
function mapWorkoutDays(days: string[]): WorkoutDays[] {
  const mapping: Record<string, WorkoutDays> = {
    mon: WorkoutDays.MON,
    tue: WorkoutDays.TUE,
    wed: WorkoutDays.WED,
    thu: WorkoutDays.THU,
    fri: WorkoutDays.FRI,
    sat: WorkoutDays.SAT,
    sun: WorkoutDays.SUN,
  }
  return days.map(day => mapping[day.toLowerCase()] || WorkoutDays.MON)
}

// Mapping preferred time from form ("Morning (6-11am)") to database enum
function mapPreferredTime(value: string): PreferredTime {
  // Extracting the time of day from strings like "Morning (6-11am)"
  const timeOfDay = value.toLowerCase().split(" ")[0]
  const mapping: Record<string, PreferredTime> = {
    morning: PreferredTime.MORNING,
    afternoon: PreferredTime.AFTERNOON,
    evening: PreferredTime.EVENING,
  }
  return mapping[timeOfDay] || PreferredTime.MORNING
}

// Mapping session duration from form ("30 min") to database enum
function mapSessionDuration(value: string): SessionDurations {
  const mapping: Record<string, SessionDurations> = {
    "30 min": SessionDurations.MIN_30,
    "45 min": SessionDurations.MIN_45,
    "60 min": SessionDurations.MIN_60,
    "90 min": SessionDurations.MIN_90,
  }
  return mapping[value] || SessionDurations.MIN_45
}

// Mapping dietary preference from form ("No Restrictions") to database enum
function mapDietaryPreference(value: string): DietaryPreference {
  const mapping: Record<string, DietaryPreference> = {
    "no restrictions": DietaryPreference.NO_RESTRICTIONS,
    vegetarian: DietaryPreference.VEGETARIAN,
    vegan: DietaryPreference.VEGAN,
    keto: DietaryPreference.KETO,
    paleo: DietaryPreference.PALEO,
    mediterranean: DietaryPreference.MEDITERRANEAN,
  }
  return mapping[value.toLowerCase()] || DietaryPreference.NO_RESTRICTIONS
}

// HELPER FUNCTION: Calculating BMI
// ============================================
// BMI Formula: weight (kg) / (height (m))²
// Example: 70kg / (1.75m)² = 22.86
function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100

  const bmi = weight / (heightInMeters * heightInMeters)

  return Math.round(bmi * 100) / 100
}

// GET HANDLER - Fetching User's Body Info
// ============================================
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized - Please log in" }, { status: 401 })
    }

    const bodyInfo = await prisma.bodyInfo.findUnique({
      where: {
        userId: session.user.id,
      },
      // Selecting all fields we need
      select: {
        id: true,
        age: true,
        gender: true,
        height: true,
        weight: true,
        targetWeight: true,
        primaryGoal: true,
        activityLevel: true,
        experienceLevel: true,
        workoutDays: true,
        preferredTime: true,
        sessionDuration: true,
        dietaryPreference: true,
        allergies: true,
        medicalConditions: true,
        injuries: true,
        motivation: true,
        challenges: true,
        bmi: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!bodyInfo) {
      return NextResponse.json({
        success: true,
        data: null,
        message: "No body info found. Please create one.",
      })
    }

    return NextResponse.json({
      success: true,
      data: bodyInfo,
    })
  } catch (error) {
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

// POST HANDLER - Creating or Updating Body Info
// ============================================
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized - Please log in" }, { status: 401 })
    }
    const body = await request.json()

    // Destructuring all fields from the form
    const {
      age,
      gender,
      height,
      weight,
      targetWeight,
      primaryGoal,
      activityLevel,
      experienceLevel,
      workoutDays,
      preferredTime,
      sessionDuration,
      dietaryPreference,
      allergies,
      medicalConditions,
      injuries,
      motivation,
      challenges,
    } = body

    // Validating required fields
    const requiredFields = [
      "age",
      "gender",
      "height",
      "weight",
      "targetWeight",
      "primaryGoal",
      "activityLevel",
      "experienceLevel",
      "workoutDays",
      "preferredTime",
      "sessionDuration",
      "dietaryPreference",
      "motivation",
    ]

    // Checking each required field
    const missingFields: string[] = []
    for (const field of requiredFields) {
      const value = body[field]
      // workoutDays is an array, so we check length
      if (field === "workoutDays") {
        if (!Array.isArray(value) || value.length === 0) {
          missingFields.push(field)
        }
      } else if (!value || value.toString().trim() === "") {
        missingFields.push(field)
      }
    }

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          missingFields,
        },
        { status: 400 }
      )
    }

    // Validating data types and ranges
    // Converting string values to numbers
    const ageNum = parseInt(age, 10)
    const heightNum = parseFloat(height)
    const weightNum = parseFloat(weight)
    const targetWeightNum = parseFloat(targetWeight)

    if (isNaN(ageNum) || ageNum < 13 || ageNum > 100) {
      return NextResponse.json({ error: "Age must be between 13 and 100" }, { status: 400 })
    }

    if (isNaN(heightNum) || heightNum < 100 || heightNum > 250) {
      return NextResponse.json(
        { error: "Height must be a number between 100 and 250 cm" },
        { status: 400 }
      )
    }

    if (isNaN(weightNum) || weightNum < 30 || weightNum > 300) {
      return NextResponse.json(
        { error: "Weight must be a number between 30 and 300 kg" },
        { status: 400 }
      )
    }

    if (isNaN(targetWeightNum) || targetWeightNum < 30 || targetWeightNum > 300) {
      return NextResponse.json(
        { error: "Target weight must be a number between 30 and 300 kg" },
        { status: 400 }
      )
    }

    // Mapping form values to database enums
    // ============================================
    // Converting user-friendly form values to database enum values
    const mappedData = {
      age: ageNum,
      gender: mapGender(gender),
      height: heightNum,
      weight: weightNum,
      targetWeight: targetWeightNum,
      primaryGoal: mapPrimaryGoal(primaryGoal),
      activityLevel: mapActivityLevel(activityLevel),
      experienceLevel: mapExperienceLevel(experienceLevel),
      workoutDays: mapWorkoutDays(workoutDays),
      preferredTime: mapPreferredTime(preferredTime),
      sessionDuration: mapSessionDuration(sessionDuration),
      dietaryPreference: mapDietaryPreference(dietaryPreference),
      // Optional string fields - we use null if empty
      allergies: allergies?.trim() || null,
      medicalConditions: medicalConditions?.trim() || null,
      injuries: injuries?.trim() || null,
      motivation: motivation.trim(),
      challenges: challenges?.trim() || null,
    }

    const bmi = calculateBMI(weightNum, heightNum)

    // Creating or updating body info in database
    // ============================================
    // Using upsert: if body info exists, update it; otherwise, create a new one
    const bodyInfo = await prisma.bodyInfo.upsert({
      where: {
        userId: session.user.id,
      },
      // If body info exists, update with new values
      update: {
        ...mappedData,
        bmi,
        // updatedAt will be set automatically by Prisma
      },
      // If body info doesn't exist, create with these fields
      create: {
        userId: session.user.id,
        ...mappedData,
        bmi,
        // createdAt and updatedAt will be set automatically
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: "Body info saved successfully!",
        data: {
          id: bodyInfo.id,
          age: bodyInfo.age,
          gender: bodyInfo.gender,
          height: bodyInfo.height,
          weight: bodyInfo.weight,
          targetWeight: bodyInfo.targetWeight,
          bmi: bodyInfo.bmi,
          primaryGoal: bodyInfo.primaryGoal,
          activityLevel: bodyInfo.activityLevel,
          experienceLevel: bodyInfo.experienceLevel,
          workoutDays: bodyInfo.workoutDays,
          preferredTime: bodyInfo.preferredTime,
          sessionDuration: bodyInfo.sessionDuration,
          dietaryPreference: bodyInfo.dietaryPreference,
          updatedAt: bodyInfo.updatedAt,
        },
      },
      { status: 200 }
    )
  } catch (error) {
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

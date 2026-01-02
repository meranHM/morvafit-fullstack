// Admin Health Forms API
// This endpoint returns all body info forms for admin review

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

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
    // Step 3: Fetch all body info forms with user info
    const forms = await prisma.bodyInfo.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Step 4: Format forms for frontend
    const formattedForms = forms.map(form => ({
      id: form.id,
      userId: form.userId,
      clientName: form.user.name || form.user.email,
      clientEmail: form.user.email,
      submittedDate: form.createdAt.toISOString().split("T")[0],
      // Physical info
      age: form.age,
      gender: form.gender,
      height: `${form.height}cm`,
      weight: `${form.weight}kg`,
      targetWeight: `${form.targetWeight}kg`,
      bmi: form.bmi.toFixed(1),
      // Goals and fitness
      goal: form.primaryGoal.replace("_", " "),
      activityLevel: form.activityLevel.replace("_", " "),
      experienceLevel: form.experienceLevel,
      workoutDays: form.workoutDays,
      preferredTime: form.preferredTime,
      sessionDuration: form.sessionDuration.replace("MIN_", "") + " min",
      // Diet and health
      dietaryPreference: form.dietaryPreference.replace("_", " "),
      allergies: form.allergies,
      medicalConditions: form.medicalConditions,
      injuries: form.injuries,
      // Motivation
      motivation: form.motivation,
      challenges: form.challenges,
    }))

    return NextResponse.json({ forms: formattedForms })
  } catch (error) {
    console.error("Error fetching health forms:", error)
    return NextResponse.json({ error: "Failed to fetch health forms" }, { status: 500 })
  }
}

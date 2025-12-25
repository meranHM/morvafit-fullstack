import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const userCount = await prisma.user.count()

    return NextResponse.json({
      success: true,
      users: userCount,
    })
  } catch (error) {
    console.error("Error counting users", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user count",
      },
      { status: 500 }
    )
  }
}

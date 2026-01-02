// Admin Tags API
// This endpoint handles tag listing and creation for video categorization

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// GET - List all tags with video count
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
    // Step 3: Fetch all tags with video count
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { videos: true },
        },
      },
    })

    // Step 4: Format tags for frontend
    const formattedTags = tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      color: tag.color,
      videoCount: tag._count.videos,
      createdAt: tag.createdAt.toISOString(),
    }))

    return NextResponse.json({ tags: formattedTags })
  } catch (error) {
    console.error("Error fetching tags:", error)
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 })
  }
}

// POST - Create a new tag
export async function POST(request: NextRequest) {
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
    // Step 3: Parse request body
    const body = await request.json()
    const { name, color } = body

    // Step 4: Validate required fields
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Tag name is required" }, { status: 400 })
    }

    // Step 5: Validate color format if provided (hex color)
    if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
      return NextResponse.json(
        { error: "Invalid color format. Use hex color like #FF5733" },
        { status: 400 }
      )
    }

    // Step 6: Check if tag name already exists
    const existingTag = await prisma.tag.findUnique({
      where: { name: name.trim() },
    })

    if (existingTag) {
      return NextResponse.json({ error: "Tag with this name already exists" }, { status: 409 })
    }

    // Step 7: Create tag in database
    const tag = await prisma.tag.create({
      data: {
        name: name.trim(),
        color: color || null,
      },
    })

    // Step 8: Return created tag
    return NextResponse.json(
      {
        tag: {
          id: tag.id,
          name: tag.name,
          color: tag.color,
          videoCount: 0,
          createdAt: tag.createdAt.toISOString(),
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating tag:", error)
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 })
  }
}

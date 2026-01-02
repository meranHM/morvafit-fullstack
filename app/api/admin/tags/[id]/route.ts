// Admin Single Tag API
// This endpoint handles update and delete for a specific tag

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// PATCH - Update a tag
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    // Step 3: Get the tag ID from params
    const { id } = await params

    // Step 4: Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id },
    })

    if (!existingTag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 })
    }

    // Step 5: Parse request body
    const body = await request.json()
    const { name, color } = body

    // Step 6: Validate name if provided
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json({ error: "Tag name cannot be empty" }, { status: 400 })
      }

      // Check if name is already taken by another tag
      const tagWithSameName = await prisma.tag.findUnique({
        where: { name: name.trim() },
      })

      if (tagWithSameName && tagWithSameName.id !== id) {
        return NextResponse.json({ error: "Tag with this name already exists" }, { status: 409 })
      }
    }

    // Step 7: Validate color format if provided
    if (color !== undefined && color !== null && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
      return NextResponse.json(
        { error: "Invalid color format. Use hex color like #FF5733" },
        { status: 400 }
      )
    }

    // Step 8: Build update data
    const updateData: { name?: string; color?: string | null } = {}
    if (name !== undefined) updateData.name = name.trim()
    if (color !== undefined) updateData.color = color || null

    // Step 9: Update tag in database
    const updatedTag = await prisma.tag.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { videos: true },
        },
      },
    })

    // Step 10: Return updated tag
    return NextResponse.json({
      tag: {
        id: updatedTag.id,
        name: updatedTag.name,
        color: updatedTag.color,
        videoCount: updatedTag._count.videos,
        createdAt: updatedTag.createdAt.toISOString(),
      },
    })
  } catch (error) {
    console.error("Error updating tag:", error)
    return NextResponse.json({ error: "Failed to update tag" }, { status: 500 })
  }
}

// DELETE - Delete a tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    // Step 3: Get the tag ID from params
    const { id } = await params

    // Step 4: Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id },
    })

    if (!existingTag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 })
    }

    // Step 5: Delete tag (VideoTag records will cascade delete automatically)
    await prisma.tag.delete({
      where: { id },
    })

    // Step 6: Return success response
    return NextResponse.json({ message: "Tag deleted successfully" })
  } catch (error) {
    console.error("Error deleting tag:", error)
    return NextResponse.json({ error: "Failed to delete tag" }, { status: 500 })
  }
}

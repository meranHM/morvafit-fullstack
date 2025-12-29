import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import WorkoutsTab from "@/components/dashboard/WorkoutsTab"

export default async function DashboardWorkoutPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user.id) {
    redirect("/login")
  }

  // Fetch all video assignments for this user, including video details
  const videoAssignments = await prisma.videoAssignment.findMany({
    where: { userId: session.user.id },
    orderBy: { assignedAt: "desc" },
    select: {
      id: true,
      assignedAt: true,
      completed: true,
      video: {
        select: {
          id: true,
          title: true,
          description: true,
          thumbnailUrl: true,
          duration: true,
          level: true,
          category: true,
        },
      },
    },
  })

  // Transform the data into a format the component expects
  // duration is stored in seconds, convert to "X min" format
  const videos = videoAssignments.map(assignment => ({
    id: assignment.video.id,
    title: assignment.video.title,
    duration: assignment.video.duration
      ? `${Math.round(assignment.video.duration / 60)} min`
      : "N/A",
    level: formatEnumValue(assignment.video.level),
    thumbnail: assignment.video.thumbnailUrl || "/thumb-placeholder.jpg",
    assignedDate: assignment.assignedAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    completed: assignment.completed,
  }))

  return <WorkoutsTab videos={videos} />
}

// Helper function to format enum values for display
// Converts "BEGINNER" -> "Beginner", "FULL_BODY" -> "Full Body"
function formatEnumValue(value: string): string {
  return value
    .split("_")
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ")
}

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import OverviewTab from "@/components/dashboard/OverviewTab"

export default async function DashboardOverviewPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user.id) {
    redirect("/login")
  }

  // Fetching user data along with ALL video assignments (for stats) and receipts
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      // Getting ALL video assignments to calculate stats
      videoAssignments: {
        orderBy: { assignedAt: "desc" },
        select: {
          id: true,
          assignedAt: true,
          completed: true,
          video: {
            select: {
              id: true,
              title: true,
              duration: true, // Duration in seconds
              level: true,
              thumbnailUrl: true,
            },
          },
        },
      },
      // Getting latest approved receipt for payment status
      receipts: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true },
      },
    },
  })

  if (!user) {
    redirect("/login")
  }

  // Transforming video assignments into the format the component expects
  const videos = user.videoAssignments.map(assignment => ({
    id: assignment.video.id,
    title: assignment.video.title,
    duration: assignment.video.duration
      ? `${Math.round(assignment.video.duration / 60)} min`
      : "N/A",
    durationSeconds: assignment.video.duration || 0, // Keep raw seconds for stats calculation
    level: formatEnumValue(assignment.video.level),
    thumbnail: assignment.video.thumbnailUrl || "/thumb-placeholder.jpg",
    assignedDate: assignment.assignedAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    completed: assignment.completed,
  }))

  // Calculate stats from real data
  const completedWorkouts = videos.filter(v => v.completed)
  const workoutsCompleted = completedWorkouts.length
  const totalAssigned = videos.length

  // Calculate total hours from completed workouts (duration is in seconds)
  const totalSeconds = completedWorkouts.reduce((sum, v) => sum + v.durationSeconds, 0)
  const totalHours = (totalSeconds / 3600).toFixed(1) // Convert seconds to hours

  // Calculating next payment status
  const lastApprovedReceipt = user.receipts[0]
  const nextPayment = lastApprovedReceipt
    ? `Last: ${lastApprovedReceipt.createdAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`
    : "No payments yet"

  // Counting new (incomplete) workouts for the "Continue Your Journey" section
  const newWorkoutsCount = videos.filter(v => !v.completed).length

  // Only pass the 3 most recent videos for the Recent Workouts display
  const recentVideos = videos.slice(0, 3)

  // Stats object with real data where available
  const stats = {
    workoutsCompleted,
    totalAssigned,
    totalHours,
  }

  return (
    <OverviewTab
      name={user.name ?? "Anonymous"}
      nextPayment={nextPayment}
      videos={recentVideos}
      newWorkoutsCount={newWorkoutsCount}
      stats={stats}
    />
  )
}

// Helper function to format enum values for display
function formatEnumValue(value: string): string {
  return value
    .split("_")
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ")
}

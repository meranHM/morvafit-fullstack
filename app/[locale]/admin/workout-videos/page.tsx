import { prisma } from "@/lib/prisma"
import WorkoutVideosTab from "@/components/admin/WorkoutVideosTab"

// Type for video data passed to component
export type VideoData = {
  id: string
  title: string
  description: string | null
  videoUrl: string
  thumbnailUrl: string | null
  duration: string | null
  durationSeconds: number | null
  level: string
  category: string
  targetBmiMin: number | null
  targetBmiMax: number | null
  assignedCount: number
  tags: TagData[]
  createdAt: string
}

// Type for tag data
export type TagData = {
  id: string
  name: string
  color: string | null
}

export default async function AdminPanelVideosPage() {
  // Fetch all videos with assignment count and tags
  const videos = await prisma.video.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { assignments: true },
      },
      // Include tags via the junction table
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })

  // Fetch all tags for filter dropdown
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
  })

  // Format tags for frontend
  const formattedTags: TagData[] = tags.map(tag => ({
    id: tag.id,
    name: tag.name,
    color: tag.color,
  }))

  // Format videos for frontend
  const formattedVideos: VideoData[] = videos.map(video => ({
    id: video.id,
    title: video.title,
    description: video.description,
    videoUrl: video.videoUrl,
    thumbnailUrl: video.thumbnailUrl,
    // Format duration as "X min"
    duration: video.duration ? `${Math.round(video.duration / 60)} min` : null,
    durationSeconds: video.duration,
    level: video.level,
    category: video.category,
    targetBmiMin: video.targetBmiMin,
    targetBmiMax: video.targetBmiMax,
    assignedCount: video._count.assignments,
    // Map tags from junction table
    tags: video.tags.map(vt => ({
      id: vt.tag.id,
      name: vt.tag.name,
      color: vt.tag.color,
    })),
    createdAt: video.createdAt.toISOString().split("T")[0],
  }))

  return <WorkoutVideosTab videos={formattedVideos} tags={formattedTags} />
}

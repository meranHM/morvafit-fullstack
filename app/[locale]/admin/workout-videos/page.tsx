import { prisma } from "@/lib/prisma"
import WorkoutVideosTab from "@/components/admin/WorkoutVideosTab"

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

export type TagData = {
  id: string
  name: string
  color: string | null
}

export default async function AdminPanelVideosPage() {
  // Fetching all videos with assignment count and tags
  const videos = await prisma.video.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { assignments: true },
      },
      // Including tags via the junction table
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })

  // Fetching all tags for filter dropdown
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
  })

  // Formatting tags for frontend
  const formattedTags: TagData[] = tags.map(tag => ({
    id: tag.id,
    name: tag.name,
    color: tag.color,
  }))

  // Formatting videos for frontend
  const formattedVideos: VideoData[] = videos.map(video => ({
    id: video.id,
    title: video.title,
    description: video.description,
    videoUrl: video.videoUrl,
    thumbnailUrl: video.thumbnailUrl,
    // duration as "X min"
    duration: video.duration ? `${Math.round(video.duration / 60)} min` : null,
    durationSeconds: video.duration,
    level: video.level,
    category: video.category,
    targetBmiMin: video.targetBmiMin,
    targetBmiMax: video.targetBmiMax,
    assignedCount: video._count.assignments,
    // Mapping tags from junction table
    tags: video.tags.map(vt => ({
      id: vt.tag.id,
      name: vt.tag.name,
      color: vt.tag.color,
    })),
    createdAt: video.createdAt.toISOString().split("T")[0],
  }))

  return <WorkoutVideosTab videos={formattedVideos} tags={formattedTags} />
}

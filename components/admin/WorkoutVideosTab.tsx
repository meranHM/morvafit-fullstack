"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Upload, Video, Eye, MoreVertical, Users, Trash2, Loader2, Tag, Filter } from "lucide-react"
import type { VideoData, TagData } from "@/app/[locale]/admin/workout-videos/page"
import VideoUploadDialog from "./VideoUploadDialog"
import VideoAssignDialog from "./VideoAssignDialog"

// Props type for WorkoutVideosTab
type WorkoutVideosTabProps = {
  videos: VideoData[]
  tags: TagData[]
}

const WorkoutVideosTab = ({ videos, tags }: WorkoutVideosTabProps) => {
  const router = useRouter()

  // Dialog states
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Selected video for actions
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)
  const [selectedVideoTitle, setSelectedVideoTitle] = useState<string>("")

  // Filtering states
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>("all")
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>("all")
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all")

  const [isDeleting, setIsDeleting] = useState(false)

  const handleAssignClick = (videoId: string) => {
    setSelectedVideoId(videoId)
    setAssignDialogOpen(true)
  }

  // Handle opening delete confirmation dialog
  const handleDeleteClick = (videoId: string, videoTitle: string) => {
    setSelectedVideoId(videoId)
    setSelectedVideoTitle(videoTitle)
    setDeleteDialogOpen(true)
  }

  // Handle video deletion
  const handleDelete = async () => {
    if (!selectedVideoId) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/videos/${selectedVideoId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Success - close dialog and refresh page
        setDeleteDialogOpen(false)
        router.refresh()
      } else {
        const data = await response.json()
        console.error("Failed to delete video:", data.error)
        alert("Failed to delete video: " + data.error)
      }
    } catch (error) {
      console.error("Error deleting video:", error)
      alert("Failed to delete video")
    } finally {
      setIsDeleting(false)
    }
  }

  // Filtering videos based on selected filters
  const filteredVideos = videos.filter(video => {
    // Tag filter
    if (selectedTagFilter !== "all") {
      const hasTag = video.tags.some(tag => tag.id === selectedTagFilter)
      if (!hasTag) return false
    }

    // Level filter
    if (selectedLevelFilter !== "all" && video.level !== selectedLevelFilter) {
      return false
    }

    // Category filter
    if (selectedCategoryFilter !== "all" && video.category !== selectedCategoryFilter) {
      return false
    }

    return true
  })

  // Get unique levels and categories for filter dropdowns
  const levels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"]
  const categories = [
    "UPPER_BODY",
    "LEGS",
    "GLUTES",
    "CORE",
    "ABS",
    "CARDIO",
    "CARDIO_BOXING",
    "FULL_BODY",
    "FULL_BODY_SCULPT",
    "HIIT",
    "PILATES",
    "ABS_CARDIO",
    "BODYWEIGHT_TRAINING",
    "TRX",
    "FUNCTIONAL_TRAINING",
  ]

  return (
    <div className="space-y-6">
      {/* Header with title and upload button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Workout Videos</h2>
          <p className="text-gray-500 mt-1">Manage and assign workout videos</p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Video
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-4 items-center p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>

        {/* Tag filter */}
        <Select value={selectedTagFilter} onValueChange={setSelectedTagFilter}>
          <SelectTrigger className="w-[150px]">
            <Tag className="mr-2 h-4 w-4" />
            <SelectValue placeholder="All Tags" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {tags.map(tag => (
              <SelectItem key={tag.id} value={tag.id}>
                <div className="flex items-center gap-2">
                  {tag.color && (
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                  )}
                  {tag.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Level filter */}
        <Select value={selectedLevelFilter} onValueChange={setSelectedLevelFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {levels.map(level => (
              <SelectItem key={level} value={level}>
                {level.charAt(0) + level.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category filter */}
        <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear filters button */}
        {(selectedTagFilter !== "all" ||
          selectedLevelFilter !== "all" ||
          selectedCategoryFilter !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedTagFilter("all")
              setSelectedLevelFilter("all")
              setSelectedCategoryFilter("all")
            }}
          >
            Clear Filters
          </Button>
        )}

        {/* Results count */}
        <span className="text-sm text-gray-500 ml-auto">
          {filteredVideos.length} of {videos.length} videos
        </span>
      </div>

      {/* Video grid or empty state */}
      {filteredVideos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <Video className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            {videos.length === 0 ? (
              <>
                <p>No workout videos found</p>
                <p className="text-sm mt-1">Upload your first video to get started</p>
              </>
            ) : (
              <>
                <p>No videos match the selected filters</p>
                <Button
                  variant="link"
                  onClick={() => {
                    setSelectedTagFilter("all")
                    setSelectedLevelFilter("all")
                    setSelectedCategoryFilter("all")
                  }}
                >
                  Clear filters
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => {
            console.log(video.thumbnailUrl)
            return (
              <Card key={video.id}>
                <CardHeader>
                  {/* Video thumbnail or placeholder */}
                  <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {video.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Video className="text-gray-400" size={48} />
                    )}
                  </div>
                  <CardTitle className="text-lg">{video.title}</CardTitle>
                  <CardDescription>
                    {video.duration || "Unknown duration"} • {video.level} Level
                  </CardDescription>

                  {/* Category and assignment badges */}
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge variant="outline">{video.category.replace(/_/g, " ")}</Badge>
                    <Badge variant="secondary">{video.assignedCount} assigned</Badge>
                  </div>

                  {/* Tags */}
                  {video.tags.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {video.tags.map(tag => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="text-xs"
                          style={{
                            borderColor: tag.color || undefined,
                            color: tag.color || undefined,
                          }}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* BMI range if set */}
                  {(video.targetBmiMin || video.targetBmiMax) && (
                    <p className="text-xs text-gray-500 mt-2">
                      BMI Range: {video.targetBmiMin || "any"} - {video.targetBmiMax || "any"}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(video.videoUrl, "_blank")}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAssignClick(video.id)}>
                          <Users className="mr-2 h-4 w-4" />
                          Assign to Client
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteClick(video.id, video.title)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Video Upload Dialog */}
      <VideoUploadDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} tags={tags} />

      {/* Video Assign Dialog */}
      <VideoAssignDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        videoId={selectedVideoId || undefined}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Video</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedVideoTitle}&quot;? This action cannot
              be undone and will remove the video from all assigned clients.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default WorkoutVideosTab

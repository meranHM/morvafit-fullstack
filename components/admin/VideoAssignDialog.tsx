"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Loader2, Search, User, Video } from "lucide-react"

// User type for eligible users
type EligibleUser = {
  id: string
  name: string
  email: string
  bmi: string | null
  assignedVideosCount: number
}

// Video type
type VideoItem = {
  id: string
  title: string
  level: string
  category: string
}

// Props for the dialog
type VideoAssignDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  // If videoId is provided, assign this specific video to selected user(s)
  // If userId is provided, assign selected videos to this user
  videoId?: string
  userId?: string
  videos?: VideoItem[]
}

export default function VideoAssignDialog({
  open,
  onOpenChange,
  videoId,
  userId,
  videos = [],
}: VideoAssignDialogProps) {
  const router = useRouter()

  // Mode: "selectUser" (assign video to user) or "selectVideos" (assign videos to user)
  const mode = videoId ? "selectUser" : "selectVideos"

  // State for users
  const [users, setUsers] = useState<EligibleUser[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  // Selection state
  const [selectedUserId, setSelectedUserId] = useState<string | null>(userId || null)
  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>(videoId ? [videoId] : [])

  // Search/filter state
  const [searchQuery, setSearchQuery] = useState("")

  // UI state
  const [isAssigning, setIsAssigning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch eligible users when dialog opens
  useEffect(() => {
    if (open && mode === "selectUser") {
      fetchUsers()
    }
  }, [open, mode])

  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      const response = await fetch("/api/admin/videos/assign")
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch {
      console.error("Failed to fetch users")
    } finally {
      setLoadingUsers(false)
    }
  }

  // Filter users/videos based on search
  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredVideos = videos.filter(
    video =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Toggle video selection
  const toggleVideo = (id: string) => {
    setSelectedVideoIds(prev => (prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]))
  }

  // Handle assignment
  const handleAssign = async () => {
    setError(null)

    const targetUserId = mode === "selectUser" ? selectedUserId : userId
    const targetVideoIds = mode === "selectVideos" ? selectedVideoIds : [videoId!]

    if (!targetUserId) {
      setError("Please select a user")
      return
    }

    if (targetVideoIds.length === 0) {
      setError("Please select at least one video")
      return
    }

    setIsAssigning(true)

    try {
      const response = await fetch("/api/admin/videos/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: targetUserId,
          videoIds: targetVideoIds,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to assign videos")
      }

      // Success - close dialog and refresh
      onOpenChange(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign videos")
    } finally {
      setIsAssigning(false)
    }
  }

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("")
      setError(null)
      if (!userId) setSelectedUserId(null)
      if (!videoId) setSelectedVideoIds([])
    }
  }, [open, userId, videoId])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {mode === "selectUser" ? "Assign Video to Client" : "Assign Videos to Client"}
          </DialogTitle>
          <DialogDescription>
            {mode === "selectUser"
              ? "Select a client to assign this video to"
              : "Select videos to assign to this client"}
          </DialogDescription>
        </DialogHeader>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={mode === "selectUser" ? "Search clients..." : "Search videos..."}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* List content */}
        <div className="flex-1 overflow-y-auto min-h-[200px] max-h-[400px] border rounded-lg">
          {mode === "selectUser" ? (
            // User selection list
            loadingUsers ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
                <User className="h-8 w-8 mb-2" />
                <p className="text-sm">No eligible clients found</p>
                <p className="text-xs">Only clients with approved payments can be assigned videos</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredUsers.map(user => (
                  <label
                    key={user.id}
                    className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 ${
                      selectedUserId === user.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="user"
                      checked={selectedUserId === user.id}
                      onChange={() => setSelectedUserId(user.id)}
                      className="h-4 w-4"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      {user.bmi && <p>BMI: {user.bmi}</p>}
                      <p>{user.assignedVideosCount} videos</p>
                    </div>
                  </label>
                ))}
              </div>
            )
          ) : (
            // Video selection list
            filteredVideos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
                <Video className="h-8 w-8 mb-2" />
                <p className="text-sm">No videos found</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredVideos.map(video => (
                  <label
                    key={video.id}
                    className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 ${
                      selectedVideoIds.includes(video.id) ? "bg-blue-50" : ""
                    }`}
                  >
                    <Checkbox
                      checked={selectedVideoIds.includes(video.id)}
                      onCheckedChange={() => toggleVideo(video.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{video.title}</p>
                      <p className="text-xs text-gray-500">
                        {video.level} • {video.category.replace(/_/g, " ")}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-gray-500">
            {mode === "selectUser"
              ? selectedUserId
                ? "1 client selected"
                : "No client selected"
              : `${selectedVideoIds.length} video(s) selected`}
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isAssigning}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={isAssigning}>
              {isAssigning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                "Assign"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

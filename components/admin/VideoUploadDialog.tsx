"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Upload, X, Video, Image, Loader2, CheckCircle } from "lucide-react"

type Tag = {
  id: string
  name: string
  color: string | null
}

type VideoUploadDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  tags: Tag[]
}

type UploadStatus =
  | "idle"
  | "getting-urls"
  | "uploading-video"
  | "uploading-thumbnail"
  | "saving"
  | "complete"

export default function VideoUploadDialog({ open, onOpenChange, tags }: VideoUploadDialogProps) {
  const router = useRouter()

  // Form states
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [level, setLevel] = useState("")
  const [category, setCategory] = useState("")
  const [duration, setDuration] = useState("")
  const [targetBmiMin, setTargetBmiMin] = useState("")
  const [targetBmiMax, setTargetBmiMax] = useState("")
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])

  // File states
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)

  // UI states
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const videoInputRef = useRef<HTMLInputElement>(null)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const allowedTypes = ["video/mp4", "video/webm", "video/quicktime"]
      if (!allowedTypes.includes(file.type)) {
        setError("Invalid video type. Allowed: MP4, WebM, MOV")
        return
      }
      setVideoFile(file)
      setError(null)
    }
  }

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
      if (!allowedTypes.includes(file.type)) {
        setError("Invalid thumbnail type. Allowed: JPG, PNG, WebP")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Thumbnail too large. Maximum: 5MB")
        return
      }
      setThumbnailFile(file)
      setError(null)
    }
  }

  const toggleTag = (tagId: string) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    )
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setLevel("")
    setCategory("")
    setDuration("")
    setTargetBmiMin("")
    setTargetBmiMax("")
    setSelectedTagIds([])
    setVideoFile(null)
    setThumbnailFile(null)
    setUploadProgress(0)
    setUploadStatus("idle")
    setError(null)
  }

  // Getting presigned URL from our API
  const getPresignedUrl = async (
    fileName: string,
    contentType: string,
    fileType: "video" | "thumbnail"
  ): Promise<{ uploadUrl: string; publicUrl: string }> => {
    const response = await fetch("/api/upload/presigned-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName, contentType, fileType }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || "Failed to get upload URL")
    }

    return response.json()
  }

  // Uploading file directly to S3 with progress tracking
  const uploadToS3WithProgress = (
    file: File,
    uploadUrl: string,
    onProgress: (percent: number) => void
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      // Track upload progress
      xhr.upload.addEventListener("progress", event => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100)
          onProgress(percent)
        }
      })

      // Handle completion
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve()
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      })

      // Handle errors
      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed due to network error"))
      })

      xhr.addEventListener("abort", () => {
        reject(new Error("Upload was aborted"))
      })

      // Send the request
      xhr.open("PUT", uploadUrl)
      xhr.setRequestHeader("Content-Type", file.type)
      xhr.setRequestHeader("x-amz-acl", "public-read")
      xhr.send(file)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!videoFile) {
      setError("Please select a video file")
      return
    }
    if (!title.trim()) {
      setError("Please enter a title")
      return
    }
    if (!level) {
      setError("Please select a level")
      return
    }
    if (!category) {
      setError("Please select a category")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Getting presigned URL for video
      setUploadStatus("getting-urls")
      const videoPresigned = await getPresignedUrl(videoFile.name, videoFile.type, "video")

      // Uploading video directly to S3
      setUploadStatus("uploading-video")
      await uploadToS3WithProgress(videoFile, videoPresigned.uploadUrl, percent => {
        // Video upload is 0-80% of total progress
        setUploadProgress(Math.round(percent * 0.8))
      })

      // Uploading thumbnail if provided
      let thumbnailPublicUrl: string | null = null
      if (thumbnailFile) {
        setUploadStatus("uploading-thumbnail")
        const thumbnailPresigned = await getPresignedUrl(
          thumbnailFile.name,
          thumbnailFile.type,
          "thumbnail"
        )
        await uploadToS3WithProgress(thumbnailFile, thumbnailPresigned.uploadUrl, percent => {
          // Thumbnail upload is 80-90% of total progress
          setUploadProgress(80 + Math.round(percent * 0.1))
        })
        thumbnailPublicUrl = thumbnailPresigned.publicUrl
      } else {
        setUploadProgress(90)
      }

      // Saving metadata to database
      setUploadStatus("saving")
      const confirmResponse = await fetch("/api/upload/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl: videoPresigned.publicUrl,
          thumbnailUrl: thumbnailPublicUrl,
          title: title.trim(),
          description: description.trim() || null,
          level,
          category,
          duration: duration ? parseInt(duration) * 60 : null, // Convert minutes to seconds
          targetBmiMin: targetBmiMin || null,
          targetBmiMax: targetBmiMax || null,
          tagIds: selectedTagIds,
        }),
      })

      if (!confirmResponse.ok) {
        const data = await confirmResponse.json()
        throw new Error(data.error || "Failed to save video")
      }

      setUploadProgress(100)
      setUploadStatus("complete")

      // Success - closing dialog and refreshing after brief delay
      setTimeout(() => {
        resetForm()
        onOpenChange(false)
        router.refresh()
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload video")
      setUploadStatus("idle")
    } finally {
      if (uploadStatus !== "complete") {
        setIsUploading(false)
      }
    }
  }

  // Getting status message for current upload step
  const getStatusMessage = () => {
    switch (uploadStatus) {
      case "getting-urls":
        return "Preparing upload..."
      case "uploading-video":
        return "Uploading video..."
      case "uploading-thumbnail":
        return "Uploading thumbnail..."
      case "saving":
        return "Saving video..."
      case "complete":
        return "Upload complete!"
      default:
        return ""
    }
  }

  // Formatting file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`
    }
    if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-lenis-prevent>
        <DialogHeader>
          <DialogTitle>Upload New Video</DialogTitle>
          <DialogDescription>
            Upload a workout video to assign to clients. Large files supported (up to 2GB).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Video file input */}
          <div className="space-y-2">
            <Label>Video File *</Label>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleVideoSelect}
              className="hidden"
            />
            {videoFile ? (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Video className="h-8 w-8 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{videoFile.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(videoFile.size)}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setVideoFile(null)}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full h-24 border-dashed"
                onClick={() => videoInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-6 w-6 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Click to select video (MP4, WebM, MOV)
                  </span>
                </div>
              </Button>
            )}
          </div>

          {/* Thumbnail input */}
          <div className="space-y-2">
            <Label>Thumbnail (Optional)</Label>
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleThumbnailSelect}
              className="hidden"
            />
            {thumbnailFile ? (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Image className="h-8 w-8 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{thumbnailFile.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(thumbnailFile.size)}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setThumbnailFile(null)}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full h-16 border-dashed"
                onClick={() => thumbnailInputRef.current?.click()}
              >
                <div className="flex items-center gap-2">
                  <Image className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-500">Add thumbnail image</span>
                </div>
              </Button>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Full Body HIIT Workout"
              disabled={isUploading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the workout..."
              rows={3}
              disabled={isUploading}
            />
          </div>

          {/* Level and Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Level *</Label>
              <Select value={level} onValueChange={setLevel} disabled={isUploading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={category} onValueChange={setCategory} disabled={isUploading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UPPER_BODY">Upper Body</SelectItem>
                  <SelectItem value="LEGS">Legs</SelectItem>
                  <SelectItem value="GLUTES">Glutes</SelectItem>
                  <SelectItem value="CORE">Core</SelectItem>
                  <SelectItem value="ABS">Abs</SelectItem>
                  <SelectItem value="CARDIO">Cardio</SelectItem>
                  <SelectItem value="CARDIO_BOXING">Cardio Boxing</SelectItem>
                  <SelectItem value="FULL_BODY">Full Body</SelectItem>
                  <SelectItem value="FULL_BODY_SCULPT">Full Body Sculpt</SelectItem>
                  <SelectItem value="HIIT">HIIT</SelectItem>
                  <SelectItem value="PILATES">Pilates</SelectItem>
                  <SelectItem value="ABS_CARDIO">Abs Cardio</SelectItem>
                  <SelectItem value="BODYWEIGHT_TRAINING">Bodyweight Training</SelectItem>
                  <SelectItem value="TRX">TRX</SelectItem>
                  <SelectItem value="FUNCTIONAL_TRAINING">Functional Training</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="180"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              placeholder="e.g., 45"
              disabled={isUploading}
            />
          </div>

          {/* BMI Range */}
          <div className="space-y-2">
            <Label>Target BMI Range (Optional)</Label>
            <p className="text-xs text-gray-500 mb-2">
              Leave empty for all BMI ranges, or set min/max for targeted assignment
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                step="0.1"
                min="10"
                max="50"
                value={targetBmiMin}
                onChange={e => setTargetBmiMin(e.target.value)}
                placeholder="Min BMI (e.g., 18.5)"
                disabled={isUploading}
              />
              <Input
                type="number"
                step="0.1"
                min="10"
                max="50"
                value={targetBmiMax}
                onChange={e => setTargetBmiMax(e.target.value)}
                placeholder="Max BMI (e.g., 30)"
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <label
                    key={tag.id}
                    className={`flex items-center gap-2 px-3 py-1.5 border rounded-full cursor-pointer hover:bg-gray-50 ${
                      isUploading ? "opacity-50 pointer-events-none" : ""
                    }`}
                    style={{
                      borderColor: selectedTagIds.includes(tag.id)
                        ? tag.color || "#000"
                        : undefined,
                      backgroundColor: selectedTagIds.includes(tag.id)
                        ? `${tag.color}20` || "#00000010"
                        : undefined,
                    }}
                  >
                    <Checkbox
                      checked={selectedTagIds.includes(tag.id)}
                      onCheckedChange={() => toggleTag(tag.id)}
                      disabled={isUploading}
                    />
                    <span className="text-sm">{tag.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Upload progress */}
          {isUploading && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {uploadStatus === "complete" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  <span>{getStatusMessage()}</span>
                </div>
                <span className="font-medium">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
              {uploadStatus === "uploading-video" && videoFile && (
                <p className="text-xs text-gray-500 text-center">
                  Uploading {formatFileSize(videoFile.size)} - please keep this window open
                </p>
              )}
            </div>
          )}

          {/* Submit button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Video
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ARVANCLOUD S3 CLIENT
// ============================================
// This file configures AWS S3 SDK to work with ArvanCloud storage
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

// CONFIGURING S3 CLIENT
// ============================================
// Creating an S3 client configured for ArvanCloud
// This client will be used to upload, download, and delete files
export const s3Client = new S3Client({
  // REGION
  region: process.env.ARVAN_REGION || "ir-thr-at1",

  // CREDENTIALS
  credentials: {
    accessKeyId: process.env.ARVAN_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.ARVAN_SECRET_ACCESS_KEY || "",
  },

  // ENDPOINT
  // This tells the SDK to connect to ArvanCloud instead of AWS
  endpoint: `https://${process.env.ARVAN_ENDPOINT}`,

  // FORCING PATH STYLE
  // ArvanCloud requires path-style URLs (bucket-name comes after domain)
  // AWS uses virtual-hosted style, but ArvanCloud needs this setting
  forcePathStyle: false,
})

// HELPER FUNCTION: Upload File to S3
// This function uploads a file (Buffer or Blob) to ArvanCloud S3
// Returns the public URL of the uploaded file
export async function uploadToS3(params: {
  file: Buffer | Blob // The file data to upload
  fileName: string // What to name the file (e.g., "receipt-123.jpg")
  contentType: string // MIME type (e.g., "image/jpeg", "application/pdf")
  folder?: string // Optional: organize files in folders (e.g., "receipts/")
}): Promise<string> {
  const { file, fileName, contentType, folder = "" } = params

  // STEP 1: Generating the file key (path in bucket)
  // Key is like a file path: "receipts/receipt-123.jpg"
  // Add folder prefix if provided
  const key = folder ? `${folder}/${fileName}` : fileName

  // STEP 2: Converting file to Buffer if it's a Blob
  let fileBuffer: Buffer

  if (Buffer.isBuffer(file)) {
    // Already a Buffer, using it as-is
    fileBuffer = file
  } else {
    // It's a Blob/File, converting it to Buffer
    const arrayBuffer = await file.arrayBuffer()
    fileBuffer = Buffer.from(arrayBuffer)
  }

  // STEP 3: Creating upload command
  const command = new PutObjectCommand({
    Bucket: process.env.ARVAN_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
    ACL: "public-read", // Making the file publicly accessible
  })

  // STEP 4: Uploading the the file to S3
  try {
    await s3Client.send(command)

    // STEP 5: Generating public URL
    // Format: https://bucket-name.endpoint/file-key
    // Example: https://morvafit-receipts.s3.ir-thr-at1.arvanstorage.ir/receipts/receipt-123.jpg
    const publicUrl = `https://${process.env.ARVAN_BUCKET_NAME}.${process.env.ARVAN_ENDPOINT}/${key}`

    return publicUrl
  } catch (error) {
    // ERROR HANDLING
    console.error("S3 Upload Error:", error)
    throw new Error(
      `Failed to upload file to S3: ${error instanceof Error ? error.message : "Unknown error"}`
    )
  }
}

// HELPER FUNCTION: Deleting a File from S3
// This function deletes a file from ArvanCloud S3
// When a user deletes a receipt or changes their uploaded file
export async function deleteFromS3(fileUrl: string): Promise<void> {
  try {
    // STEP 1: Extractin file key from URL
    // URL format: https://bucket-name.endpoint/folder/filename.jpg
    // We need to extract: folder/filename.jpg

    const url = new URL(fileUrl)
    // Remove leading slash from pathname
    const key = url.pathname.substring(1)

    // STEP 2: Creating the delete command
    const command = new DeleteObjectCommand({
      Bucket: process.env.ARVAN_BUCKET_NAME,
      Key: key,
    })

    // STEP 3: Deleting the file
    await s3Client.send(command)

    console.log(`File deleted successfully: ${key}`)
  } catch (error) {
    // ERROR HANDLING
    console.error("S3 Delete Error:", error)
    throw new Error(
      `Failed to delete file from S3: ${error instanceof Error ? error.message : "Unknown error"}`
    )
  }
}

// HELPER FUNCTION: Generating a Unique Filename
// Creates a unique filename to prevent conflicts
// Format: timestamp-randomstring-originalname.ext
// Example: 1703527890123-a1b2c3-receipt.jpg
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now()

  // Generate random string (6 characters)
  const randomString = Math.random().toString(36).substring(2, 8)

  // Cleaning th original filename (removing special characters, spaces)
  const cleanName = originalName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-") // Replacing special chars with hyphens
    .replace(/-+/g, "-") // Replacing multiple hyphens with single hyphen

  return `${timestamp}-${randomString}-${cleanName}`
}

// HELPER FUNCTION: Generate Presigned URL for Direct Upload
// ============================================
// This function generates a presigned URL that allows clients to upload
// files directly to S3 without going through our server.
// Perfect for large files (videos) that would timeout with server upload.
export async function generatePresignedUploadUrl(params: {
  fileName: string // The file name/key to use in S3
  contentType: string // MIME type (e.g., "video/mp4")
  folder?: string // Optional folder prefix (e.g., "videos")
  expiresIn?: number // URL expiration time in seconds (default: 1 hour)
}): Promise<{
  uploadUrl: string // The presigned URL to upload to
  fileKey: string // The S3 key where file will be stored
  publicUrl: string // The public URL after upload completes
}> {
  const { fileName, contentType, folder = "", expiresIn = 3600 } = params

  // STEP 1: Generate the S3 key (path in bucket)
  const key = folder ? `${folder}/${fileName}` : fileName

  // STEP 2: Create the PutObject command
  // This defines what the presigned URL will be able to do
  const command = new PutObjectCommand({
    Bucket: process.env.ARVAN_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    ACL: "public-read", // File will be publicly accessible after upload
  })

  // STEP 3: Generate the presigned URL
  // This URL allows anyone with it to upload a file to this specific location
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn })

  // STEP 4: Generate the public URL (what the file URL will be after upload)
  const publicUrl = `https://${process.env.ARVAN_BUCKET_NAME}.${process.env.ARVAN_ENDPOINT}/${key}`

  return {
    uploadUrl,
    fileKey: key,
    publicUrl,
  }
}

// HOW TO USE PRESIGNED URLS
// ============================================
//
// SERVER SIDE (API Route):
// import { generatePresignedUploadUrl, generateUniqueFileName } from "@/lib/arvancloud"
//
// const fileName = generateUniqueFileName("my-video.mp4")
// const { uploadUrl, publicUrl } = await generatePresignedUploadUrl({
//   fileName,
//   contentType: "video/mp4",
//   folder: "videos",
//   expiresIn: 3600 // 1 hour
// })
//
// // Return uploadUrl to client
//
// CLIENT SIDE:
// // Upload directly to S3 using the presigned URL
// await fetch(uploadUrl, {
//   method: "PUT",
//   body: file,
//   headers: {
//     "Content-Type": file.type,
//   },
// })
//
// // After successful upload, notify server with publicUrl
//
// ============================================

// ============================================
// VERIFICATION TOKEN UTILITIES
// ============================================
// Helper functions for creating and validating email verification tokens
// These are used by the registration and verify-email API routes

import { prisma } from "@/lib/prisma"
import crypto from "crypto"

// ============================================
// CONSTANTS
// ============================================
// Token expiration time in hours
const TOKEN_EXPIRATION_HOURS = 24

// ============================================
// CREATE VERIFICATION TOKEN
// ============================================
// Creates a new verification token for an email address
// This is called when:
// 1. A new user registers
// 2. A user requests to resend the verification email
//
// Returns: The token string that should be included in the verification email
export async function createVerificationToken(email: string): Promise<string> {
  // ============================================
  // STEP 1: Generate a secure random token
  // ============================================
  // Using crypto.randomBytes for cryptographically secure randomness
  // 32 bytes = 64 character hex string (very hard to guess)
  // Example output: "a1b2c3d4e5f6..."
  const token = crypto.randomBytes(32).toString("hex")

  // ============================================
  // STEP 2: Calculate expiration time
  // ============================================
  // Token expires 24 hours from now
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + TOKEN_EXPIRATION_HOURS)

  // ============================================
  // STEP 3: Delete any existing tokens for this email
  // ============================================
  // This prevents token accumulation in the database
  // and ensures only the latest token is valid
  // (user can only use the most recent verification link)
  await prisma.verificationToken.deleteMany({
    where: { email: email.toLowerCase() },
  })

  // ============================================
  // STEP 4: Create new token in database
  // ============================================
  await prisma.verificationToken.create({
    data: {
      token,
      email: email.toLowerCase(), // Store email in lowercase for consistency
      expiresAt,
    },
  })

  // ============================================
  // STEP 5: Return the token
  // ============================================
  // This token will be included in the magic link URL
  return token
}

// ============================================
// VERIFY TOKEN
// ============================================
// Validates a token and returns the associated email if valid
// This is called when a user clicks the magic link
//
// Returns:
// - The email address if token is valid
// - null if token is invalid, expired, or not found
export async function verifyToken(token: string): Promise<string | null> {
  // ============================================
  // STEP 1: Find the token in database
  // ============================================
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  })

  // ============================================
  // STEP 2: Check if token exists
  // ============================================
  if (!verificationToken) {
    // Token not found - might be:
    // - Invalid/fake token
    // - Already used token (we delete after use)
    // - Very old token that was cleaned up
    return null
  }

  // ============================================
  // STEP 3: Check if token has expired
  // ============================================
  if (verificationToken.expiresAt < new Date()) {
    // Token has expired - delete it from database to clean up
    await prisma.verificationToken.delete({
      where: { token },
    })
    return null
  }

  // ============================================
  // STEP 4: Token is valid - delete it
  // ============================================
  // Tokens are one-time use only
  // Deleting prevents the same link being used twice
  await prisma.verificationToken.delete({
    where: { token },
  })

  // ============================================
  // STEP 5: Return the email associated with this token
  // ============================================
  // The calling code will use this email to update the user's
  // emailVerified field in the database
  return verificationToken.email
}

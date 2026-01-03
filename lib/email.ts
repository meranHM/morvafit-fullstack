// ============================================
// EMAIL SERVICE
// ============================================
// This file handles all email sending using Resend
// Resend is an email API service (like SendGrid or Mailgun)
// Documentation: https://resend.com/docs

import { Resend } from "resend"

// ============================================
// RESEND CLIENT SETUP
// ============================================
// Creating a Resend client instance with our API key
// The API key should be in .env as RESEND_API_KEY
// You can get this key from: https://resend.com/api-keys
const resend = new Resend(process.env.RESEND_API_KEY)

// ============================================
// TYPE DEFINITIONS
// ============================================
// Parameters for sending a verification email
interface SendVerificationEmailParams {
  email: string // User's email address to send to
  token: string // The verification token to include in the magic link
  name?: string // Optional: User's name for personalization
}

// Return type for email sending functions
interface EmailResult {
  success: boolean
  error?: string
}

// ============================================
// SEND VERIFICATION EMAIL
// ============================================
// This function sends a magic link email to verify user's email address
// The link contains a token that, when clicked, verifies their email
//
// How it works:
// 1. User registers on the website
// 2. This function sends them an email with a special link
// 3. User clicks the link, which takes them to /verify-email?token=xxx
// 4. The verify-email page calls our API to verify the token
// 5. If valid, the user's email is marked as verified
export async function sendVerificationEmail(
  params: SendVerificationEmailParams
): Promise<EmailResult> {
  const { email, token, name } = params

  // ============================================
  // STEP 1: Build the verification URL (magic link)
  // ============================================
  // This is the link users will click in the email
  // Format: https://yoursite.com/verify-email?token=abc123
  // NEXTAUTH_URL should be set in .env (e.g., http://localhost:3000 for dev)
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`

  // ============================================
  // STEP 2: Send the email using Resend
  // ============================================
  try {
    await resend.emails.send({
      // ----------------------------------------
      // FROM: Sender email address
      // ----------------------------------------
      // This MUST be a verified domain in your Resend dashboard
      // For testing, you can use onboarding@resend.dev
      // For production, set EMAIL_FROM in .env
      from: process.env.EMAIL_FROM || "MorvaFit <onboarding@resend.dev>",

      // ----------------------------------------
      // TO: Recipient email address
      // ----------------------------------------
      to: email,

      // ----------------------------------------
      // SUBJECT: Email subject line
      // ----------------------------------------
      subject: "Verify your email - MorvaFit",

      // ----------------------------------------
      // HTML: Email body content
      // ----------------------------------------
      // Using inline styles because email clients don't support external CSS
      // Keeping it simple - you can use React Email templates later if needed
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <!-- Header with logo placeholder -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #e11d48; margin: 0;">MorvaFit</h1>
          </div>

          <!-- Welcome message -->
          <h2 style="color: #1f2937; margin-bottom: 10px;">Welcome to MorvaFit!</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            Hi ${name || "there"},
          </p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            Thank you for signing up! Please verify your email address by clicking the button below:
          </p>

          <!-- Verification button -->
          <div style="text-align: center; margin: 30px 0;">
            <a
              href="${verificationUrl}"
              style="display: inline-block; background: linear-gradient(to right, #f43f5e, #ec4899); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;"
            >
              Verify Email Address
            </a>
          </div>

          <!-- Alternative link -->
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            Or copy and paste this link in your browser:
          </p>
          <p style="color: #9ca3af; font-size: 12px; word-break: break-all; background: #f3f4f6; padding: 12px; border-radius: 6px;">
            ${verificationUrl}
          </p>

          <!-- Expiration notice -->
          <p style="color: #9ca3af; font-size: 12px; margin-top: 30px; text-align: center;">
            This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
          </p>

          <!-- Footer -->
          <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              MorvaFit - Your Fitness Journey Starts Here
            </p>
          </div>
        </div>
      `,
    })

    // ============================================
    // STEP 3: Return success
    // ============================================
    return { success: true }
  } catch (error) {
    // ============================================
    // ERROR HANDLING
    // ============================================
    // Log the error for debugging but return a generic message
    console.error("Failed to send verification email:", error)

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    }
  }
}

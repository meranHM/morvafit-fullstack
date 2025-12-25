// ============================================
// NEXTAUTH API ROUTE HANDLER
// ============================================
// This is the catch-all route for NextAuth
// It handles all authentication requests:
// - /api/auth/signin (login)
// - /api/auth/signout (logout)
// - /api/auth/session (get current session)
// - /api/auth/csrf (get CSRF token)

import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// ============================================
// CREATING NEXTAUTH HANDLER
// ============================================
// NextAuth() creates request handlers for GET and POST
// It uses the configuration we defined in lib/auth.ts

const handler = NextAuth(authOptions)

// ============================================
// EXPORT HANDLERS
// ============================================
// In Next.js App Router, we need to export GET and POST separately
// Both use the same handler

export { handler as GET, handler as POST }

// ============================================
// HOW THIS WORKS
// ============================================
// When a request comes to /api/auth/*, NextAuth automatically:
// 1. Routes it to the correct internal handler
// 2. Uses our configuration from authOptions
// 3. Returns the appropriate response
//
// Example flows:
//
// LOGIN:
// POST /api/auth/callback/credentials
// ==> NextAuth calls our authorize() function
// ==> If successful, creates session and sets cookie
// ==> Returns success
//
// GET SESSION:
// GET /api/auth/session
// ==> NextAuth reads session cookie
// ==> Decodes JWT token
// ==> Returns user session data
//
// LOGOUT:
// POST /api/auth/signout
// ==> NextAuth clears session cookie
// ==> Returns success
// ============================================

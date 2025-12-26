// ============================================
// NEXTAUTH CONFIGURATION
// ============================================
// This file configures NextAuth.js for authentication
// It defines how users log in, how sessions work, and what data is stored

import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"

// ============================================
// NEXTAUTH OPTIONS
// ============================================
// This object contains all the configuration for NextAuth
export const authOptions: NextAuthOptions = {
  // ============================================
  // SESSION STRATEGY
  // ============================================
  // "jwt" = Session data is stored in a JWT token (cookie on client side)
  // We use JWT because it's faster and doesn't require database queries on every request
  session: {
    strategy: "jwt",
    // Session expires after 30 days of inactivity
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
  },

  // ============================================
  // AUTHENTICATION PROVIDERS
  // ============================================
  // Providers define how users can log in
  // We're using CredentialsProvider for email/password login
  providers: [
    CredentialsProvider({
      // Name shown on the login page
      name: "credentials",

      // Define what fields are needed for login
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      // ============================================
      // AUTHORIZE FUNCTION
      // ============================================
      // This function runs when user tries to log in
      // It checks if credentials are valid
      // Returns user object if valid, null if invalid
      async authorize(credentials) {
        // STEP 1: Check if email and password were provided
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide email and password")
        }

        // STEP 2: Find user in database by email
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        // STEP 3: If user doesn't exist, return null (login fails)
        if (!user) {
          throw new Error("No user found with this email")
        }

        // STEP 4: Check if user is blocked
        if (user.isBlocked) {
          throw new Error("Your account has been blocked. Contact support.")
        }

        // STEP 5: Compare provided password with hashed password in database
        // compare() is from bcryptjs - it safely compares hashed passwords
        const isPasswordValid = await compare(credentials.password, user.password)

        // STEP 6: If password is wrong, return null (login fails)
        if (!isPasswordValid) {
          throw new Error("Invalid password")
        }

        // STEP 7: Login successful! Return user object
        // This object will be available in the session
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],

  // ============================================
  // CALLBACKS
  // ============================================
  // Callbacks let us control what happens during the authentication flow

  callbacks: {
    // ============================================
    // JWT CALLBACK
    // ============================================
    // This runs whenever a JWT token is created or updated
    // We add custom data (like role) to the token
    async jwt({ token, user }) {
      // When user first logs in, we add their data to the token
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
      }

      return token
    },

    // ============================================
    // SESSION CALLBACK
    // ============================================
    // This runs whenever session is checked (like when we call getServerSession)
    // We add custom data from the token to the session object
    async session({ session, token }) {
      // Adding user data from token to session
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as string
      }

      return session
    },
  },

  // ============================================
  // PAGES
  // ============================================
  // Custom pages for sign in, sign out, error, etc.
  // If not specified, NextAuth uses default pages
  pages: {
    signIn: "/login", // Redirect here for login
    // error: '/auth/error',     // Error page (optional) - will update later
    // signOut: '/auth/signout', // Sign out page (optional) - will update later
  },

  // ============================================
  // OTHER OPTIONS
  // ============================================

  // Secret key for signing tokens (from .env file)
  secret: process.env.NEXTAUTH_SECRET,
}

// ============================================
// TYPESCRIPT TYPE EXTENSIONS
// ============================================
// These extend NextAuth's default types to include our custom fields

// Extend the User type to include role
declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string | null
    role: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string | null
      role: string
    }
  }
}

// Extend the JWT type to include our custom fields
declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    name: string | null
    role: string
  }
}

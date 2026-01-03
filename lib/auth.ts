// ============================================
// NEXTAUTH CONFIGURATION
// ============================================
// This file configures NextAuth.js for authentication
// It defines how users log in, how sessions work, and what data is stored

import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"

// NEXTAUTH OPTIONS
// ============================================
export const authOptions: NextAuthOptions = {
  // SESSION STRATEGY
  // ============================================
  // "jwt" = Session data is stored in a JWT token (cookie on client side)
  session: {
    strategy: "jwt",
    // Session expires after 30 days of inactivity
    maxAge: 30 * 24 * 60 * 60,
  },

  // AUTHENTICATION PROVIDERS
  // ============================================
  // We're using CredentialsProvider for email/password login
  providers: [
    CredentialsProvider({
      // Name will be shown on the login page
      name: "credentials",

      // Defininh what fields are needed for login
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      // AUTHORIZE FUNCTION
      // ============================================
      // This function runs when user tries to log in
      // It checks if credentials are valid
      // Returns user object if valid, null if invalid
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide email and password")
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user) {
          throw new Error("No user found with this email")
        }

        if (user.isBlocked) {
          throw new Error("Your account has been blocked. Contact support.")
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error("Invalid password")
        }

        // Login successful! Return user object
        // This object will be available in the session
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified,
        }
      },
    }),
  ],

  // CALLBACKS
  // ============================================
  // Callbacks let us control what happens during the authentication flow

  callbacks: {
    // JWT CALLBACK
    // ============================================
    // This runs whenever a JWT token is created or updated
    // We add custom data (like role and emailVerified) to the token
    async jwt({ token, user, trigger }) {
      // When user first logs in, we add their data to the token
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
        token.emailVerified = user.emailVerified
      }

      // REFRESH EMAIL VERIFIED STATUS
      // ============================================
      // When session.update() is called from frontend,
      // we refresh the emailVerified status from database
      // This ensures the session reflects the latest verification status
      // after user clicks the magic link
      if (trigger === "update") {
        const freshUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { emailVerified: true },
        })

        if (freshUser) {
          token.emailVerified = freshUser.emailVerified
        }
      }

      return token
    },

    // SESSION CALLBACK
    // ============================================
    // This runs whenever session is checked (like when we call getServerSession)
    async session({ session, token }) {
      // Adding user data from token to session
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as string
        session.user.emailVerified = token.emailVerified as Date | null
      }

      return session
    },
  },

  // PAGES
  // ============================================
  // Custom pages for sign in, sign out, error, etc.
  pages: {
    signIn: "/login", // Redirecting here for login
    // error: '/auth/error',     // Error page (optional) - will update later
    // signOut: '/auth/signout', // Sign out page (optional) - will update later
  },

  // OTHER OPTIONS
  // ============================================
  // Secret key for signing tokens (from .env file)
  secret: process.env.NEXTAUTH_SECRET,
}

// TYPESCRIPT TYPE EXTENSIONS
// ============================================
// These extend NextAuth's default types to include our custom fields

// Extending the User type to include role and emailVerified
declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string | null
    role: string
    emailVerified: Date | null // Email verification timestamp (null = not verified)
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string | null
      role: string
      emailVerified: Date | null
    }
  }
}

// Extending the JWT type to include our custom fields
declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    name: string | null
    role: string
    emailVerified: Date | null
  }
}

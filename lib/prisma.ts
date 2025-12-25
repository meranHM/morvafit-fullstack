// ============================================
// PRISMA CLIENT SINGLETON
// ============================================
// This file creates a single, reusable instance of Prisma Client
// for the entire Next.js application
import { PrismaClient } from "@prisma/client"

// ============================================
// GLOBAL TYPE DECLARATION
// ============================================
// In development, Next.js uses hot reloading which can create
// multiple instances of PrismaClient. We use a global variable
// to prevent this issue.

// Declaring a global variable to store the Prisma client
// This ensures we only create ONE instance across hot reloads
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// ============================================
// CREATE PRISMA CLIENT INSTANCE
// ============================================
// If we're in production: Create a new PrismaClient
// If we're in development: Reuse the global instance (or create one if it doesn't exist)

export const prisma =
  global.prisma ||
  new PrismaClient({
    // Enabling query logging in development to see SQL queries
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

// ============================================
// STORE IN GLOBAL (Development Only)
// ============================================
// In development, store the client in global scope
// so it survives hot reloads
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma
}

// ============================================
// HOW TO USE THIS FILE
// ============================================
// In any file where database access is needed, we import like this:
//
// import { prisma } from "@/lib/prisma"
//
// Then use it to query the database:
//
// const users = await prisma.user.findMany()
// const user = await prisma.user.create({ data: { email: "test@example.com" } })
//
// ============================================

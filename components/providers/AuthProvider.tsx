"use client"

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"

// This provider wraps the app to enable client-side session access
// Required for useSession() hook and signOut() function to work
export default function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}

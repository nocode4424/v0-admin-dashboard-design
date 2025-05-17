"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { login as loginAction, logout as logoutAction } from "@/actions/auth-actions"

type User = {
  id: number
  name: string
  email: string
  role: "superuser" | "owner" | "manager" | "staff"
  restaurantId?: number
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string; needsSetup?: boolean }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          if (data.user) {
            setUser(data.user)
          }
        }
      } catch (error) {
        console.error("Session check failed:", error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = async (username: string, password: string) => {
    setLoading(true)
    try {
      console.log("Auth context: login called with username:", username)

      // Create FormData for the server action
      const formData = new FormData()
      formData.append("username", username)
      formData.append("password", password)

      // Call the login action
      const result = await loginAction(username, password)
      console.log("Auth context: login result:", result)

      if (result.success && result.user) {
        setUser(result.user as User)
        return { success: true }
      }

      return {
        success: false,
        message: result.message || "Login failed",
        needsSetup: result.needsSetup,
      }
    } catch (error) {
      console.error("Auth context: login failed:", error)
      return { success: false, message: "An unexpected error occurred" }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await logoutAction()
      setUser(null)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

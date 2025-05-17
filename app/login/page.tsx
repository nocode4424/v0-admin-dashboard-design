"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Loader2 } from "lucide-react"

function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      console.log(`Attempting to login with username: ${username}`)
      const result = await login(username, password)
      console.log("Login result:", result)

      if (result.success) {
        console.log("Login successful, redirecting to dashboard")
        router.push("/dashboard")
      } else {
        console.log("Login failed:", result.message)
        setError(result.message || "Invalid username or password")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDirectLogin = async (e: React.MouseEvent, testUsername: string, testPassword: string) => {
    e.preventDefault()
    setUsername(testUsername)
    setPassword(testPassword)

    setError("")
    setIsLoading(true)

    try {
      console.log(`Attempting direct login with username: ${testUsername}`)
      const result = await login(testUsername, testPassword)
      console.log("Direct login result:", result)

      if (result.success) {
        console.log("Direct login successful, redirecting to dashboard")
        router.push("/dashboard")
      } else {
        console.log("Direct login failed:", result.message)
        setError(result.message || "Invalid username or password")
      }
    } catch (err) {
      console.error("Direct login error:", err)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username / Email</Label>
        <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => handleDirectLogin(e, "admin", "admin123")}
          disabled={isLoading}
        >
          Login as Admin
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => handleDirectLogin(e, "jeffg", "Mlg0718!!")}
          disabled={isLoading}
        >
          Login as Owner
        </Button>
      </div>
    </form>
  )
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="mt-2 text-xs text-muted-foreground">
              Demo credentials:
              <br />
              Super Admin: admin / admin123
              <br />
              Restaurant Owner: jeffg / Mlg0718!!
            </p>
            <div className="mt-4 text-xs text-muted-foreground">
              <a href="/api/debug/check-db" target="_blank" rel="noopener noreferrer" className="underline">
                Check Database
              </a>
              {" | "}
              <a href="/api/debug/force-init" target="_blank" rel="noopener noreferrer" className="underline">
                Force Initialize Database
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </AuthProvider>
  )
}

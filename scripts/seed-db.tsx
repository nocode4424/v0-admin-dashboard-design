"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { isDatabaseInitialized } from "@/actions/auth-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, Database, Loader2 } from "lucide-react"

export default function SeedDatabase() {
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkDatabase = async () => {
      setIsChecking(true)
      try {
        const initialized = await isDatabaseInitialized()
        setIsInitialized(initialized)
      } catch (error) {
        console.error("Error checking database:", error)
      } finally {
        setIsChecking(false)
      }
    }

    checkDatabase()
  }, [])

  const handleSeedDatabase = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/init-db")
      const data = await response.json()
      setResult(data)

      if (data.success) {
        setIsInitialized(true)
        // Wait 2 seconds before redirecting to login
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }
    } catch (error) {
      console.error("Error seeding database:", error)
      setResult({ success: false, message: "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Checking Database</CardTitle>
            <CardDescription>Verifying database status...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isInitialized && !result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Database Ready</CardTitle>
            <CardDescription>Your database is already initialized and ready to use.</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle>Database Initialized</AlertTitle>
              <AlertDescription>All required tables and sample data are already set up.</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push("/login")}>
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Database Setup</CardTitle>
          <CardDescription>Initialize the database with required tables and sample data</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
            <Database className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle>Database Not Initialized</AlertTitle>
            <AlertDescription>Your database needs to be set up before you can use the application.</AlertDescription>
          </Alert>

          <p className="mb-4 text-sm text-muted-foreground">
            This will create all necessary tables and seed the database with initial data, including:
          </p>
          <ul className="mb-4 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Super admin user (admin/admin123)</li>
            <li>Sample restaurant (Burger Palace)</li>
            <li>Restaurant owner (jeffg/Mlg0718!!)</li>
            <li>Sample locations</li>
          </ul>
          {result && (
            <div
              className={`mt-4 rounded-md p-3 ${result.success ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"}`}
            >
              {result.message}
              {result.success && <p className="mt-2 text-sm">Redirecting to login page...</p>}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSeedDatabase} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : (
              "Initialize Database"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

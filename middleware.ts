import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./actions/auth-actions"

export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/" || path.startsWith("/api/init-db") || path === "/setup"

  // Get the token from cookies
  const token = request.cookies.get("auth-token")?.value

  // If the path is public and user is logged in, redirect to dashboard
  if (isPublicPath && token && path !== "/setup") {
    try {
      const user = await verifyToken(token)
      if (user) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    } catch (error) {
      // Token is invalid, continue to public path
    }
  }

  // If the path is not public and user is not logged in, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Continue with the request
  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}

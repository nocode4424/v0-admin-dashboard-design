import { NextResponse } from "next/server"
import { login } from "@/actions/auth-actions"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const username = url.searchParams.get("username")
  const password = url.searchParams.get("password")

  if (!username || !password) {
    return NextResponse.json(
      {
        success: false,
        message: "Username and password are required as query parameters",
      },
      { status: 400 },
    )
  }

  try {
    const result = await login(username, password)

    return NextResponse.json({
      success: result.success,
      message: result.message,
      user: result.user,
      // Don't include the actual token in the response for security
      tokenSet: result.success ? true : false,
    })
  } catch (error) {
    console.error("Test login error:", error)
    return NextResponse.json(
      {
        success: false,
        error: String(error),
        message: "Login test failed",
      },
      { status: 500 },
    )
  }
}

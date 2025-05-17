import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/actions/auth-actions"

export async function GET() {
  const token = cookies().get("auth-token")?.value

  if (!token) {
    return NextResponse.json({ user: null })
  }

  try {
    const user = await verifyToken(token)

    if (!user) {
      return NextResponse.json({ user: null })
    }

    // Don't expose sensitive information
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurantId: user.restaurantId,
      },
    })
  } catch (error) {
    console.error("Error verifying token:", error)
    return NextResponse.json({ user: null })
  }
}

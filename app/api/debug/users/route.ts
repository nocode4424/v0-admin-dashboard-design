import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Only enable this in development
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Not available in production" }, { status: 403 })
    }

    const users = await sql`
      SELECT id, name, email, username, role, restaurant_id, 
             created_at, updated_at
      FROM users
    `

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

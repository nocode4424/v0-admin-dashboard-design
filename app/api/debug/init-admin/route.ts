import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    // Only enable this in development
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Not available in production" }, { status: 403 })
    }

    // Check if admin user exists
    const adminCheck = await sql`
      SELECT COUNT(*) as count FROM users WHERE role = 'superuser'
    `

    if (adminCheck[0].count > 0) {
      return NextResponse.json({ message: "Admin user already exists" })
    }

    // Create admin user
    const passwordHash = await bcrypt.hash("admin123", 10)

    await sql`
      INSERT INTO users (name, email, username, password_hash, role)
      VALUES ('Admin User', 'admin@example.com', 'admin', ${passwordHash}, 'superuser')
    `

    return NextResponse.json({ success: true, message: "Admin user created" })
  } catch (error) {
    console.error("Error creating admin user:", error)
    return NextResponse.json({ error: "Failed to create admin user" }, { status: 500 })
  }
}

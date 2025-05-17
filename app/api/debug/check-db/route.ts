import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Check if users table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'users'
      );
    `

    const usersTableExists = tableCheck[0].exists

    if (!usersTableExists) {
      return NextResponse.json({
        success: false,
        message: "Users table does not exist",
        tables: await listTables(),
      })
    }

    // Check users in the database (limit sensitive data)
    const users = await sql`
      SELECT id, name, email, username, role, restaurant_id 
      FROM users
    `

    return NextResponse.json({
      success: true,
      usersCount: users.length,
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        username: u.username,
        role: u.role,
      })),
    })
  } catch (error) {
    console.error("Database check error:", error)
    return NextResponse.json(
      {
        success: false,
        error: String(error),
        message: "Failed to check database",
      },
      { status: 500 },
    )
  }
}

// Helper function to list all tables
async function listTables() {
  try {
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `
    return tables.map((t) => t.table_name)
  } catch (error) {
    return ["Error listing tables"]
  }
}

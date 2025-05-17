import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/db"
import bcrypt from "bcryptjs"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Initialize database
    const initResult = await initializeDatabase()

    if (!initResult.success) {
      return NextResponse.json({ success: false, error: "Failed to initialize database" }, { status: 500 })
    }

    // Check if we already have a superuser
    const superuserCheck = await sql`
      SELECT COUNT(*) as count FROM users WHERE role = 'superuser'
    `

    if (superuserCheck[0].count === 0) {
      // Create default superuser
      const passwordHash = await bcrypt.hash("admin123", 10)

      await sql`
        INSERT INTO users (name, email, username, password_hash, role)
        VALUES ('Admin User', 'admin@example.com', 'admin', ${passwordHash}, 'superuser')
      `

      // Create a sample restaurant and owner
      const restaurantResult = await sql`
        INSERT INTO restaurants (name, description)
        VALUES ('Burger Palace', 'Delicious burgers and more')
        RETURNING id
      `

      const restaurantId = restaurantResult[0].id

      // Create owner user
      const ownerPasswordHash = await bcrypt.hash("Mlg0718!!", 10)

      await sql`
        INSERT INTO users (name, email, username, password_hash, role, restaurant_id)
        VALUES ('Jeff G', 'jeffg@restaurant.com', 'jeffg', ${ownerPasswordHash}, 'owner', ${restaurantId})
      `

      // Create sample locations
      await sql`
        INSERT INTO locations (restaurant_id, name, address, city, state, zip_code, phone, email)
        VALUES 
          (${restaurantId}, 'Downtown', '123 Main St', 'New York', 'NY', '10001', '555-123-4567', 'downtown@burgerpalace.com'),
          (${restaurantId}, 'Uptown', '456 Park Ave', 'New York', 'NY', '10022', '555-987-6543', 'uptown@burgerpalace.com')
      `
    }

    return NextResponse.json({ success: true, message: "Database initialized successfully" })
  } catch (error) {
    console.error("Database initialization error:", error)
    return NextResponse.json({ success: false, error: "Database initialization failed" }, { status: 500 })
  }
}

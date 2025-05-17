import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    // Create users table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) UNIQUE,
        password_hash TEXT NOT NULL,
        role VARCHAR(50) NOT NULL,
        restaurant_id INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Create restaurants table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS restaurants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        logo_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Create locations table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS locations (
        id SERIAL PRIMARY KEY,
        restaurant_id INTEGER,
        name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        zip_code VARCHAR(20) NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(255),
        delivery_radius DECIMAL(5,2) DEFAULT 4.9,
        delivery_fee DECIMAL(10,2) DEFAULT 7.99,
        convenience_fee_percentage DECIMAL(5,2) DEFAULT 5.0,
        tax_rate DECIMAL(5,2) DEFAULT 8.0,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Check if admin user exists
    const adminCheck = await sql`
      SELECT COUNT(*) as count FROM users WHERE role = 'superuser'
    `

    if (adminCheck[0].count === 0) {
      // Create admin user with a simple password for testing
      const adminPasswordHash = await bcrypt.hash("admin123", 10)

      await sql`
        INSERT INTO users (name, email, username, password_hash, role)
        VALUES ('Admin User', 'admin@example.com', 'admin', ${adminPasswordHash}, 'superuser')
      `

      // Create a sample restaurant
      const restaurantResult = await sql`
        INSERT INTO restaurants (name, description)
        VALUES ('Burger Palace', 'Delicious burgers and more')
        RETURNING id
      `

      const restaurantId = restaurantResult[0].id

      // Create restaurant owner
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

    // Check users in the database (limit sensitive data)
    const users = await sql`
      SELECT id, name, email, username, role, restaurant_id 
      FROM users
    `

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
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
    console.error("Database initialization error:", error)
    return NextResponse.json(
      {
        success: false,
        error: String(error),
        message: "Failed to initialize database",
      },
      { status: 500 },
    )
  }
}

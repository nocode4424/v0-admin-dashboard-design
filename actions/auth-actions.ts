"use server"

import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { formatDbError } from "@/lib/db"

// Secret key for JWT
const secretKey = new TextEncoder().encode(
  process.env.STACK_SECRET_SERVER_KEY || "default-secret-key-for-jwt-please-change-in-production",
)

// JWT expiration time (24 hours)
const expTime = "24h"

// User type
export type User = {
  id: number
  name: string
  email: string
  role: "superuser" | "owner" | "manager" | "staff"
  restaurantId?: number
}

// Create a JWT token
async function createToken(user: User) {
  const token = await new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    restaurantId: user.restaurantId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expTime)
    .sign(secretKey)

  return token
}

// Verify a JWT token
export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, secretKey)
    return verified.payload as unknown as User
  } catch (error) {
    return null
  }
}

// Login action
export async function login(usernameOrFormData: string | FormData, password?: string) {
  let username: string
  let passwordValue: string

  // Handle both direct parameters and FormData
  if (typeof usernameOrFormData === "object" && usernameOrFormData instanceof FormData) {
    username = usernameOrFormData.get("username") as string
    passwordValue = usernameOrFormData.get("password") as string
  } else {
    username = usernameOrFormData
    passwordValue = password || ""
  }

  if (!username || !passwordValue) {
    return { success: false, message: "Username and password are required" }
  }

  try {
    console.log(`Attempting login for user: ${username}`)

    // Find user by username or email
    const users = await sql`
      SELECT id, name, email, username, password_hash, role, restaurant_id 
      FROM users 
      WHERE email = ${username} OR username = ${username}
    `

    if (users.length === 0) {
      console.log(`No user found with username/email: ${username}`)
      return { success: false, message: "Invalid username or password" }
    }

    const user = users[0]
    console.log(`User found: ${user.name}, role: ${user.role}`)

    // Check password
    const passwordMatch = await bcrypt.compare(passwordValue, user.password_hash)

    if (!passwordMatch) {
      console.log(`Password mismatch for user: ${username}`)
      return { success: false, message: "Invalid username or password" }
    }

    console.log(`Password match for user: ${username}`)

    // Create user object
    const userObj: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as "superuser" | "owner" | "manager" | "staff",
      restaurantId: user.restaurant_id,
    }

    // Create token
    const token = await createToken(userObj)
    console.log(`Token created for user: ${username}`)

    // Set cookie
    cookies().set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })
    console.log(`Cookie set for user: ${username}`)

    return {
      success: true,
      user: {
        id: userObj.id,
        name: userObj.name,
        email: userObj.email,
        role: userObj.role,
        restaurantId: userObj.restaurantId,
      },
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      message: formatDbError(error),
    }
  }
}

// Logout action
export async function logout() {
  cookies().delete("auth-token")
  return { success: true }
}

// Get current user
export async function getCurrentUser() {
  const token = cookies().get("auth-token")?.value

  if (!token) {
    return null
  }

  try {
    const user = await verifyToken(token)
    return user
  } catch (error) {
    return null
  }
}

// Helper function to check if database is initialized
export async function isDatabaseInitialized() {
  try {
    // Check if users table exists and has at least one user
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'users'
      );
    `

    if (!result[0].exists) {
      return false
    }

    const userCount = await sql`
      SELECT COUNT(*) as count FROM users
    `

    return userCount[0].count > 0
  } catch (error) {
    console.error("Error checking database initialization:", error)
    return false
  }
}

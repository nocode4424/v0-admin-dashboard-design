"use server"

import { sql } from "@/lib/db"
import { getCurrentUser } from "./auth-actions"
import bcrypt from "bcryptjs"
import { formatDbError } from "@/lib/db"

// Get all restaurants
export async function getRestaurants() {
  const currentUser = await getCurrentUser()

  // Only superusers can see all restaurants
  if (!currentUser || currentUser.role !== "superuser") {
    return { success: false, message: "Unauthorized" }
  }

  try {
    const restaurants = await sql`
      SELECT r.id, r.name, r.description, r.logo_url, r.created_at,
        (SELECT COUNT(*) FROM locations WHERE restaurant_id = r.id) as location_count,
        (SELECT name FROM users WHERE restaurant_id = r.id AND role = 'owner' LIMIT 1) as owner_name,
        (SELECT email FROM users WHERE restaurant_id = r.id AND role = 'owner' LIMIT 1) as owner_email,
        'active' as status
      FROM restaurants r
      ORDER BY r.name ASC
    `

    return { success: true, restaurants }
  } catch (error) {
    console.error("Error fetching restaurants:", error)
    return { success: false, message: formatDbError(error) }
  }
}

// Get a single restaurant
export async function getRestaurant(id: number) {
  const currentUser = await getCurrentUser()

  // Superusers can see any restaurant, owners can only see their own
  if (!currentUser) {
    return { success: false, message: "Unauthorized" }
  }

  if (currentUser.role === "owner" && currentUser.restaurantId !== id) {
    return { success: false, message: "Unauthorized" }
  }

  try {
    const restaurants = await sql`
      SELECT r.*, 
        (SELECT COUNT(*) FROM locations WHERE restaurant_id = r.id) as location_count
      FROM restaurants r
      WHERE r.id = ${id}
    `

    if (restaurants.length === 0) {
      return { success: false, message: "Restaurant not found" }
    }

    return { success: true, restaurant: restaurants[0] }
  } catch (error) {
    console.error("Error fetching restaurant:", error)
    return { success: false, message: formatDbError(error) }
  }
}

// Create a restaurant
export async function createRestaurant(formData: FormData) {
  const currentUser = await getCurrentUser()

  // Only superusers can create restaurants
  if (!currentUser || currentUser.role !== "superuser") {
    return { success: false, message: "Unauthorized" }
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const ownerName = formData.get("ownerName") as string
  const ownerEmail = formData.get("ownerEmail") as string
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (!name || !ownerName || !ownerEmail || !username || !password) {
    return { success: false, message: "All fields are required" }
  }

  try {
    // Start a transaction
    const result = await sql.begin(async (sql) => {
      // Create restaurant
      const newRestaurant = await sql`
        INSERT INTO restaurants (name, description)
        VALUES (${name}, ${description})
        RETURNING id
      `

      const restaurantId = newRestaurant[0].id

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10)

      // Create owner user
      await sql`
        INSERT INTO users (name, email, username, password_hash, role, restaurant_id)
        VALUES (${ownerName}, ${ownerEmail}, ${username}, ${passwordHash}, 'owner', ${restaurantId})
      `

      // Create default appearance settings
      await sql`
        INSERT INTO appearance_settings (restaurant_id, primary_color, secondary_color, accent_color)
        VALUES (${restaurantId}, '#0f172a', '#6366f1', '#f43f5e')
      `

      // Create default payment settings
      await sql`
        INSERT INTO payment_settings (restaurant_id, tip_preset_1, tip_preset_2, tip_preset_3)
        VALUES (${restaurantId}, 10.0, 15.0, 20.0)
      `

      // Create default loyalty settings
      await sql`
        INSERT INTO loyalty_settings (restaurant_id, program_name, points_per_dollar)
        VALUES (${restaurantId}, 'Loyalty Program', 10)
      `

      return { restaurantId }
    })

    return { success: true, restaurantId: result.restaurantId }
  } catch (error) {
    console.error("Error creating restaurant:", error)
    return { success: false, message: formatDbError(error) }
  }
}

// Update restaurant owner credentials
export async function updateRestaurantOwnerCredentials(restaurantId: number, formData: FormData) {
  const currentUser = await getCurrentUser()

  // Only superusers can update owner credentials
  if (!currentUser || currentUser.role !== "superuser") {
    return { success: false, message: "Unauthorized" }
  }

  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (!username || !password) {
    return { success: false, message: "Username and password are required" }
  }

  try {
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Update owner credentials
    await sql`
      UPDATE users
      SET username = ${username}, password_hash = ${passwordHash}, updated_at = CURRENT_TIMESTAMP
      WHERE restaurant_id = ${restaurantId} AND role = 'owner'
    `

    return { success: true }
  } catch (error) {
    console.error("Error updating owner credentials:", error)
    return { success: false, message: formatDbError(error) }
  }
}

// Delete a restaurant
export async function deleteRestaurant(id: number) {
  const currentUser = await getCurrentUser()

  // Only superusers can delete restaurants
  if (!currentUser || currentUser.role !== "superuser") {
    return { success: false, message: "Unauthorized" }
  }

  try {
    await sql`
      DELETE FROM restaurants
      WHERE id = ${id}
    `

    return { success: true }
  } catch (error) {
    console.error("Error deleting restaurant:", error)
    return { success: false, message: formatDbError(error) }
  }
}

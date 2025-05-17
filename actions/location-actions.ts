"use server"

import { sql } from "@/lib/db"
import { getCurrentUser } from "./auth-actions"
import { formatDbError } from "@/lib/db"

// Get all locations
export async function getLocations() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return { success: false, message: "Unauthorized" }
  }

  try {
    let locations

    if (currentUser.role === "superuser") {
      // Superusers can see all locations
      locations = await sql`
        SELECT l.*, r.name as restaurant_name
        FROM locations l
        JOIN restaurants r ON l.restaurant_id = r.id
        ORDER BY r.name, l.name
      `
    } else {
      // Other users can only see locations for their restaurant
      locations = await sql`
        SELECT l.*, r.name as restaurant_name
        FROM locations l
        JOIN restaurants r ON l.restaurant_id = r.id
        WHERE l.restaurant_id = ${currentUser.restaurantId}
        ORDER BY l.name
      `
    }

    return { success: true, locations }
  } catch (error) {
    console.error("Error fetching locations:", error)
    return { success: false, message: formatDbError(error) }
  }
}

// Get locations for a specific restaurant
export async function getRestaurantLocations(restaurantId: number) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return { success: false, message: "Unauthorized" }
  }

  // Owners can only see their own restaurant's locations
  if (currentUser.role === "owner" && currentUser.restaurantId !== restaurantId) {
    return { success: false, message: "Unauthorized" }
  }

  try {
    const locations = await sql`
      SELECT l.*
      FROM locations l
      WHERE l.restaurant_id = ${restaurantId}
      ORDER BY l.name
    `

    return { success: true, locations }
  } catch (error) {
    console.error("Error fetching restaurant locations:", error)
    return { success: false, message: formatDbError(error) }
  }
}

// Create a location
export async function createLocation(formData: FormData) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return { success: false, message: "Unauthorized" }
  }

  const restaurantId = Number.parseInt(formData.get("restaurantId") as string)

  // Validate permissions
  if (currentUser.role !== "superuser" && currentUser.restaurantId !== restaurantId) {
    return { success: false, message: "Unauthorized" }
  }

  const name = formData.get("name") as string
  const address = formData.get("address") as string
  const city = formData.get("city") as string
  const state = formData.get("state") as string
  const zipCode = formData.get("zipCode") as string
  const phone = formData.get("phone") as string
  const email = formData.get("email") as string

  if (!name || !address || !city || !state || !zipCode) {
    return { success: false, message: "Required fields are missing" }
  }

  try {
    const result = await sql`
      INSERT INTO locations (
        restaurant_id, name, address, city, state, zip_code, phone, email
      )
      VALUES (
        ${restaurantId}, ${name}, ${address}, ${city}, ${state}, ${zipCode}, ${phone}, ${email}
      )
      RETURNING id
    `

    return { success: true, locationId: result[0].id }
  } catch (error) {
    console.error("Error creating location:", error)
    return { success: false, message: formatDbError(error) }
  }
}

// Update a location
export async function updateLocation(id: number, formData: FormData) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return { success: false, message: "Unauthorized" }
  }

  // Get the location to check permissions
  const locationResult = await sql`
    SELECT restaurant_id FROM locations WHERE id = ${id}
  `

  if (locationResult.length === 0) {
    return { success: false, message: "Location not found" }
  }

  const restaurantId = locationResult[0].restaurant_id

  // Validate permissions
  if (currentUser.role !== "superuser" && currentUser.restaurantId !== restaurantId) {
    return { success: false, message: "Unauthorized" }
  }

  const name = formData.get("name") as string
  const address = formData.get("address") as string
  const city = formData.get("city") as string
  const state = formData.get("state") as string
  const zipCode = formData.get("zipCode") as string
  const phone = formData.get("phone") as string
  const email = formData.get("email") as string
  const status = formData.get("status") as string
  const deliveryRadius = Number.parseFloat(formData.get("deliveryRadius") as string)
  const deliveryFee = Number.parseFloat(formData.get("deliveryFee") as string)
  const convenienceFeePercentage = Number.parseFloat(formData.get("convenienceFeePercentage") as string)
  const taxRate = Number.parseFloat(formData.get("taxRate") as string)

  try {
    await sql`
      UPDATE locations
      SET 
        name = ${name},
        address = ${address},
        city = ${city},
        state = ${state},
        zip_code = ${zipCode},
        phone = ${phone},
        email = ${email},
        status = ${status},
        delivery_radius = ${deliveryRadius},
        delivery_fee = ${deliveryFee},
        convenience_fee_percentage = ${convenienceFeePercentage},
        tax_rate = ${taxRate},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    return { success: true }
  } catch (error) {
    console.error("Error updating location:", error)
    return { success: false, message: formatDbError(error) }
  }
}

// Delete a location
export async function deleteLocation(id: number) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return { success: false, message: "Unauthorized" }
  }

  // Get the location to check permissions
  const locationResult = await sql`
    SELECT restaurant_id FROM locations WHERE id = ${id}
  `

  if (locationResult.length === 0) {
    return { success: false, message: "Location not found" }
  }

  const restaurantId = locationResult[0].restaurant_id

  // Validate permissions
  if (currentUser.role !== "superuser" && currentUser.restaurantId !== restaurantId) {
    return { success: false, message: "Unauthorized" }
  }

  try {
    await sql`
      DELETE FROM locations
      WHERE id = ${id}
    `

    return { success: true }
  } catch (error) {
    console.error("Error deleting location:", error)
    return { success: false, message: formatDbError(error) }
  }
}

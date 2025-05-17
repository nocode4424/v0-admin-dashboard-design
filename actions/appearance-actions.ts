"use server"

import { sql } from "@/lib/db"
import { getCurrentUser } from "./auth-actions"
import { formatDbError } from "@/lib/db"

// Get appearance settings for a restaurant
export async function getAppearanceSettings(restaurantId?: number) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return { success: false, message: "Unauthorized" }
  }

  // Determine which restaurant to fetch settings for
  const targetRestaurantId = restaurantId || currentUser.restaurantId

  // Owners can only see their own restaurant's settings
  if (currentUser.role === "owner" && currentUser.restaurantId !== targetRestaurantId) {
    return { success: false, message: "Unauthorized" }
  }

  try {
    const settings = await sql`
      SELECT * FROM appearance_settings
      WHERE restaurant_id = ${targetRestaurantId}
    `

    if (settings.length === 0) {
      // Return default settings if none exist
      return {
        success: true,
        settings: {
          primary_color: "#0f172a",
          secondary_color: "#6366f1",
          accent_color: "#f43f5e",
          background_color: "#ffffff",
          card_color: "#f8fafc",
          text_color: "#0f172a",
          layout_type: "grid",
        },
      }
    }

    return { success: true, settings: settings[0] }
  } catch (error) {
    console.error("Error fetching appearance settings:", error)
    return { success: false, message: formatDbError(error) }
  }
}

// Update appearance settings
export async function updateAppearanceSettings(formData: FormData) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return { success: false, message: "Unauthorized" }
  }

  const restaurantId = Number.parseInt(formData.get("restaurantId") as string) || currentUser.restaurantId

  // Validate permissions
  if (currentUser.role !== "superuser" && currentUser.restaurantId !== restaurantId) {
    return { success: false, message: "Unauthorized" }
  }

  const primaryColor = formData.get("primaryColor") as string
  const secondaryColor = formData.get("secondaryColor") as string
  const accentColor = formData.get("accentColor") as string
  const backgroundColor = formData.get("backgroundColor") as string
  const cardColor = formData.get("cardColor") as string
  const textColor = formData.get("textColor") as string
  const layoutType = formData.get("layoutType") as string

  try {
    // Check if settings exist
    const existingSettings = await sql`
      SELECT id FROM appearance_settings
      WHERE restaurant_id = ${restaurantId}
    `

    if (existingSettings.length === 0) {
      // Create new settings
      await sql`
        INSERT INTO appearance_settings (
          restaurant_id, primary_color, secondary_color, accent_color,
          background_color, card_color, text_color, layout_type
        )
        VALUES (
          ${restaurantId}, ${primaryColor}, ${secondaryColor}, ${accentColor},
          ${backgroundColor}, ${cardColor}, ${textColor}, ${layoutType}
        )
      `
    } else {
      // Update existing settings
      await sql`
        UPDATE appearance_settings
        SET 
          primary_color = ${primaryColor},
          secondary_color = ${secondaryColor},
          accent_color = ${accentColor},
          background_color = ${backgroundColor},
          card_color = ${cardColor},
          text_color = ${textColor},
          layout_type = ${layoutType},
          updated_at = CURRENT_TIMESTAMP
        WHERE restaurant_id = ${restaurantId}
      `
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating appearance settings:", error)
    return { success: false, message: formatDbError(error) }
  }
}

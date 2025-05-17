"use server"

import { sql } from "@/lib/db"
import { getCurrentUser } from "./auth-actions"
import { formatDbError } from "@/lib/db"

// Get categories for a restaurant
export async function getCategories(restaurantId?: number) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return { success: false, message: "Unauthorized" }
  }

  // Determine which restaurant to fetch categories for
  const targetRestaurantId = restaurantId || currentUser.restaurantId

  // Owners can only see their own restaurant's categories
  if (currentUser.role === "owner" && currentUser.restaurantId !== targetRestaurantId) {
    return { success: false, message: "Unauthorized" }
  }

  try {
    const categories = await sql`
      SELECT c.*, 
        (SELECT COUNT(*) FROM menu_items WHERE category_id = c.id) as item_count
      FROM categories c
      WHERE c.restaurant_id = ${targetRestaurantId}
      ORDER BY c.display_order, c.name
    `

    return { success: true, categories }
  } catch (error) {
    console.error("Error fetching categories:", error)
    return { success: false, message: formatDbError(error) }
  }
}

// Create a category
export async function createCategory(formData: FormData) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return { success: false, message: "Unauthorized" }
  }

  const restaurantId = Number.parseInt(formData.get("restaurantId") as string) || currentUser.restaurantId

  // Validate permissions
  if (currentUser.role !== "superuser" && currentUser.restaurantId !== restaurantId) {
    return { success: false, message: "Unauthorized" }
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const imageUrl = formData.get("imageUrl") as string
  const displayOrder = Number.parseInt(formData.get("displayOrder") as string) || 0
  const isActive = formData.get("isActive") === "true"

  if (!name) {
    return { success: false, message: "Category name is required" }
  }

  try {
    const result = await sql`
      INSERT INTO categories (
        restaurant_id, name, description, image_url, display_order, is_active
      )
      VALUES (
        ${restaurantId}, ${name}, ${description}, ${imageUrl}, ${displayOrder}, ${isActive}
      )
      RETURNING id
    `

    return { success: true, categoryId: result[0].id }
  } catch (error) {
    console.error("Error creating category:", error)
    return { success: false, message: formatDbError(error) }
  }
}

// Update a category
export async function updateCategory(id: number, formData: FormData) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return { success: false, message: "Unauthorized" }
  }

  // Get the category to check permissions
  const categoryResult = await sql`
    SELECT restaurant_id FROM categories WHERE id = ${id}
  `

  if (categoryResult.length === 0) {
    return { success: false, message: "Category not found" }
  }

  const restaurantId = categoryResult[0].restaurant_id

  // Validate permissions
  if (currentUser.role !== "superuser" && currentUser.restaurantId !== restaurantId) {
    return { success: false, message: "Unauthorized" }
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const imageUrl = formData.get("imageUrl") as string
  const displayOrder = Number.parseInt(formData.get("displayOrder") as string) || 0
  const isActive = formData.get("isActive") === "true"

  if (!name) {
    return { success: false, message: "Category name is required" }
  }

  try {
    await sql`
      UPDATE categories
      SET 
        name = ${name},
        description = ${description},
        image_url = ${imageUrl},
        display_order = ${displayOrder},
        is_active = ${isActive},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    return { success: true }
  } catch (error) {
    console.error("Error updating category:", error)
    return { success: false, message: formatDbError(error) }
  }
}

// Delete a category
export async function deleteCategory(id: number) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return { success: false, message: "Unauthorized" }
  }

  // Get the category to check permissions
  const categoryResult = await sql`
    SELECT restaurant_id FROM categories WHERE id = ${id}
  `

  if (categoryResult.length === 0) {
    return { success: false, message: "Category not found" }
  }

  const restaurantId = categoryResult[0].restaurant_id

  // Validate permissions
  if (currentUser.role !== "superuser" && currentUser.restaurantId !== restaurantId) {
    return { success: false, message: "Unauthorized" }
  }

  try {
    await sql`
      DELETE FROM categories
      WHERE id = ${id}
    `

    return { success: true }
  } catch (error) {
    console.error("Error deleting category:", error)
    return { success: false, message: formatDbError(error) }
  }
}

// Get menu items for a restaurant
export async function getMenuItems(restaurantId?: number, categoryId?: number) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return { success: false, message: "Unauthorized" }
  }

  // Determine which restaurant to fetch menu items for
  const targetRestaurantId = restaurantId || currentUser.restaurantId

  // Owners can only see their own restaurant's menu items
  if (currentUser.role === "owner" && currentUser.restaurantId !== targetRestaurantId) {
    return { success: false, message: "Unauthorized" }
  }

  try {
    let menuItems

    if (categoryId) {
      menuItems = await sql`
        SELECT m.*, c.name as category_name
        FROM menu_items m
        LEFT JOIN categories c ON m.category_id = c.id
        WHERE m.restaurant_id = ${targetRestaurantId} AND m.category_id = ${categoryId}
        ORDER BY m.name
      `
    } else {
      menuItems = await sql`
        SELECT m.*, c.name as category_name
        FROM menu_items m
        LEFT JOIN categories c ON m.category_id = c.id
        WHERE m.restaurant_id = ${targetRestaurantId}
        ORDER BY c.display_order, c.name, m.name
      `
    }

    return { success: true, menuItems }
  } catch (error) {
    console.error("Error fetching menu items:", error)
    return { success: false, message: formatDbError(error) }
  }
}

// Create a menu item
export async function createMenuItem(formData: FormData) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return { success: false, message: "Unauthorized" }
  }

  const restaurantId = Number.parseInt(formData.get("restaurantId") as string) || currentUser.restaurantId

  // Validate permissions
  if (currentUser.role !== "superuser" && currentUser.restaurantId !== restaurantId) {
    return { success: false, message: "Unauthorized" }
  }

  const categoryId = Number.parseInt(formData.get("categoryId") as string)
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const imageUrl = formData.get("imageUrl") as string
  const isAvailable = formData.get("isAvailable") === "true"
  const prepTime = Number.parseInt(formData.get("prepTime") as string) || null
  const isVegetarian = formData.get("isVegetarian") === "true"
  const isVegan = formData.get("isVegan") === "true"
  const isGlutenFree = formData.get("isGlutenFree") === "true"
  const allowSpecialInstructions = formData.get("allowSpecialInstructions") === "true"

  if (!name || isNaN(price)) {
    return { success: false, message: "Name and price are required" }
  }

  try {
    const result = await sql`
      INSERT INTO menu_items (
        restaurant_id, category_id, name, description, price, image_url, 
        is_available, prep_time, is_vegetarian, is_vegan, is_gluten_free, 
        allow_special_instructions
      )
      VALUES (
        ${restaurantId}, ${categoryId}, ${name}, ${description}, ${price}, ${imageUrl},
        ${isAvailable}, ${prepTime}, ${isVegetarian}, ${isVegan}, ${isGlutenFree},
        ${allowSpecialInstructions}
      )
      RETURNING id
    `

    return { success: true, menuItemId: result[0].id }
  } catch (error) {
    console.error("Error creating menu item:", error)
    return { success: false, message: formatDbError(error) }
  }
}

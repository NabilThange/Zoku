"use server"

import { createAdminClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Database } from "@/lib/types/database"

type MenuItemInsert = Database["public"]["Tables"]["menu_items"]["Insert"]
type MenuItemUpdate = Database["public"]["Tables"]["menu_items"]["Update"]

export async function addMenuItem(data: {
  name: string
  description?: string
  price: number
  image_url?: string
  category?: string // Accept category name instead of category_id
  category_id?: string
  is_veg: boolean
  prep_time: number
  calories?: number
  is_spicy?: boolean
  is_bestseller?: boolean
  is_popular?: boolean
  nutritional_info?: Record<string, any>
  tags?: string[]
  ingredients?: string[]
  is_available?: boolean
}) {
  const supabase = await createAdminClient()

  // Validate required fields
  if (!data.name || !data.price || !data.prep_time || data.prep_time <= 0) {
    throw new Error("Name, price, and prep time are required fields")
  }

  let categoryId = data.category_id
  if (!categoryId && data.category) {
    const { data: categories, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("name", data.category.toLowerCase())
      .limit(1)

    if (categoryError) {
      console.error("Error fetching category:", categoryError)
    }

    categoryId = categories?.[0]?.id
  }

  if (!categoryId) {
    const { data: defaultCategories } = await supabase.from("categories").select("id").limit(1)
    categoryId = defaultCategories?.[0]?.id
  }

  const prepTime = Number(data.prep_time)
  if (isNaN(prepTime) || prepTime <= 0) {
    throw new Error("Prep time must be a valid positive number")
  }

  const menuItem: MenuItemInsert = {
    name: data.name.trim(),
    description: data.description?.trim() || null,
    price: Number(data.price), // Ensure price is a number
    image_url: data.image_url || null,
    category_id: categoryId,
    is_veg: Boolean(data.is_veg), // Ensure boolean type
    prep_time: prepTime, // Use validated prep_time
    calories: data.calories ? Number(data.calories) : null, // Ensure calories is a number or null
    is_spicy: Boolean(data.is_spicy || false),
    is_bestseller: Boolean(data.is_bestseller || false),
    is_popular: Boolean(data.is_popular || false),
    nutritional_info: data.nutritional_info ? JSON.stringify(data.nutritional_info) : "{}",
    tags: data.tags ? JSON.stringify(data.tags) : "[]",
    ingredients: data.ingredients ? JSON.stringify(data.ingredients) : "[]",
    is_available: Boolean(data.is_available ?? true),
    stock_quantity: 50, // Default stock
    rating: 0,
    review_count: 0,
  }

  console.log("[v0] Adding menu item with data:", {
    name: menuItem.name,
    prep_time: menuItem.prep_time,
    category_id: menuItem.category_id,
    price: menuItem.price,
  })

  const { data: newItems, error } = await supabase.from("menu_items").insert(menuItem).select()

  if (error) {
    console.error("Error adding menu item:", error)
    throw new Error(`Failed to add menu item: ${error.message}`)
  }

  if (!newItems || newItems.length === 0) {
    throw new Error("Failed to add menu item: No data returned")
  }

  revalidatePath("/app")
  revalidatePath("/")

  return newItems[0]
}

export async function updateMenuItem(
  id: string,
  updates: {
    name?: string
    description?: string
    price?: number
    image_url?: string
    is_veg?: boolean
    prep_time?: number
    calories?: number
    is_spicy?: boolean
    is_bestseller?: boolean
    is_popular?: boolean
    nutritional_info?: Record<string, any>
    tags?: string[]
    ingredients?: string[]
    is_available?: boolean
  },
) {
  const supabase = await createAdminClient()

  // Process JSONB fields
  const processedUpdates: any = { ...updates }
  if (updates.nutritional_info !== undefined) {
    processedUpdates.nutritional_info = JSON.stringify(updates.nutritional_info)
  }
  if (updates.tags !== undefined) {
    processedUpdates.tags = JSON.stringify(updates.tags)
  }
  if (updates.ingredients !== undefined) {
    processedUpdates.ingredients = JSON.stringify(updates.ingredients)
  }

  const { data: updatedItems, error } = await supabase.from("menu_items").update(processedUpdates).eq("id", id).select()

  if (error) {
    console.error("Error updating menu item:", error)
    throw new Error(`Failed to update menu item: ${error.message}`)
  }

  if (!updatedItems || updatedItems.length === 0) {
    throw new Error("Failed to update menu item: Item not found or no changes made")
  }

  revalidatePath("/app")
  revalidatePath("/")

  return updatedItems[0]
}

export async function deleteMenuItem(id: string) {
  const supabase = await createAdminClient()

  const { error } = await supabase.from("menu_items").delete().eq("id", id)

  if (error) {
    console.error("Error deleting menu item:", error)
    throw new Error(`Failed to delete menu item: ${error.message}`)
  }

  revalidatePath("/app")
  revalidatePath("/")

  return { success: true }
}

export async function toggleMenuItemAvailability(id: string, is_available: boolean) {
  const supabase = await createAdminClient()

  const { data: updatedItems, error } = await supabase.from("menu_items").update({ is_available }).eq("id", id).select()

  if (error) {
    console.error("Error toggling menu item availability:", error)
    throw new Error(`Failed to update menu item availability: ${error.message}`)
  }

  if (!updatedItems || updatedItems.length === 0) {
    throw new Error("Failed to update menu item availability: Item not found")
  }

  revalidatePath("/app")
  revalidatePath("/")

  return updatedItems[0]
}

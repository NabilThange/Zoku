import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/types/database"

type MenuItemRow = Database["public"]["Tables"]["menu_items"]["Row"]
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"]

export interface StaffMenuItem {
  id: string
  name: string
  price: number
  description?: string
  category: string
  isVeg: boolean
  available: boolean
  prepTime: number
  image?: string
}

export async function getAllMenuItemsForStaff(): Promise<StaffMenuItem[]> {
  const supabase = createClient()

  const { data: menuItems, error } = await supabase
    .from("menu_items")
    .select(`
      *,
      categories (
        name,
        display_name
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching menu items for staff:", error)
    return []
  }

  return menuItems.map(
    (item): StaffMenuItem => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      description: item.description || undefined,
      category: item.categories?.name || "other",
      isVeg: item.is_veg,
      available: item.is_available,
      prepTime: item.prep_time,
      image: item.image_url || undefined,
    }),
  )
}

export async function getCategoriesForStaff(): Promise<CategoryRow[]> {
  const supabase = createClient()

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")

  if (error) {
    console.error("Error fetching categories for staff:", error)
    return []
  }

  return categories || []
}

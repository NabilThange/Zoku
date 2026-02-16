import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/types/database"
import { mockMenuItems } from "@/data/mock-menu-items"

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"]

export interface MenuItem {
  id: number
  name: string
  price: number
  image: string
  category: string
  isVeg: boolean
  prepTime: number
  available: boolean
  description?: string
  rating?: number
  reviewCount?: number
  isSpicy?: boolean
  isPopular?: boolean
  isBestseller?: boolean
  calories?: number
  originalPrice?: number
  tags?: string[]
  ingredients?: string[]
  allergens?: string[]
  nutritionalInfo?: {
    protein?: number
    carbs?: number
    fat?: number
    fiber?: number
    [key: string]: number | undefined // Allow dynamic nutritional keys
  }
  chef?: string
  stockQuantity?: number
  minimumOrderQuantity?: number
  truckName?: string
  truckId?: number
  customizations?: Array<{
    id: string
    name: string
    options: Array<{
      name: string
      price: number
    }>
  }>
}

const FALLBACK_MENU_ITEMS: MenuItem[] = mockMenuItems

const FALLBACK_CATEGORIES: CategoryRow[] = [
  {
    id: "1",
    name: "street-food",
    display_name: "Street Food",
    icon: null,
    is_active: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "main",
    display_name: "Main Course",
    icon: null,
    is_active: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "south-indian",
    display_name: "South Indian",
    icon: null,
    is_active: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "snack",
    display_name: "Snacks",
    icon: null,
    is_active: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "dessert",
    display_name: "Desserts",
    icon: null,
    is_active: true,
    sort_order: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    name: "drink",
    display_name: "Beverages",
    icon: null,
    is_active: true,
    sort_order: 6,
    created_at: new Date().toISOString(),
  },
]

export async function getMenuItems(): Promise<MenuItem[]> {
  try {
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
      .order("is_popular", { ascending: false })
      .order("rating", { ascending: false })

    if (error) {
      console.error("Error fetching menu items:", error)
      console.log("[v0] Using fallback menu items due to Supabase error")
      return FALLBACK_MENU_ITEMS
    }

    return menuItems.map(
      (item): MenuItem => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        originalPrice: item.original_price ? Number(item.original_price) : undefined,
        image: item.image_url || `/placeholder.svg?height=180&width=240&query=${encodeURIComponent(item.name)}`,
        category: item.categories?.name || "other",
        isVeg: item.is_veg,
        prepTime: item.prep_time,
        available: item.is_available,
        description: item.description || undefined,
        rating: item.rating ? Number(item.rating) : undefined,
        reviewCount: item.review_count || undefined,
        isSpicy: item.is_spicy || false,
        isPopular: item.is_popular || false,
        isBestseller: item.is_bestseller || false,
        calories: item.calories || undefined,
        tags: Array.isArray(item.tags) ? item.tags : [],
        ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
        allergens: Array.isArray(item.allergens) ? item.allergens : [],
        nutritionalInfo: item.nutritional_info as MenuItem["nutritionalInfo"],
        chef: item.chef || undefined,
        stockQuantity: item.stock_quantity || undefined,
        minimumOrderQuantity: item.minimum_order_quantity || 1,
      }),
    )
  } catch (error) {
    console.error("Network error fetching menu items:", error)
    console.log("[v0] Using fallback menu items due to network error")
    return FALLBACK_MENU_ITEMS
  }
}

export async function getMenuItemsByCategory(categoryName: string): Promise<MenuItem[]> {
  if (categoryName === "all") {
    return getMenuItems()
  }

  try {
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
      .eq("categories.name", categoryName)
      .order("is_popular", { ascending: false })
      .order("rating", { ascending: false })

    if (error) {
      console.error("Error fetching menu items by category:", error)
      return FALLBACK_MENU_ITEMS.filter((item) => item.category === categoryName)
    }

    return menuItems.map(
      (item): MenuItem => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        originalPrice: item.original_price ? Number(item.original_price) : undefined,
        image: item.image_url || `/placeholder.svg?height=180&width=240&query=${encodeURIComponent(item.name)}`,
        category: item.categories?.name || "other",
        isVeg: item.is_veg,
        prepTime: item.prep_time,
        available: item.is_available,
        description: item.description || undefined,
        rating: item.rating ? Number(item.rating) : undefined,
        reviewCount: item.review_count || undefined,
        isSpicy: item.is_spicy || false,
        isPopular: item.is_popular || false,
        isBestseller: item.is_bestseller || false,
        calories: item.calories || undefined,
        tags: Array.isArray(item.tags) ? item.tags : [],
        ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
        allergens: Array.isArray(item.allergens) ? item.allergens : [],
        nutritionalInfo: item.nutritional_info as MenuItem["nutritionalInfo"],
        chef: item.chef || undefined,
        stockQuantity: item.stock_quantity || undefined,
        minimumOrderQuantity: item.minimum_order_quantity || 1,
      }),
    )
  } catch (error) {
    console.error("Network error fetching menu items by category:", error)
    return FALLBACK_MENU_ITEMS.filter((item) => item.category === categoryName)
  }
}

export async function getCategories(): Promise<CategoryRow[]> {
  try {
    const supabase = createClient()

    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")

    if (error) {
      console.error("Error fetching categories:", error)
      console.log("[v0] Using fallback categories due to Supabase error")
      return FALLBACK_CATEGORIES
    }

    return categories || []
  } catch (error) {
    console.error("Network error fetching categories:", error)
    console.log("[v0] Using fallback categories due to network error")
    return FALLBACK_CATEGORIES
  }
}

export async function searchMenuItems(query: string): Promise<MenuItem[]> {
  try {
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
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.["${query}"]`)
      .order("is_popular", { ascending: false })
      .order("rating", { ascending: false })

    if (error) {
      console.error("Error searching menu items:", error)
      return FALLBACK_MENU_ITEMS.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase()) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
      )
    }

    return menuItems.map(
      (item): MenuItem => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        originalPrice: item.original_price ? Number(item.original_price) : undefined,
        image: item.image_url || `/placeholder.svg?height=180&width=240&query=${encodeURIComponent(item.name)}`,
        category: item.categories?.name || "other",
        isVeg: item.is_veg,
        prepTime: item.prep_time,
        available: item.is_available,
        description: item.description || undefined,
        rating: item.rating ? Number(item.rating) : undefined,
        reviewCount: item.review_count || undefined,
        isSpicy: item.is_spicy || false,
        isPopular: item.is_popular || false,
        isBestseller: item.is_bestseller || false,
        calories: item.calories || undefined,
        tags: Array.isArray(item.tags) ? item.tags : [],
        ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
        allergens: Array.isArray(item.allergens) ? item.allergens : [],
        nutritionalInfo: item.nutritional_info as MenuItem["nutritionalInfo"],
        chef: item.chef || undefined,
        stockQuantity: item.stock_quantity || undefined,
        minimumOrderQuantity: item.minimum_order_quantity || 1,
      }),
    )
  } catch (error) {
    console.error("Network error searching menu items:", error)
    return FALLBACK_MENU_ITEMS.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase()) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
    )
  }
}

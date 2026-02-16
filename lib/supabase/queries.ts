import { createClient } from "./server"
import type { MenuItem, Order, Category } from "../types/database"

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("categories").select("*").eq("is_active", true).order("sort_order")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data || []
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("menu_items")
    .select(`
      *,
      categories (
        id,
        name,
        display_name
      )
    `)
    .eq("is_available", true)
    .order("is_popular", { ascending: false })
    .order("rating", { ascending: false })

  if (error) {
    console.error("Error fetching menu items:", error)
    return []
  }

  return data || []
}

export async function getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("category_id", categoryId)
    .eq("is_available", true)
    .order("is_popular", { ascending: false })
    .order("rating", { ascending: false })

  if (error) {
    console.error("Error fetching menu items by category:", error)
    return []
  }

  return data || []
}

export async function createOrder(orderData: {
  subtotal: number
  total_amount: number
  payment_method: "upi" | "card" | "wallet" | "qr" | "cash"
  special_instructions?: string
  items: {
    menu_item_id: string
    menu_item_name: string
    menu_item_image_url?: string
    quantity: number
    unit_price: number
    total_price: number
    customizations?: any
    special_instructions?: string
  }[]
}): Promise<Order | null> {
  const supabase = await createClient()

  // Create the order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      subtotal: orderData.subtotal,
      total_amount: orderData.total_amount,
      payment_method: orderData.payment_method,
      special_instructions: orderData.special_instructions,
      estimated_prep_time: Math.max(
        ...orderData.items.map(
          (item) =>
            // Estimate based on quantity and complexity
            Math.ceil(item.quantity * 15), // 15 minutes base per item
        ),
      ),
    })
    .select()
    .single()

  if (orderError) {
    console.error("Error creating order:", orderError)
    return null
  }

  // Create order items
  const orderItems = orderData.items.map((item) => ({
    order_id: order.id,
    menu_item_id: item.menu_item_id,
    menu_item_name: item.menu_item_name,
    menu_item_image_url: item.menu_item_image_url,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.total_price,
    customizations: item.customizations,
    special_instructions: item.special_instructions,
  }))

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

  if (itemsError) {
    console.error("Error creating order items:", itemsError)
    return null
  }

  return order
}

export async function getOrders(): Promise<Order[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *
      )
    `)
    .order("placed_at", { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error)
    return []
  }

  return data || []
}

export async function updateOrderStatus(
  orderId: string,
  status: "placed" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled",
): Promise<boolean> {
  const supabase = await createClient()

  const updateData: any = { status }

  // Set appropriate timestamp based on status
  switch (status) {
    case "confirmed":
      updateData.confirmed_at = new Date().toISOString()
      break
    case "preparing":
      updateData.preparing_at = new Date().toISOString()
      break
    case "ready":
      updateData.ready_at = new Date().toISOString()
      break
    case "completed":
      updateData.completed_at = new Date().toISOString()
      break
    case "cancelled":
      updateData.cancelled_at = new Date().toISOString()
      break
  }

  const { error } = await supabase.from("orders").update(updateData).eq("id", orderId)

  if (error) {
    console.error("Error updating order status:", error)
    return false
  }

  return true
}

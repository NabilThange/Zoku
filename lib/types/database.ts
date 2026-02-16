export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          display_name: string
          icon: string | null
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          display_name: string
          icon?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          display_name?: string
          icon?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
      }
      menu_items: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          original_price: number | null
          image_url: string | null
          category_id: string | null
          is_veg: boolean
          is_available: boolean
          prep_time: number
          calories: number | null
          rating: number
          review_count: number
          is_spicy: boolean
          is_popular: boolean
          is_bestseller: boolean
          stock_quantity: number
          chef: string | null
          tags: any[] | null
          ingredients: any[] | null
          allergens: any[] | null
          nutritional_info: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          original_price?: number | null
          image_url?: string | null
          category_id?: string | null
          is_veg?: boolean
          is_available?: boolean
          prep_time: number
          calories?: number | null
          rating?: number
          review_count?: number
          is_spicy?: boolean
          is_popular?: boolean
          is_bestseller?: boolean
          stock_quantity?: number
          chef?: string | null
          tags?: any[] | null
          ingredients?: any[] | null
          allergens?: any[] | null
          nutritional_info?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          original_price?: number | null
          image_url?: string | null
          category_id?: string | null
          is_veg?: boolean
          is_available?: boolean
          prep_time?: number
          calories?: number | null
          rating?: number
          review_count?: number
          is_spicy?: boolean
          is_popular?: boolean
          is_bestseller?: boolean
          stock_quantity?: number
          chef?: string | null
          tags?: any[] | null
          ingredients?: any[] | null
          allergens?: any[] | null
          nutritional_info?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          order_number: string
          pickup_token: string
          status: "placed" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled"
          subtotal: number
          tax_amount: number
          discount_amount: number
          total_amount: number
          payment_method: "upi" | "card" | "wallet" | "qr" | "cash"
          payment_status: "pending" | "completed" | "failed" | "refunded"
          transaction_id: string | null
          estimated_prep_time: number | null
          actual_prep_time: number | null
          special_instructions: string | null
          placed_at: string
          confirmed_at: string | null
          preparing_at: string | null
          ready_at: string | null
          completed_at: string | null
          cancelled_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          order_number?: string
          pickup_token?: string
          status?: "placed" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled"
          subtotal: number
          tax_amount?: number
          discount_amount?: number
          total_amount: number
          payment_method: "upi" | "card" | "wallet" | "qr" | "cash"
          payment_status?: "pending" | "completed" | "failed" | "refunded"
          transaction_id?: string | null
          estimated_prep_time?: number | null
          actual_prep_time?: number | null
          special_instructions?: string | null
          placed_at?: string
          confirmed_at?: string | null
          preparing_at?: string | null
          ready_at?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          order_number?: string
          pickup_token?: string
          status?: "placed" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled"
          subtotal?: number
          tax_amount?: number
          discount_amount?: number
          total_amount?: number
          payment_method?: "upi" | "card" | "wallet" | "qr" | "cash"
          payment_status?: "pending" | "completed" | "failed" | "refunded"
          transaction_id?: string | null
          estimated_prep_time?: number | null
          actual_prep_time?: number | null
          special_instructions?: string | null
          placed_at?: string
          confirmed_at?: string | null
          preparing_at?: string | null
          ready_at?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          menu_item_id: string | null
          menu_item_name: string
          menu_item_image_url: string | null
          quantity: number
          unit_price: number
          total_price: number
          customizations: any | null
          special_instructions: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          menu_item_id?: string | null
          menu_item_name: string
          menu_item_image_url?: string | null
          quantity: number
          unit_price: number
          total_price: number
          customizations?: any | null
          special_instructions?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          menu_item_id?: string | null
          menu_item_name?: string
          menu_item_image_url?: string | null
          quantity?: number
          unit_price?: number
          total_price?: number
          customizations?: any | null
          special_instructions?: string | null
          created_at?: string
        }
      }
    }
  }
}

export type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"]
export type Order = Database["public"]["Tables"]["orders"]["Row"]
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"]
export type Category = Database["public"]["Tables"]["categories"]["Row"]

"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, MapPin, Phone, Search, Star, Coffee, Utensils, Cookie, Droplets } from "lucide-react"
import { MenuItemCard } from "@/components/student/menu-item-card"
import { CartSummary } from "@/components/student/cart-summary"
import { OrderManagement } from "@/components/staff/order-management"
import { MenuManagement } from "@/components/staff/menu-management"
import { ReportsDashboard } from "@/components/staff/reports-dashboard"
import { PaymentModal } from "@/components/payment/payment-modal"
import { PaymentSuccess } from "@/components/payment/payment-success"
import { useRealTimeOrders, useOrderTracking } from "@/hooks/use-real-time-orders"
import { ConnectionStatus } from "@/components/real-time/connection-status"
import { LiveOrderUpdates } from "@/components/real-time/live-order-updates"
import { OrderProgressTracker } from "@/components/real-time/order-progress-tracker"
import { StudentNavbar } from "@/components/navigation/student-navbar"
import { StaffNavbar } from "@/components/navigation/staff-navbar"
import { FloatingActionBar } from "@/components/student/floating-action-bar"
import { getMenuItems, getCategories, type MenuItem } from "@/lib/queries/menu"
import { getAllMenuItemsForStaff, type StaffMenuItem } from "@/lib/queries/staff-menu"
import { addMenuItem, updateMenuItem, deleteMenuItem, toggleMenuItemAvailability } from "@/lib/actions/menu-actions"

// Custom hook for debounced search
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function CantioApp() {
  const [userType, setUserType] = useState<"student" | "staff">("student")

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF8F5" }}>
      {/* Updated Header with logo.png */}
      <header
        className="p-4 sm:p-5 shadow-lg"
        style={{
          backgroundColor: "#FF6B35",
          color: "white",
          borderRadius: "0 0 20px 20px",
        }}
      >
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo with fallback */}
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shadow-md overflow-hidden"
              style={{
                backgroundColor: "white",
                border: "2px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <img
                src="/logo.png"
                alt="CANTIO"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to text if image fails to load
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                  const parent = target.parentElement
                  if (parent) {
                    parent.innerHTML = `<span class="font-bold text-lg sm:text-xl" style="color: #FF6B35">C</span>`
                  }
                }}
              />
            </div>
            <div>
              <h1 className="font-bold text-xl sm:text-2xl tracking-tight">ZOKU</h1>
              <p className="text-xs opacity-90 -mt-0.5">Campus Eats</p>
            </div>
          </div>

          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setUserType(userType === "student" ? "staff" : "student")}
            className="px-3 sm:px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 min-h-11"
            style={{
              color: "white",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)"
            }}
          >
            {userType === "student" ? "Staff Login" : "Student App"}
          </Button>
        </div>
      </header>

      {/* Main container */}
      <div className="max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto px-4 pt-4 pb-3 sm:px-5 sm:pt-5 sm:pb-4 md:px-6 md:pt-6 md:pb-5">
        {userType === "student" ? <StudentApp /> : <StaffApp />}
      </div>
    </div>
  )
}

function StudentApp() {
  const [cart, setCart] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("menu")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)
  const [paymentData, setPaymentData] = useState<any>(null)
  const [currentOrder, setCurrentOrder] = useState<any>(null)
  const [completedOrders, setCompletedOrders] = useState<any[]>([
    {
      id: 1233,
      token: "A101",
      items: [{ name: "Chicken Biryani", quantity: 1, price: 85 }],
      total: 85,
      status: "completed",
      completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 1232,
      token: "A100",
      items: [
        { name: "Veg Fried Rice", quantity: 1, price: 45 },
        { name: "Tea", quantity: 2, price: 10 },
      ],
      total: 65,
      status: "delivered",
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ])

  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { order: trackedOrder, trackOrder } = useOrderTracking(currentOrder?.id || "")

  const debouncedSearchQuery = useDebounce(searchQuery, 250)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)

        const [menuData, categoriesData] = await Promise.all([getMenuItems(), getCategories()])

        setMenuItems(menuData)
        setCategories([
          { id: "all", name: "All", icon: Star },
          ...categoriesData.map((cat) => ({
            id: cat.name,
            name: cat.display_name,
            icon:
              cat.name === "breakfast"
                ? Coffee
                : cat.name === "lunch"
                  ? Utensils
                  : cat.name === "snacks"
                    ? Cookie
                    : cat.name === "beverages"
                      ? Droplets
                      : Star,
          })),
        ])
      } catch (err) {
        console.error("Error loading data:", err)
        setError("Failed to load menu items")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Random "Need to Try" items - randomized on each page load
  const randomFeaturedItems = useMemo(() => {
    const availableItems = menuItems.filter((item) => item.available !== false)
    const shuffled = [...availableItems].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 3)
  }, [menuItems])

  // Van filters instead of food categories
  const vanFilters = [
    { id: "all", name: "All Vans", icon: "🚚", color: "#6B7280" },
    { id: "van-veg", name: "Veg Van", icon: "🥗", color: "#10B981" },
    { id: "van-nonveg", name: "Non-Veg Van", icon: "🍗", color: "#EF4444" },
    { id: "van-healthy", name: "Healthy Van", icon: "🥙", color: "#8B5CF6" },
    { id: "van-dessert", name: "Dessert Van", icon: "🍰", color: "#F59E0B" },
  ]

  const filteredItems = useMemo(() => {
    if (loading) return []

    let items = menuItems

    // Filter by van instead of category
    if (selectedCategory !== "all") {
      // Map van filter to actual van IDs or names
      const vanMapping: Record<string, string> = {
        "van-veg": "Veg Van",
        "van-nonveg": "Non-Veg Van", 
        "van-healthy": "Healthy Van",
        "van-dessert": "Dessert Van",
      }
      
      const vanName = vanMapping[selectedCategory]
      if (vanName) {
        items = items.filter((item) => item.truckName === vanName)
      }
    }

    // Filter by search query
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase().trim()
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          (item.truckName && item.truckName.toLowerCase().includes(query)) ||
          (item.tags && item.tags.some((tag: string) => tag.toLowerCase().includes(query))) ||
          (item.description && item.description.toLowerCase().includes(query)),
      )
    }

    return items
  }, [menuItems, selectedCategory, debouncedSearchQuery, loading])

  const addToCart = (item: any, quantityChange: number) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id)
      if (existing) {
        const newQuantity = existing.quantity + quantityChange
        if (newQuantity <= 0) {
          return prev.filter((cartItem) => cartItem.id !== item.id)
        }
        return prev.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem))
      }
      if (quantityChange > 0) {
        return [...prev, { ...item, quantity: quantityChange }]
      }
      return prev
    })
  }

  const updateCartQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const handleCheckout = () => {
    setShowPaymentModal(true)
  }

  const handleSeeAllClick = () => {
    const element = document.getElementById("all-items")
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handlePaymentSuccess = (payment: any) => {
    setPaymentData(payment)
    const orderToken = `A${Math.floor(Math.random() * 900) + 100}`
    const estimatedTime = new Date(Date.now() + 20 * 60 * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })

    const newOrder = {
      id: payment.orderId,
      token: orderToken,
      items: cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: payment.amount,
      status: "placed" as const,
      estimatedTime,
      createdAt: new Date().toISOString(),
      placedAt: new Date().toISOString(),
    }

    setCurrentOrder(newOrder)
    trackOrder(newOrder)
    setShowPaymentSuccess(true)
    setShowPaymentModal(false)
    setCart([])
  }

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error)
  }

  const handleContinueAfterPayment = () => {
    setShowPaymentSuccess(false)
    setActiveTab("orders")
  }

  const handleBackFromPaymentSuccess = () => {
    setShowPaymentSuccess(false)
    setActiveTab("menu")
  }

  const handleGoToCart = () => {
    setActiveTab("cart")
  }

  const handleTrackOrder = () => {
    setActiveTab("orders")
  }

  const handleBackFromOrderTracking = () => {
    setActiveTab("menu")
  }

  const handleViewOrderDetails = (order: any) => {
    setCurrentOrder(order)
    setActiveTab("orders")
  }

  useEffect(() => {
    if (currentOrder && currentOrder.status !== "completed") {
      const statusProgression = ["placed", "confirmed", "preparing", "ready", "completed"]
      const currentIndex = statusProgression.indexOf(currentOrder.status)

      if (currentIndex < statusProgression.length - 1) {
        const timeout = setTimeout(() => {
          const nextStatus = statusProgression[currentIndex + 1]
          const updatedOrder = {
            ...currentOrder,
            status: nextStatus,
            estimatedTime: nextStatus === "preparing" ? "15 mins" : undefined,
          }
          setCurrentOrder(updatedOrder)
          trackOrder(updatedOrder)

          if (nextStatus === "completed") {
            const completedOrder = {
              ...updatedOrder,
              completedAt: new Date().toISOString(),
            }
            setCompletedOrders((prev) => [completedOrder, ...prev])
            setTimeout(() => {
              setCurrentOrder(null)
            }, 5000)
          }
        }, 15000)

        return () => clearTimeout(timeout)
      }
    }
  }, [currentOrder, trackOrder])

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  if (showPaymentSuccess && paymentData) {
    return (
      <PaymentSuccess
        paymentData={paymentData}
        orderToken={currentOrder?.token || "A123"}
        estimatedTime={currentOrder?.estimatedTime || "20 mins"}
        onContinue={handleContinueAfterPayment}
        onBack={handleBackFromPaymentSuccess}
      />
    )
  }

  if (loading) {
    return (
      <div className="space-y-6 pb-32">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading menu items...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 pb-32">
        <Card className="shadow-md border-0" style={{ backgroundColor: "white", borderRadius: "16px" }}>
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-500 text-xl">⚠️</span>
              </div>
              <div>
                <p className="font-semibold mb-1 text-red-600">Error Loading Menu</p>
                <p className="text-gray-600">{error}</p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-32">
      {/* Menu Content */}
      {activeTab === "menu" && (
        <div className="space-y-6">
          {/* Left-aligned Greeting Section with enhanced typography */}
          <div style={{ textAlign: "left" }}>
            <h2
              className="font-bold mb-2"
              style={{
                color: "#2D3748",
                fontSize: "22px",
                fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Inter, sans-serif",
              }}
            >
              What are you feeling, Nabil?
            </h2>
            <style jsx>{`
              @media (min-width: 480px) {
                h2 {
                  font-size: 26px !important;
                }
              }
              @media (min-width: 768px) {
                h2 {
                  font-size: 28px !important;
                }
              }
            `}</style>
          </div>

          {/* Functional Search Bar */}
          <div className="relative">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: "#718096" }}
              />
              <input
                type="text"
                placeholder="Search dishes"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search for dishes by name or category"
                className="w-full pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                style={{
                  height: "48px",
                  fontSize: "16px",
                  backgroundColor: "white",
                  color: "#2D3748",
                }}
              />
            </div>
          </div>

          {/* Van Filter Pills - Horizontal Scrollable */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide max-w-full">
              {vanFilters.map((van) => {
                const isActive = selectedCategory === van.id
                return (
                  <div
                    key={van.id}
                    className="flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 min-w-0 flex-shrink-0"
                    onClick={() => setSelectedCategory(van.id)}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isActive}
                    aria-current={isActive ? "true" : undefined}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setSelectedCategory(van.id)
                      }
                    }}
                    style={{ minHeight: "44px" }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 text-2xl"
                      style={{
                        backgroundColor: isActive ? van.color : "#F7FAFC",
                        border: isActive ? `2px solid ${van.color}` : "2px solid #E2E8F0",
                      }}
                    >
                      <span style={{ filter: isActive ? "brightness(2)" : "none" }}>
                        {van.icon}
                      </span>
                    </div>
                    <span
                      className="text-sm font-medium whitespace-nowrap"
                      style={{
                        color: isActive ? van.color : "#718096",
                      }}
                    >
                      {van.name}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Need to Try Section with random items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold" style={{ color: "#2D3748" }}>
                Need To Try
              </h3>
              <button
                onClick={handleSeeAllClick}
                className="text-sm font-medium transition-all duration-200 hover:underline focus:underline focus:outline-none"
                style={{
                  color: "#FF6B35",
                  minHeight: "44px",
                  minWidth: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="See all menu items"
              >
                See All
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {randomFeaturedItems.map((item) => {
                const cartItem = cart.find((cartItem) => cartItem.id === item.id)
                return (
                  <div key={item.id} className="min-w-0 flex-shrink-0" style={{ width: "280px" }}>
                    <MenuItemCard item={item} onAddToCart={addToCart} cartQuantity={cartItem?.quantity || 0} />
                  </div>
                )
              })}
            </div>

            {randomFeaturedItems.length === 0 && (
              <div className="text-center py-8">
                <p style={{ color: "#718096" }}>No featured items available.</p>
              </div>
            )}
          </div>

          {/* All Menu Items Grid */}
          <div className="space-y-4" id="all-items">
            <h3 className="text-xl font-bold" style={{ color: "#2D3748" }}>
              {selectedCategory === "all"
                ? "All Vans - All Items"
                : vanFilters.find((v) => v.id === selectedCategory)?.name || "Items"}
              {debouncedSearchQuery && (
                <span className="text-base font-normal ml-2" style={{ color: "#718096" }}>
                  for "{debouncedSearchQuery}"
                </span>
              )}
            </h3>

            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => {
                  const cartItem = cart.find((cartItem) => cartItem.id === item.id)
                  return (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onAddToCart={addToCart}
                      cartQuantity={cartItem?.quantity || 0}
                    />
                  )
                })}
              </div>
            ) : (
              <Card
                className="shadow-md border-0"
                style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                }}
              >
                <CardContent className="p-8 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Search className="w-12 h-12" style={{ color: "#E2E8F0" }} />
                    <div>
                      <p className="font-semibold mb-1" style={{ color: "#2D3748" }}>
                        No results found
                      </p>
                      <p style={{ color: "#718096" }}>
                        {debouncedSearchQuery
                          ? `No items match "${debouncedSearchQuery}"`
                          : "No items found in this category"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Cart Content */}
      {activeTab === "cart" && (
        <div className="space-y-4">
          <CartSummary
            items={cart}
            onUpdateQuantity={updateCartQuantity}
            onRemoveItem={removeFromCart}
            onCheckout={handleCheckout}
            ongoingOrders={currentOrder ? [currentOrder] : []}
            completedOrders={completedOrders}
            onViewOrderDetails={handleViewOrderDetails}
          />
        </div>
      )}

      {/* Orders Content */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {currentOrder ? (
            <OrderProgressTracker order={trackedOrder || currentOrder} onBack={handleBackFromOrderTracking} />
          ) : (
            <Card
              className="shadow-md border-0"
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
              }}
            >
              <CardContent className="p-6 text-center">
                <p style={{ color: "#718096" }}>No active orders</p>
              </CardContent>
            </Card>
          )}

          {/* Order History */}
          <Card
            className="shadow-md border-0"
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
            }}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg sm:text-xl font-bold" style={{ color: "#2D3748" }}>
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center p-3 sm:p-4 rounded-xl transition-all duration-200 hover:shadow-sm"
                    style={{
                      border: "1px solid #E2E8F0",
                      backgroundColor: "#FAFAFA",
                    }}
                  >
                    <div>
                      <p className="font-semibold text-sm sm:text-base" style={{ color: "#2D3748" }}>
                        Order #{order.token}
                      </p>
                      <p className="text-xs sm:text-sm" style={{ color: "#718096" }}>
                        {new Date(order.completedAt).toLocaleDateString()}{" "}
                        {new Date(order.completedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      {order.items.map((item, index) => (
                        <p key={index} className="text-xs sm:text-sm" style={{ color: "#718096" }}>
                          {item.quantity}x {item.name}
                        </p>
                      ))}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-base sm:text-lg" style={{ color: "#2D3748" }}>
                        ₹{order.total}
                      </p>
                      <Badge
                        variant="outline"
                        className="text-xs rounded-full"
                        style={{
                          borderColor: "#10B981",
                          color: "#10B981",
                        }}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Profile Content */}
      {activeTab === "profile" && (
        <div className="space-y-4">
          <Card
            className="shadow-md border-0"
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
            }}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-lg sm:text-xl font-bold" style={{ color: "#2D3748" }}>
                <User className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "#FF6B35" }} />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-bold text-base sm:text-lg" style={{ color: "#2D3748" }}>
                  Nabil Thange
                </p>
                <p className="text-sm sm:text-base" style={{ color: "#718096" }}>
                  Student ID: 2021CS001
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "#FF6B35" }} />
                <span className="text-sm sm:text-base" style={{ color: "#2D3748" }}>
                  +91 98765 43210
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "#FF6B35" }} />
                <span className="text-sm sm:text-base" style={{ color: "#2D3748" }}>
                  Hostel Block A, Room 201
                </span>
              </div>
              <Button
                variant="outline"
                className="w-full rounded-xl font-semibold text-sm sm:text-base border-2 transition-all duration-200 bg-transparent"
                style={{
                  height: "48px",
                  borderColor: "#FF6B35",
                  color: "#FF6B35",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#FF6B35"
                  e.currentTarget.style.color = "white"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                  e.currentTarget.style.color = "#FF6B35"
                }}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <StudentNavbar activeTab={activeTab} onTabChange={setActiveTab} cartItemCount={cartItemCount} />

      <FloatingActionBar
        cartItemCount={cartItemCount}
        hasActiveOrder={currentOrder !== null && currentOrder.status !== "completed"}
        currentTab={activeTab}
        onSwitchToCart={() => setActiveTab("cart")}
        onSwitchToOrders={() => setActiveTab("orders")}
        onCartClick={handleGoToCart}
        onTrackOrderClick={handleTrackOrder}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        cartItems={cart}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />
    </div>
  )
}

function StaffApp() {
  const [activeTab, setActiveTab] = useState("orders")
  const [menuItems, setMenuItems] = useState<StaffMenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [orders, setOrders] = useState([
    {
      id: 1234,
      token: "A123",
      customerName: "Nabil Thange",
      items: [
        { name: "Veg Fried Rice", quantity: 2, price: 45 },
        { name: "Tea", quantity: 1, price: 10 },
      ],
      total: 100,
      status: "preparing" as const,
      placedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      estimatedTime: 15,
      paymentStatus: "completed" as const,
    },
    {
      id: 1235,
      token: "A124",
      customerName: "Priya Sharma",
      items: [{ name: "Chicken Biryani", quantity: 1, price: 85 }],
      total: 85,
      status: "placed" as const,
      placedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      paymentStatus: "completed" as const,
    },
    {
      id: 1236,
      token: "A125",
      customerName: "Raj Patel",
      items: [
        { name: "Samosa", quantity: 3, price: 15 },
        { name: "Tea", quantity: 2, price: 10 },
      ],
      total: 65,
      status: "ready" as const,
      placedAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
      paymentStatus: "completed" as const,
    },
  ])

  const { orders: realtimeOrders, connectionStatus, updateOrderStatus: updateRealtimeOrderStatus } = useRealTimeOrders()

  useEffect(() => {
    async function loadMenuData() {
      try {
        setLoading(true)
        setError(null)
        const data = await getAllMenuItemsForStaff()
        setMenuItems(data)
      } catch (err) {
        console.error("Error loading menu data:", err)
        setError("Failed to load menu items")
      } finally {
        setLoading(false)
      }
    }

    if (activeTab === "menu") {
      loadMenuData()
    }
  }, [activeTab])

  const reportData = {
    todayStats: {
      totalOrders: 47,
      totalRevenue: 2340,
      averageOrderValue: 50,
      completedOrders: 42,
      pendingOrders: 5,
      averageWaitTime: 12,
    },
    popularItems: [
      { name: "Veg Fried Rice", orders: 12, revenue: 540, category: "lunch" },
      { name: "Tea", orders: 18, revenue: 180, category: "beverages" },
      { name: "Samosa", orders: 8, revenue: 120, category: "snacks" },
      { name: "Chicken Biryani", orders: 6, revenue: 510, category: "lunch" },
      { name: "Paneer Butter Masala", orders: 5, revenue: 325, category: "lunch" },
    ],
    hourlyData: [
      { hour: "9:00 AM", orders: 8, revenue: 320 },
      { hour: "10:00 AM", orders: 12, revenue: 480 },
      { hour: "11:00 AM", orders: 15, revenue: 750 },
      { hour: "12:00 PM", orders: 18, revenue: 900 },
      { hour: "1:00 PM", orders: 22, revenue: 1100 },
      { hour: "2:00 PM", orders: 16, revenue: 640 },
    ],
    weeklyComparison: {
      ordersChange: 12,
      revenueChange: 8,
    },
  }

  const updateOrderStatus = (orderId: number, newStatus: string) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus as any } : order)))
    updateRealtimeOrderStatus(orderId.toString(), newStatus as any)
  }

  const handleUpdateMenuItem = async (id: string, updates: Partial<StaffMenuItem>) => {
    try {
      await updateMenuItem(id, {
        name: updates.name,
        description: updates.description,
        price: updates.price,
        is_veg: updates.isVeg,
        prep_time: updates.prepTime,
        is_available: updates.available,
      })

      // Refresh the menu items
      const updatedItems = await getAllMenuItemsForStaff()
      setMenuItems(updatedItems)
    } catch (error) {
      console.error("Error updating menu item:", error)
      throw error
    }
  }

  const handleDeleteMenuItem = async (id: string) => {
    try {
      await deleteMenuItem(id)

      // Refresh the menu items
      const updatedItems = await getAllMenuItemsForStaff()
      setMenuItems(updatedItems)
    } catch (error) {
      console.error("Error deleting menu item:", error)
      throw error
    }
  }

  const handleAddMenuItem = async (newItem: Omit<StaffMenuItem, "id">) => {
    try {
      await addMenuItem({
        name: newItem.name,
        description: newItem.description,
        price: newItem.price,
        image_url: newItem.image_url,
        category: newItem.category,
        is_veg: newItem.is_veg,
        prep_time: newItem.prep_time,
        calories: newItem.calories,
        is_spicy: newItem.is_spicy,
        is_bestseller: newItem.is_bestseller,
        is_popular: newItem.is_popular,
        nutritional_info: newItem.nutritional_info,
        tags: newItem.tags,
        ingredients: newItem.ingredients,
        is_available: newItem.available,
      })

      // Refresh the menu items
      const updatedItems = await getAllMenuItemsForStaff()
      setMenuItems(updatedItems)
    } catch (error) {
      console.error("Error adding menu item:", error)
      throw error
    }
  }

  const handleToggleAvailability = async (id: string, available: boolean) => {
    try {
      await toggleMenuItemAvailability(id, available)

      // Refresh the menu items
      const updatedItems = await getAllMenuItemsForStaff()
      setMenuItems(updatedItems)
    } catch (error) {
      console.error("Error toggling availability:", error)
      throw error
    }
  }

  return (
    <div className="space-y-4 pb-32">
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "#2D3748" }}>
          Staff Dashboard
        </h2>
        <ConnectionStatus status={connectionStatus} />
      </div>

      {/* Orders Content */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <LiveOrderUpdates updates={[]} />
          <OrderManagement orders={orders} onUpdateOrderStatus={updateOrderStatus} />
        </div>
      )}

      {/* Menu Content */}
      {activeTab === "menu" && (
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading menu items...</p>
              </div>
            </div>
          ) : error ? (
            <Card className="shadow-md border-0" style={{ backgroundColor: "white", borderRadius: "16px" }}>
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-500 text-xl">⚠️</span>
                  </div>
                  <div>
                    <p className="font-semibold mb-1 text-red-600">Error Loading Menu</p>
                    <p className="text-gray-600">{error}</p>
                  </div>
                  <Button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Retry
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <MenuManagement
              menuItems={menuItems}
              onUpdateItem={handleUpdateMenuItem}
              onDeleteItem={handleDeleteMenuItem}
              onAddItem={handleAddMenuItem}
              onToggleAvailability={handleToggleAvailability}
            />
          )}
        </div>
      )}

      {/* Reports Content */}
      {activeTab === "reports" && (
        <div className="space-y-4">
          <ReportsDashboard data={reportData} />
        </div>
      )}

      <StaffNavbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        orderCount={orders.filter((order) => order.status === "placed" || order.status === "preparing").length}
      />
    </div>
  )
}

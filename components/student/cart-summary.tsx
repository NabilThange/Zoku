"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Trash2, CheckCircle } from "lucide-react"

interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  isVeg: boolean
}

interface CartSummaryProps {
  items: CartItem[]
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemoveItem: (id: number) => void
  onCheckout: () => void
  ongoingOrders?: any[]
  completedOrders?: any[] // Added completedOrders prop
  onViewOrderDetails?: (order: any) => void
}

export function CartSummary({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  ongoingOrders = [],
  completedOrders = [], // Added completedOrders with default empty array
  onViewOrderDetails,
}: CartSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const platformFee = Math.round(subtotal * 0.02) // 2% platform fee
  const total = subtotal + platformFee

  const getStatusColor = (status: string) => {
    switch (status) {
      case "placed":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "confirmed":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "preparing":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "ready":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 lg:px-6">
      <div className="space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Ongoing Orders Section */}
        {ongoingOrders && ongoingOrders.length > 0 && (
          <Card className="border border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl font-semibold text-slate-900">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                Ongoing Orders ({ongoingOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="space-y-3">
                {ongoingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 sm:p-5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all duration-200 cursor-pointer hover:shadow-sm active:scale-[0.98]"
                    onClick={() => onViewOrderDetails?.(order)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-semibold text-sm sm:text-base text-slate-900">Order #{order.id}</span>
                        <span className="text-xs text-slate-500 truncate">Token: {order.token}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-3">
                      {order.items.slice(0, 2).map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center text-xs sm:text-sm text-slate-600">
                          <span className="truncate pr-2">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-medium flex-shrink-0">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-xs text-slate-500">+{order.items.length - 2} more items</div>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm sm:text-base text-slate-900">₹{order.total}</span>
                      {order.estimatedTime && (
                        <span className="text-xs text-slate-500">ETA: {order.estimatedTime}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Cart Items */}
        {items.length === 0 ? (
          <Card className="border border-slate-200 shadow-sm bg-white">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 text-slate-400 bg-slate-50 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h3 className="font-semibold mb-2 text-lg sm:text-xl text-slate-900">Your cart is empty</h3>
              <p className="text-slate-500 text-sm sm:text-base max-w-sm mx-auto">Add some delicious items to get started!</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="border border-slate-200 shadow-sm bg-white">
              <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl font-semibold text-slate-900">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                  Cart ({items.length} items)
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="space-y-4 sm:space-y-5">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-slate-100 bg-slate-50/30 hover:bg-slate-50/50 transition-colors duration-200">
                      <div className="relative flex-shrink-0">
                        <img
                          src={item.image || "/placeholder.svg?height=56&width=56"}
                          alt={item.name}
                          className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-cover rounded-lg border border-slate-200"
                          style={{ aspectRatio: '1/1' }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-sm sm:text-base text-slate-900 truncate">{item.name}</h3>
                          {item.isVeg && (
                            <div className="w-4 h-4 border-2 border-green-600 flex items-center justify-center flex-shrink-0 rounded-sm">
                              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            </div>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500">₹{item.price} each</p>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-9 h-9 sm:w-10 sm:h-10 p-0 rounded-full border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200"
                          style={{ minWidth: "36px", minHeight: "36px" }}
                        >
                          <span className="text-slate-600 font-medium">-</span>
                        </Button>
                        <span className="w-8 sm:w-10 text-center text-sm sm:text-base font-semibold text-slate-900">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-9 h-9 sm:w-10 sm:h-10 p-0 rounded-full border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200"
                          style={{ minWidth: "36px", minHeight: "36px" }}
                        >
                          <span className="text-slate-600 font-medium">+</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onRemoveItem(item.id)}
                          className="w-9 h-9 sm:w-10 sm:h-10 p-0 ml-1 sm:ml-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                          style={{ minWidth: "36px", minHeight: "36px" }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-right flex-shrink-0 min-w-0">
                        <p className="font-bold text-sm sm:text-base text-slate-900">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm bg-white">
              <CardContent className="p-5 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center text-sm sm:text-base text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm sm:text-base text-slate-600">
                    <span>Platform Fee</span>
                    <span className="font-medium">₹{platformFee}</span>
                  </div>
                  <Separator className="bg-slate-200" />
                  <div className="flex justify-between items-center font-bold text-base sm:text-lg">
                    <span className="text-slate-900">Total</span>
                    <span className="text-red-600">₹{total}</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-5 sm:mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-md active:scale-[0.98] border-0" 
                  size="lg" 
                  onClick={onCheckout} 
                  style={{ minHeight: "48px" }}
                >
                  <span className="text-base sm:text-lg">Proceed to Payment</span>
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* Completed Orders Section */}
        {completedOrders && completedOrders.length > 0 && (
          <Card className="border border-emerald-200 shadow-sm bg-white">
            <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl font-semibold text-slate-900">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                Recent Orders ({completedOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="space-y-3">
                {completedOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 sm:p-5 rounded-xl border border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50/50 transition-all duration-200 cursor-pointer opacity-80 hover:opacity-100 hover:shadow-sm active:scale-[0.98]"
                    onClick={() => onViewOrderDetails?.(order)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-semibold text-sm sm:text-base text-slate-900">Order #{order.id}</span>
                        <span className="text-xs text-slate-500 truncate">Token: {order.token}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${getStatusColor(order.status)}`}>
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-3">
                      {order.items.slice(0, 2).map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center text-xs sm:text-sm text-slate-600">
                          <span className="truncate pr-2">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-medium flex-shrink-0">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-xs text-slate-500">+{order.items.length - 2} more items</div>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm sm:text-base text-slate-900">₹{order.total}</span>
                      {order.completedAt && (
                        <span className="text-xs text-slate-500">
                          Completed: {new Date(order.completedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

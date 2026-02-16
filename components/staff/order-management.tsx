"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, ChefHat, Package, CheckCircle, AlertCircle } from "lucide-react"

interface Order {
  id: number
  token: string
  customerName: string
  items: Array<{
    name: string
    quantity: number
    price: number
    specialInstructions?: string
  }>
  total: number
  status: "placed" | "confirmed" | "preparing" | "ready" | "completed"
  placedAt: string
  estimatedTime?: number
  paymentStatus: "completed" | "pending"
}

interface OrderManagementProps {
  orders: Order[]
  onUpdateOrderStatus: (orderId: number, status: string) => void
}

export function OrderManagement({ orders, onUpdateOrderStatus }: OrderManagementProps) {
  const [statusFilter, setStatusFilter] = useState("all")

  const statusOptions = [
    { value: "all", label: "All Orders", count: orders.length },
    { value: "placed", label: "New", count: orders.filter((o) => o.status === "placed").length },
    { value: "preparing", label: "Preparing", count: orders.filter((o) => o.status === "preparing").length },
    { value: "ready", label: "Ready", count: orders.filter((o) => o.status === "ready").length },
  ]

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesStatus && order.status !== "completed"
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "placed":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case "preparing":
        return <ChefHat className="w-5 h-5 text-blue-600" />
      case "ready":
        return <Package className="w-5 h-5 text-emerald-600" />
      case "completed":
        return <CheckCircle className="w-5 h-5 text-slate-500" />
      default:
        return <Clock className="w-5 h-5 text-slate-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "placed":
        return "bg-red-100 text-red-700 border-red-200"
      case "preparing":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "ready":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "completed":
        return "bg-slate-100 text-slate-700 border-slate-200"
      default:
        return "bg-slate-100 text-slate-600 border-slate-200"
    }
  }

  const getNextAction = (status: string) => {
    switch (status) {
      case "placed":
        return { action: "preparing", label: "Start Preparing", variant: "default" as const }
      case "preparing":
        return { action: "ready", label: "Mark Ready", variant: "secondary" as const }
      case "ready":
        return { action: "completed", label: "Complete Order", variant: "outline" as const }
      default:
        return null
    }
  }

  const getUrgencyIndicator = (timeElapsed: number) => {
    if (timeElapsed > 30) return "border-l-4 border-l-red-500"
    if (timeElapsed > 15) return "border-l-4 border-l-yellow-500"
    return "border-l-4 border-l-emerald-500"
  }

  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case "placed":
        return "border-red-500"
      case "preparing":
        return "border-blue-500"
      case "ready":
        return "border-green-500"
      default:
        return "border-slate-200"
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">Order Management</h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Track and manage incoming orders in real-time
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {statusOptions.map((option) => (
            <Badge
              key={option.value}
              variant="outline"
              className={`whitespace-nowrap cursor-pointer flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                statusFilter === option.value
                  ? "bg-blue-700 text-white border-blue-700 hover:bg-blue-800"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400"
              }`}
              onClick={() => setStatusFilter(option.value)}
            >
              {option.label}
              {option.count > 0 && (
                <span
                  className={`rounded-full w-5 h-5 sm:w-6 sm:h-6 text-xs flex items-center justify-center font-semibold ${
                    statusFilter === option.value ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {option.count}
                </span>
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredOrders.length === 0 ? (
          <Card className="border-slate-200">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Package className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 sm:mb-3">No Active Orders</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md mx-auto">
                All caught up! New orders will appear here when they come in.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => {
            const nextAction = getNextAction(order.status)
            const timeElapsed = Math.floor((Date.now() - new Date(order.placedAt).getTime()) / (1000 * 60))

            return (
              <Card
                key={order.id}
                className={`overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-2 ${getStatusBorderColor(order.status)}`}
              >
                <CardHeader className="p-4 sm:pb-4 sm:px-6 sm:pt-6 bg-slate-50/50">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2 sm:gap-3">
                        Token: {order.token}
                        {getStatusIcon(order.status)}
                      </CardTitle>
                      <div className="space-y-1">
                        <p className="text-sm sm:text-base font-medium text-slate-700">
                          Order #{order.id} • {order.customerName}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-500">
                          {timeElapsed} minutes ago
                          {timeElapsed > 20 && <span className="ml-2 text-red-600 font-medium">• Urgent</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col sm:text-right items-center sm:items-end gap-3 sm:gap-3">
                      <Badge
                        variant="outline"
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium border ${getStatusColor(order.status)} flex-shrink-0`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      {order.estimatedTime && order.status === "preparing" && (
                        <p className="text-xs sm:text-sm text-blue-600 font-medium flex-shrink-0">
                          ETA: {order.estimatedTime} mins
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Order Items */}
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2">
                      Order Items
                    </h4>
                    <div className="space-y-2 sm:space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-start gap-3 sm:gap-4 py-1 sm:py-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm sm:text-base font-medium text-slate-900 truncate sm:whitespace-normal">
                              {item.quantity}× {item.name}
                            </p>
                            {item.specialInstructions && (
                              <p className="text-xs sm:text-sm text-slate-600 italic mt-1 pl-3 sm:pl-4 border-l-2 border-blue-200 leading-relaxed">
                                Note: {item.specialInstructions}
                              </p>
                            )}
                          </div>
                          <p className="text-sm sm:text-base font-semibold text-slate-900 flex-shrink-0">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-3 sm:pt-4 border-t-2 border-slate-200">
                      <span className="text-base sm:text-lg font-bold text-slate-900">Total Amount</span>
                      <span className="text-xl sm:text-2xl font-bold text-blue-700">₹{order.total}</span>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <span className="text-xs sm:text-sm font-medium text-slate-700">Payment Status</span>
                    <Badge
                      variant="outline"
                      className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium self-start sm:self-auto ${
                        order.paymentStatus === "completed"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }`}
                    >
                      {order.paymentStatus === "completed" ? "Payment Completed" : "Payment Pending"}
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  {nextAction && (
                    <div className="flex flex-col gap-3 pt-3 sm:pt-4 border-t border-slate-200">
                      <Button
                        variant={nextAction.variant}
                        size="lg"
                        onClick={() => onUpdateOrderStatus(order.id, nextAction.action)}
                        className="w-full h-11 sm:h-12 font-medium text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        {nextAction.label}
                      </Button>
                      {order.status === "ready" && (
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => {
                            /* Open QR scanner */
                          }}
                          className="w-full h-11 sm:h-12 font-medium text-sm sm:text-base border-slate-300 text-slate-700 hover:bg-slate-50 transition-all duration-200"
                        >
                          Scan QR
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

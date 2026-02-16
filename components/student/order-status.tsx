"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, ChefHat, Package, ArrowLeft } from "lucide-react"

interface Order {
  id: string
  token: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  status: "placed" | "confirmed" | "preparing" | "ready" | "completed"
  estimatedTime?: string
  createdAt: string
}

interface OrderStatusProps {
  order: Order
  onCancelOrder?: () => void
  onBack?: () => void // Added optional back button handler
}

export function OrderStatus({ order, onCancelOrder, onBack }: OrderStatusProps) {
  const statusSteps = [
    { key: "placed", label: "Order Placed", icon: CheckCircle },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle },
    { key: "preparing", label: "Preparing", icon: ChefHat },
    { key: "ready", label: "Ready for Pickup", icon: Package },
  ]

  const currentStepIndex = statusSteps.findIndex((step) => step.key === order.status)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "placed":
        return "secondary"
      case "confirmed":
        return "secondary"
      case "preparing":
        return "default"
      case "ready":
        return "default"
      case "completed":
        return "default"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        {onBack && (
          <div className="flex items-center gap-3 mb-2">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="text-sm text-muted-foreground">Back to Payment Success</span>
          </div>
        )}

        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Order #{order.id}</CardTitle>
            <p className="text-sm text-muted-foreground">Placed at {new Date(order.createdAt).toLocaleTimeString()}</p>
          </div>
          <Badge variant={getStatusColor(order.status)}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Items */}
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>
                {item.quantity}x {item.name}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total</span>
            <span className="text-primary">₹{order.total}</span>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Order Status</h4>
          <div className="space-y-2">
            {statusSteps.map((step, index) => {
              const Icon = step.icon
              const isCompleted = index <= currentStepIndex
              const isCurrent = index === currentStepIndex

              return (
                <div key={step.key} className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? isCurrent
                          ? "bg-primary text-primary-foreground"
                          : "bg-success text-success-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className={`text-sm ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.label}
                  </span>
                  {isCurrent && order.estimatedTime && (
                    <Badge variant="outline" className="ml-auto">
                      ETA: {order.estimatedTime}
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Pickup Token */}
        {(order.status === "ready" || order.status === "preparing") && (
          <Card className="bg-accent/10 border-accent/20">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">Pickup Token</p>
              <p className="text-4xl font-bold text-primary mb-2">{order.token}</p>
              <p className="text-xs text-muted-foreground">Show this token to the canteen staff</p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {order.status === "placed" && onCancelOrder && (
            <Button variant="outline" size="sm" onClick={onCancelOrder}>
              Cancel Order
            </Button>
          )}
          {order.status === "ready" && <Button className="flex-1">I'm at the Counter</Button>}
        </div>
      </CardContent>
    </Card>
  )
}

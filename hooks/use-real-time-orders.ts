"use client"

import { useState, useEffect, useCallback } from "react"

interface Order {
  id: string
  token: string
  customerName?: string
  items: Array<{
    name: string
    quantity: number
    price: number
    specialInstructions?: string
  }>
  total: number
  status: "placed" | "confirmed" | "preparing" | "ready" | "completed"
  placedAt: string
  estimatedTime?: string
  paymentStatus: "completed" | "pending"
}

interface OrderUpdate {
  orderId: string
  status: string
  estimatedTime?: string
  timestamp: string
}

// Simulated WebSocket connection for real-time updates
class MockWebSocket {
  private listeners: { [key: string]: Function[] } = {}
  private interval: NodeJS.Timeout | null = null

  constructor() {
    // Simulate periodic order updates
    this.interval = setInterval(() => {
      this.simulateOrderUpdate()
    }, 10000) // Update every 10 seconds
  }

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  off(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback)
    }
  }

  emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data))
    }
  }

  private simulateOrderUpdate() {
    // Simulate random order status updates
    const statuses = ["confirmed", "preparing", "ready"]
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
    const randomOrderId = `ORD${Math.floor(Math.random() * 1000) + 1000}`

    this.emit("orderUpdate", {
      orderId: randomOrderId,
      status: randomStatus,
      estimatedTime: randomStatus === "preparing" ? "15 mins" : undefined,
      timestamp: new Date().toISOString(),
    })
  }

  disconnect() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }
}

let mockSocket: MockWebSocket | null = null

export function useRealTimeOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting")

  const handleOrderUpdate = useCallback((update: OrderUpdate) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === update.orderId
          ? {
              ...order,
              status: update.status as Order["status"],
              estimatedTime: update.estimatedTime,
            }
          : order,
      ),
    )
  }, [])

  const addOrder = useCallback((newOrder: Order) => {
    setOrders((prevOrders) => [newOrder, ...prevOrders])
  }, [])

  const updateOrderStatus = useCallback((orderId: string, status: Order["status"], estimatedTime?: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? { ...order, status, estimatedTime } : order)),
    )

    // Simulate sending update to server
    if (mockSocket) {
      mockSocket.emit("statusUpdate", {
        orderId,
        status,
        estimatedTime,
        timestamp: new Date().toISOString(),
      })
    }
  }, [])

  useEffect(() => {
    // Initialize mock WebSocket connection
    mockSocket = new MockWebSocket()

    mockSocket.on("orderUpdate", handleOrderUpdate)

    // Simulate connection established
    setTimeout(() => {
      setConnectionStatus("connected")
    }, 1000)

    return () => {
      if (mockSocket) {
        mockSocket.off("orderUpdate", handleOrderUpdate)
        mockSocket.disconnect()
        mockSocket = null
      }
    }
  }, [handleOrderUpdate])

  return {
    orders,
    connectionStatus,
    addOrder,
    updateOrderStatus,
  }
}

export function useOrderTracking(orderId: string) {
  const [order, setOrder] = useState<Order | null>(null)
  const [updates, setUpdates] = useState<OrderUpdate[]>([])

  const handleOrderUpdate = useCallback(
    (update: OrderUpdate) => {
      if (update.orderId === orderId) {
        setUpdates((prev) => [update, ...prev])
        setOrder((prevOrder) =>
          prevOrder
            ? {
                ...prevOrder,
                status: update.status as Order["status"],
                estimatedTime: update.estimatedTime,
              }
            : null,
        )
      }
    },
    [orderId],
  )

  useEffect(() => {
    if (!mockSocket) {
      mockSocket = new MockWebSocket()
    }

    mockSocket.on("orderUpdate", handleOrderUpdate)

    return () => {
      if (mockSocket) {
        mockSocket.off("orderUpdate", handleOrderUpdate)
      }
    }
  }, [handleOrderUpdate])

  const trackOrder = useCallback((orderData: Order) => {
    setOrder(orderData)
    setUpdates([])
  }, [])

  return {
    order,
    updates,
    trackOrder,
  }
}

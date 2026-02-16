"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Clock, CheckCircle } from "lucide-react"

interface OrderUpdate {
  orderId: string
  status: string
  estimatedTime?: string
  timestamp: string
  customerName?: string
}

interface LiveOrderUpdatesProps {
  updates: OrderUpdate[]
  maxUpdates?: number
}

export function LiveOrderUpdates({ updates, maxUpdates = 5 }: LiveOrderUpdatesProps) {
  const [visibleUpdates, setVisibleUpdates] = useState<OrderUpdate[]>([])
  const [newUpdateCount, setNewUpdateCount] = useState(0)

  useEffect(() => {
    if (updates.length > 0) {
      const latestUpdates = updates.slice(0, maxUpdates)
      setVisibleUpdates(latestUpdates)

      // Show notification for new updates
      if (updates.length > visibleUpdates.length) {
        setNewUpdateCount(updates.length - visibleUpdates.length)
        setTimeout(() => setNewUpdateCount(0), 3000)
      }
    }
  }, [updates, maxUpdates, visibleUpdates.length])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
      case "preparing":
        return <Clock className="w-4 h-4" />
      case "ready":
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "secondary"
      case "preparing":
        return "default"
      case "ready":
        return "default"
      case "completed":
        return "outline"
      default:
        return "outline"
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (visibleUpdates.length === 0) {
    return null
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Live Updates
          </h4>
          {newUpdateCount > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {newUpdateCount} new
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          {visibleUpdates.map((update, index) => (
            <div
              key={`${update.orderId}-${update.timestamp}`}
              className={`flex items-center justify-between p-2 rounded-lg border ${
                index === 0 ? "bg-accent/10 border-accent/20" : "bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-2">
                {getStatusIcon(update.status)}
                <div>
                  <p className="text-sm font-medium">Order #{update.orderId.slice(-4)}</p>
                  <p className="text-xs text-muted-foreground">
                    {update.customerName && `${update.customerName} • `}
                    {formatTime(update.timestamp)}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <Badge variant={getStatusColor(update.status)} className="text-xs">
                  {update.status}
                </Badge>
                {update.estimatedTime && (
                  <p className="text-xs text-muted-foreground mt-1">ETA: {update.estimatedTime}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

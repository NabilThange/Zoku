"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button" // Added Button import
import { CheckCircle, Clock, ChefHat, Package, ArrowLeft } from "lucide-react" // Added ArrowLeft import

interface Order {
  id: string
  token: string
  status: "placed" | "confirmed" | "preparing" | "ready" | "completed"
  estimatedTime?: string
  placedAt: string
}

interface OrderProgressTrackerProps {
  order: Order
  showAnimation?: boolean
  onBack?: () => void // Added optional back button handler
}

export function OrderProgressTracker({ order, showAnimation = true, onBack }: OrderProgressTrackerProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      key: "placed",
      label: "Order Placed",
      icon: CheckCircle,
      description: "Your order has been received",
    },
    {
      key: "confirmed",
      label: "Confirmed",
      icon: CheckCircle,
      description: "Payment verified and order confirmed",
    },
    {
      key: "preparing",
      label: "Preparing",
      icon: ChefHat,
      description: "Your food is being prepared",
    },
    {
      key: "ready",
      label: "Ready for Pickup",
      icon: Package,
      description: "Your order is ready at the counter",
    },
  ]

  useEffect(() => {
    const stepIndex = steps.findIndex((step) => step.key === order.status)
    setCurrentStep(stepIndex)

    // Calculate progress percentage
    const progressPercentage = stepIndex >= 0 ? ((stepIndex + 1) / steps.length) * 100 : 0

    if (showAnimation) {
      // Animate progress bar
      let currentProgress = progress
      const targetProgress = progressPercentage
      const increment = (targetProgress - currentProgress) / 20

      const animateProgress = () => {
        currentProgress += increment
        if (currentProgress < targetProgress) {
          setProgress(currentProgress)
          requestAnimationFrame(animateProgress)
        } else {
          setProgress(targetProgress)
        }
      }

      requestAnimationFrame(animateProgress)
    } else {
      setProgress(progressPercentage)
    }
  }, [order.status, showAnimation, progress])

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return "completed"
    if (stepIndex === currentStep) return "current"
    return "pending"
  }

  const getElapsedTime = () => {
    const placedTime = new Date(order.placedAt)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - placedTime.getTime()) / (1000 * 60))
    return diffMinutes
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
            <CardTitle className="text-lg">Order Progress</CardTitle>
            <p className="text-sm text-muted-foreground">
              Token: {order.token} • {getElapsedTime()} mins ago
            </p>
          </div>
          <Badge variant={order.status === "ready" ? "default" : "secondary"} className="capitalize">
            {order.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Estimated Time */}
        {order.estimatedTime && order.status === "preparing" && (
          <div className="flex items-center gap-2 p-3 bg-accent/10 rounded-lg">
            <Clock className="w-4 h-4 text-primary" />
            <div>
              <p className="font-medium text-sm">Estimated Ready Time</p>
              <p className="text-sm text-muted-foreground">{order.estimatedTime}</p>
            </div>
          </div>
        )}

        {/* Step Timeline */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            const status = getStepStatus(index)

            return (
              <div key={step.key} className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    status === "completed"
                      ? "bg-success border-success text-success-foreground"
                      : status === "current"
                        ? "bg-primary border-primary text-primary-foreground animate-pulse"
                        : "bg-muted border-muted-foreground/20 text-muted-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium text-sm ${
                      status === "completed" || status === "current" ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>

                  {status === "current" && order.estimatedTime && step.key === "preparing" && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      ETA: {order.estimatedTime}
                    </Badge>
                  )}
                </div>

                {status === "completed" && <div className="text-xs text-muted-foreground">✓</div>}
              </div>
            )
          })}
        </div>

        {/* Ready for Pickup Alert */}
        {order.status === "ready" && (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-primary">Ready for Pickup!</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Your order is ready at the counter. Please show your token to collect your food.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

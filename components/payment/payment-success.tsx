"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  Download,
  Share,
  Clock,
  Copy,
  MapPin,
  Phone,
  Star,
  ArrowRight,
  ArrowLeft,
  Receipt,
  CreditCard,
  Smartphone,
  Wallet,
  QrCode,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PaymentSuccessProps {
  paymentData: {
    orderId: string
    transactionId: string
    amount: number
    method: string
    status: string
    timestamp: string
  }
  orderToken: string
  estimatedTime: string
  onContinue: () => void
  onBack?: () => void
  customerName?: string
  truckName?: string // NEW: Truck name instead of canteen
  truckLocation?: string // NEW: Parking spot
  supportPhone?: string
}

export function PaymentSuccess({
  paymentData,
  orderToken,
  estimatedTime,
  onContinue,
  onBack,
  customerName = "Customer",
  truckName = "Food Truck A",
  truckLocation = "Gate 2 Parking",
  supportPhone = "+91-12345-67890",
}: PaymentSuccessProps) {
  const [copied, setCopied] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes in seconds

  // Success animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(true), 200)
    return () => clearTimeout(timer)
  }, [])

  // Countdown timer for pickup
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "upi":
        return Smartphone
      case "card":
        return CreditCard
      case "wallet":
        return Wallet
      case "qr":
        return QrCode
      default:
        return CreditCard
    }
  }

  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(orderToken)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy token:", err)
    }
  }

  const handleDownloadReceipt = () => {
    // Simulate receipt generation
    console.log("Generating receipt for order:", paymentData.orderId)

    // In a real app, this would generate and download a PDF receipt
    const receiptData = {
      orderId: paymentData.orderId,
      transactionId: paymentData.transactionId,
      amount: paymentData.amount,
      timestamp: paymentData.timestamp,
      customerName,
      paymentMethod: paymentData.method,
    }

    // Simulate download
    alert("Receipt download started!")
  }

  const handleShareOrder = async () => {
    const shareData = {
      title: "Order Confirmed - Zoku",
      text: `Hi! My order #${paymentData.orderId} for ₹${paymentData.amount} is confirmed!\n\nPickup Token: ${orderToken}\nTruck: ${truckName}\nLocation: ${truckLocation}\nEstimated Time: ${estimatedTime}`,
      url: window.location.origin,
    }

    try {
      if (navigator.share && /mobile|android|ios/i.test(navigator.userAgent)) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.text)
        alert("Order details copied to clipboard!")
      }
    } catch (err) {
      console.error("Error sharing:", err)
    }
  }

  const handleCallSupport = () => {
    window.open(`tel:${supportPhone}`, "_self")
  }

  return (
    <div className="max-w-md mx-auto space-y-6 p-4">
      {onBack && (
        <div className="flex items-center gap-3 mb-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="text-sm text-muted-foreground">Back to App</span>
        </div>
      )}

      {/* Success Header with Animation */}
      <div className="text-center space-y-4">
        <div className="relative">
          <div
            className={cn(
              "w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center transition-all duration-700 transform",
              showAnimation ? "scale-100 rotate-0" : "scale-0 rotate-180",
            )}
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          {/* Celebration rings */}
          <div
            className={cn(
              "absolute inset-0 w-20 h-20 mx-auto rounded-full border-4 border-green-200 transition-all duration-1000 delay-300",
              showAnimation ? "scale-150 opacity-0" : "scale-100 opacity-100",
            )}
          />
          <div
            className={cn(
              "absolute inset-0 w-20 h-20 mx-auto rounded-full border-2 border-green-300 transition-all duration-1000 delay-500",
              showAnimation ? "scale-200 opacity-0" : "scale-100 opacity-100",
            )}
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Successful! 🎉</h2>
          <p className="text-muted-foreground">Hi {customerName}! Your order is confirmed and being prepared.</p>
        </div>
      </div>

      {/* Pickup Token Card - Most Important Information */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-orange-50 dark:to-orange-950/20">
        <CardContent className="p-6 text-center space-y-4">
          <div className="space-y-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-sm px-3 py-1">Pickup Token</Badge>
            <div
              className="text-5xl font-black text-primary cursor-pointer hover:scale-105 transition-transform select-all"
              onClick={handleCopyToken}
            >
              {orderToken}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyToken}
              className="h-auto p-2 text-xs text-muted-foreground hover:text-primary"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" /> Tap to Copy
                </>
              )}
            </Button>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-lg font-semibold">
              <Clock className="w-5 h-5 text-primary" />
              <span>Ready in {estimatedTime}</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span className="text-lg">🚚</span>
              <div className="text-left">
                <p className="font-semibold text-gray-900">{truckName}</p>
                <p className="text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {truckLocation}
                </p>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Pickup Window</p>
              <div className="text-2xl font-mono font-bold text-orange-600">{formatTime(timeLeft)}</div>
              <p className="text-xs text-muted-foreground">remaining</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order & Payment Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Receipt className="w-5 h-5" />
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Payment Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Order ID</p>
                <p className="font-mono font-semibold text-sm">{paymentData.orderId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Amount</p>
                <p className="font-bold text-lg text-primary">₹{paymentData.amount}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Transaction</p>
                <p className="font-mono font-semibold text-sm">{paymentData.transactionId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Payment Method</p>
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = getPaymentMethodIcon(paymentData.method)
                    return <Icon className="w-4 h-4" />
                  })()}
                  <p className="font-semibold text-sm capitalize">{paymentData.method}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Status and Timestamp */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                {paymentData.status}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{new Date(paymentData.timestamp).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="space-y-3">
        <Button
          onClick={onContinue}
          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-600 shadow-lg"
          size="lg"
        >
          Track Your Order
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={handleDownloadReceipt}
            className="flex items-center gap-2 h-11 hover:bg-primary/5 hover:border-primary/30 bg-transparent"
          >
            <Download className="w-4 h-4" />
            <span>Receipt</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleShareOrder}
            className="flex items-center gap-2 h-11 hover:bg-primary/5 hover:border-primary/30 bg-transparent"
          >
            <Share className="w-4 h-4" />
            <span>Share</span>
          </Button>
        </div>
      </div>

      {/* Support & Information */}
      <Card className="bg-muted/30">
        <CardContent className="p-4 space-y-4">
          <div className="text-center">
            <h4 className="font-semibold text-sm mb-2">Need Help?</h4>
            <Button variant="ghost" size="sm" onClick={handleCallSupport} className="text-primary hover:bg-primary/10">
              <Phone className="w-4 h-4 mr-2" />
              Call Support: {supportPhone}
            </Button>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
              <Star className="w-4 h-4" />
              Quick Tips
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-500" />
                <span>Arrive within 30 minutes of ready time</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-500" />
                <span>Show your pickup token at the truck counter</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-500" />
                <span>No need to pay again - already processed</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-500" />
                <span>Rate your experience after pickup</span>
              </li>
            </ul>
          </div>

          <div className="text-center pt-2 border-t">
            <p className="text-xs text-muted-foreground">Refunds processed in 3-5 business days if applicable</p>
          </div>
        </CardContent>
      </Card>

      {/* Rate Experience CTA */}
      <Card className="border-dashed border-2 border-primary/20 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
        <CardContent className="p-4 text-center">
          <div className="flex justify-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <h4 className="font-semibold text-sm mb-1">Enjoying our service?</h4>
          <p className="text-xs text-muted-foreground mb-3">Help us improve by rating your experience</p>
          <Button variant="outline" size="sm" className="text-xs bg-transparent">
            Rate Later
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

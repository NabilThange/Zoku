"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  CreditCard,
  Smartphone,
  Wallet,
  QrCode,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image?: string
}

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  onPaymentSuccess: (paymentData: any) => void
  onPaymentError: (error: string) => void
}

type PaymentMethod = "upi" | "card" | "wallet" | "qr"
type PaymentStatus = "idle" | "processing" | "success" | "error"
type PaymentStep = "summary" | "method" | "form" | "processing"

export function PaymentModal({ isOpen, onClose, cartItems, onPaymentSuccess, onPaymentError }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("upi")
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle")
  const [currentStep, setCurrentStep] = useState<PaymentStep>("summary")
  const [showCardCVV, setShowCardCVV] = useState(false)
  const [upiId, setUpiId] = useState("")
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const platformFee = Math.round(subtotal * 0.02) // 2% platform fee
  const gst = Math.round(subtotal * 0.05) // 5% GST
  const total = subtotal + platformFee + gst

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep("summary")
      setPaymentStatus("idle")
      setFormErrors({})
      setUpiId("")
      setCardDetails({ number: "", expiry: "", cvv: "", name: "" })
    }
  }, [isOpen])

  const paymentMethods = [
    {
      id: "upi" as const,
      name: "UPI",
      icon: Smartphone,
      description: "Pay instantly with UPI ID",
      popular: true,
      processingTime: "Instant",
      bgColor: "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      id: "card" as const,
      name: "Card",
      icon: CreditCard,
      description: "Credit • Debit • International",
      processingTime: "2-3 mins",
      bgColor: "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
      borderColor: "border-green-200 dark:border-green-800",
    },
    {
      id: "wallet" as const,
      name: "Wallet",
      icon: Wallet,
      description: "Paytm • PhonePe • GPay",
      processingTime: "Instant",
      bgColor: "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
    {
      id: "qr" as const,
      name: "QR Code",
      icon: QrCode,
      description: "Scan with any UPI app",
      processingTime: "Instant",
      bgColor: "bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20",
      borderColor: "border-orange-200 dark:border-orange-800",
    },
  ]

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (selectedMethod === "upi") {
      if (!upiId) {
        errors.upiId = "UPI ID is required"
      } else if (!/^[\w.-]+@[\w.-]+$/.test(upiId)) {
        errors.upiId = "Please enter a valid UPI ID"
      }
    }

    if (selectedMethod === "card") {
      if (!cardDetails.number) errors.number = "Card number is required"
      else if (cardDetails.number.replace(/\s/g, "").length < 16) errors.number = "Invalid card number"

      if (!cardDetails.expiry) errors.expiry = "Expiry date is required"
      else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiry)) errors.expiry = "Invalid expiry date"

      if (!cardDetails.cvv) errors.cvv = "CVV is required"
      else if (cardDetails.cvv.length < 3) errors.cvv = "Invalid CVV"

      if (!cardDetails.name) errors.name = "Cardholder name is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const simulatePayment = async () => {
    setPaymentStatus("processing")
    setCurrentStep("processing")

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Simulate success/failure (95% success rate)
    const isSuccess = Math.random() > 0.05

    if (isSuccess) {
      setPaymentStatus("success")
      const paymentData = {
        orderId: `ORD${Date.now()}`,
        transactionId: `TXN${Date.now()}`,
        amount: total,
        method: selectedMethod,
        status: "completed",
        timestamp: new Date().toISOString(),
      }

      setTimeout(() => {
        onPaymentSuccess(paymentData)
        onClose()
        setPaymentStatus("idle")
      }, 2000)
    } else {
      setPaymentStatus("error")
      setTimeout(() => {
        onPaymentError("Payment failed. Please try again.")
        setPaymentStatus("idle")
        setCurrentStep("form")
      }, 2000)
    }
  }

  const handlePayment = () => {
    if (!validateForm()) return
    simulatePayment()
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return v
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case "summary":
        return "Order Summary"
      case "method":
        return "Payment Method"
      case "form":
        return "Payment Details"
      case "processing":
        return "Processing Payment"
      default:
        return "Complete Payment"
    }
  }

  const renderOrderSummary = () => (
    <div className="space-y-4">
      <Card className="border-2 border-dashed border-primary/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-lg">Your Order</h4>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </Badge>
          </div>

          <ScrollArea className="max-h-40">
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium">{item.quantity}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">₹{item.price} each</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="space-y-2 mt-4 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Platform Fee</span>
              <span>₹{platformFee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>GST</span>
              <span>₹{gst}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">₹{total}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={() => setCurrentStep("method")} className="w-full h-12 text-lg font-semibold" size="lg">
        Proceed to Payment
      </Button>
    </div>
  )

  const renderPaymentMethods = () => (
    <div className="space-y-4">
      <RadioGroup
        value={selectedMethod}
        onValueChange={(value) => setSelectedMethod(value as PaymentMethod)}
        className="space-y-3"
      >
        {paymentMethods.map((method) => {
          const Icon = method.icon
          const isSelected = selectedMethod === method.id

          return (
            <div key={method.id} className="relative">
              <RadioGroupItem value={method.id} id={method.id} className="peer sr-only" />
              <Label
                htmlFor={method.id}
                className={cn(
                  "flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200",
                  "hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
                  isSelected
                    ? `${method.bgColor} ${method.borderColor} shadow-md`
                    : "border-border hover:border-primary/20",
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                    isSelected ? "bg-primary text-white" : "bg-muted",
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{method.name}</span>
                    {method.popular && <Badge className="bg-primary text-white text-xs px-2 py-0.5">Popular</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{method.description}</p>
                  <p className="text-xs text-primary font-medium">{method.processingTime}</p>
                </div>

                <div
                  className={cn(
                    "w-5 h-5 border-2 rounded-full flex items-center justify-center transition-colors",
                    isSelected ? "border-primary bg-primary" : "border-muted-foreground",
                  )}
                >
                  {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </Label>
            </div>
          )
        })}
      </RadioGroup>

      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={() => setCurrentStep("summary")} className="flex-1 h-12">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={() => setCurrentStep("form")} className="flex-1 h-12">
          Continue
        </Button>
      </div>
    </div>
  )

  const renderPaymentForm = () => {
    const selectedMethodData = paymentMethods.find((m) => m.id === selectedMethod)

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg border">
          {(() => {
            const Icon = selectedMethodData?.icon
            return Icon ? <Icon className="w-6 h-6 text-primary" /> : null
          })()}
          <div>
            <p className="font-semibold">{selectedMethodData?.name}</p>
            <p className="text-sm text-muted-foreground">
              Pay ₹{total} • {selectedMethodData?.processingTime}
            </p>
          </div>
        </div>

        {selectedMethod === "upi" && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="upi-id" className="text-sm font-medium">
                UPI ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="upi-id"
                placeholder="yourname@paytm"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className={cn(
                  "mt-2 h-12 text-base",
                  formErrors.upiId && "border-destructive focus-visible:ring-destructive",
                )}
              />
              {formErrors.upiId && <p className="text-sm text-destructive mt-1">{formErrors.upiId}</p>}
            </div>
            <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
              <p className="font-medium mb-1">Popular UPI IDs:</p>
              <p>• 9876543210@paytm • yourname@oksbi • user@googlepay</p>
            </div>
          </div>
        )}

        {selectedMethod === "card" && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="card-number" className="text-sm font-medium">
                Card Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) =>
                  setCardDetails((prev) => ({
                    ...prev,
                    number: formatCardNumber(e.target.value),
                  }))
                }
                className={cn(
                  "mt-2 h-12 text-base font-mono tracking-wider",
                  formErrors.number && "border-destructive focus-visible:ring-destructive",
                )}
                maxLength={19}
              />
              {formErrors.number && <p className="text-sm text-destructive mt-1">{formErrors.number}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry" className="text-sm font-medium">
                  Expiry <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) =>
                    setCardDetails((prev) => ({
                      ...prev,
                      expiry: formatExpiry(e.target.value),
                    }))
                  }
                  className={cn(
                    "mt-2 h-12 text-base font-mono",
                    formErrors.expiry && "border-destructive focus-visible:ring-destructive",
                  )}
                  maxLength={5}
                />
                {formErrors.expiry && <p className="text-sm text-destructive mt-1">{formErrors.expiry}</p>}
              </div>

              <div>
                <Label htmlFor="cvv" className="text-sm font-medium">
                  CVV <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="cvv"
                    type={showCardCVV ? "text" : "password"}
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) =>
                      setCardDetails((prev) => ({
                        ...prev,
                        cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                      }))
                    }
                    className={cn(
                      "mt-2 h-12 text-base font-mono pr-10",
                      formErrors.cvv && "border-destructive focus-visible:ring-destructive",
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-2 h-12 px-3 hover:bg-transparent"
                    onClick={() => setShowCardCVV(!showCardCVV)}
                  >
                    {showCardCVV ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {formErrors.cvv && <p className="text-sm text-destructive mt-1">{formErrors.cvv}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="card-name" className="text-sm font-medium">
                Cardholder Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="card-name"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={(e) =>
                  setCardDetails((prev) => ({
                    ...prev,
                    name: e.target.value.toUpperCase(),
                  }))
                }
                className={cn(
                  "mt-2 h-12 text-base",
                  formErrors.name && "border-destructive focus-visible:ring-destructive",
                )}
              />
              {formErrors.name && <p className="text-sm text-destructive mt-1">{formErrors.name}</p>}
            </div>
          </div>
        )}

        {selectedMethod === "wallet" && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "Paytm", color: "bg-blue-500" },
                { name: "PhonePe", color: "bg-purple-500" },
                { name: "GPay", color: "bg-green-500" },
              ].map((wallet) => (
                <Button
                  key={wallet.name}
                  variant="outline"
                  className="h-20 flex flex-col gap-2 hover:shadow-md transition-all bg-transparent"
                >
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", wallet.color)}>
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium">{wallet.name}</span>
                </Button>
              ))}
            </div>
            <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg text-center">
              You will be redirected to complete the payment
            </div>
          </div>
        )}

        {selectedMethod === "qr" && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-56 h-56 bg-white border-2 border-dashed border-primary/30 rounded-2xl flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-green-500 text-white px-2 py-1 text-xs">₹{total}</Badge>
                </div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="font-medium">Scan to Pay ₹{total}</p>
              <p className="text-sm text-muted-foreground">Open any UPI app and scan this QR code</p>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => setCurrentStep("method")} className="flex-1 h-12">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handlePayment} className="flex-1 h-12 text-lg font-semibold">
            Pay ₹{total}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
          <Shield className="w-4 h-4" />
          <p>Secured by 256-bit SSL encryption</p>
        </div>
      </div>
    )
  }

  const renderProcessingStatus = () => {
    switch (paymentStatus) {
      case "processing":
        return (
          <div className="text-center py-12">
            <div className="relative mb-6">
              <Loader2 className="w-16 h-16 animate-spin mx-auto text-primary" />
              <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-primary/20 rounded-full"></div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Processing Payment</h3>
            <p className="text-muted-foreground mb-4">Please don't close or refresh this page</p>
            <div className="max-w-xs mx-auto bg-muted/30 rounded-lg p-3">
              <p className="text-sm">Amount: ₹{total}</p>
              <p className="text-sm">Method: {paymentMethods.find((m) => m.id === selectedMethod)?.name}</p>
            </div>
          </div>
        )

      case "success":
        return (
          <div className="text-center py-12">
            <div className="relative mb-6">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
              <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-green-100 rounded-full animate-ping"></div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-green-600">Payment Successful!</h3>
            <p className="text-muted-foreground mb-4">Your order is being prepared</p>
            <Badge className="bg-green-500 text-white">Order #ORD{Date.now().toString().slice(-6)}</Badge>
          </div>
        )

      case "error":
        return (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 mx-auto mb-6 text-destructive" />
            <h3 className="text-xl font-semibold mb-2">Payment Failed</h3>
            <p className="text-muted-foreground mb-6">Don't worry, your money is safe</p>
            <div className="flex gap-3 max-w-sm mx-auto">
              <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Close
              </Button>
              <Button onClick={() => setCurrentStep("form")} className="flex-1">
                Try Again
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-3 text-xl">
            {getStepTitle()}
            {(currentStep === "method" || currentStep === "form") && (
              <Badge variant="outline" className="text-xs">
                Step {currentStep === "method" ? "2" : "3"} of 3
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="p-6">
            {currentStep === "processing" && renderProcessingStatus()}
            {currentStep === "summary" && renderOrderSummary()}
            {currentStep === "method" && renderPaymentMethods()}
            {currentStep === "form" && renderPaymentForm()}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

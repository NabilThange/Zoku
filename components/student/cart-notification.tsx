"use client"

import { useEffect, useState } from "react"
import { ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CartNotificationProps {
  isVisible: boolean
  cartItemCount: number
  onClose: () => void
  onGoToCart: () => void
}

export function CartNotification({ isVisible, cartItemCount, onClose, onGoToCart }: CartNotificationProps) {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true)
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  if (!shouldRender) return null

  return (
    <div
      className="fixed left-4 right-4 z-[60]"
      style={{
        bottom: "calc(90px + env(safe-area-inset-bottom))", // Position above navigation with more clearance
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      <div className="flex justify-center">
        <div
          className={`
            bg-white rounded-xl sm:rounded-2xl border border-gray-100/60 px-4 py-3 shadow-lg
            transition-all duration-300 ease-out cursor-pointer max-w-sm w-full
            sm:max-w-md md:max-w-lg lg:max-w-sm
            ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"}
          `}
          style={{
            boxShadow: "0 16px 48px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.04), 0 1px 4px rgba(0, 0, 0, 0.02)",
          }}
          onClick={onGoToCart}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#FF6B35" }}
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm sm:text-base truncate" style={{ color: "#2D3748" }}>
                {cartItemCount} item{cartItemCount !== 1 ? "s" : ""} in cart
              </p>
              <p className="text-xs sm:text-sm" style={{ color: "#718096" }}>
                Tap to view cart
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 sm:w-7 sm:h-7 p-0 rounded-full hover:bg-gray-100 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "#718096" }} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

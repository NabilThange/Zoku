"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, MapPin, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface FloatingActionBarProps {
  cartItemCount: number
  hasActiveOrder: boolean
  currentTab?: string // Added current tab to hide component when on cart tab
  onCartClick?: () => void
  onTrackOrderClick?: () => void
  onSwitchToCart?: () => void // Added tab switching functions instead of navigation
  onSwitchToOrders?: () => void
}

export function FloatingActionBar({
  cartItemCount,
  hasActiveOrder,
  currentTab,
  onCartClick,
  onTrackOrderClick,
  onSwitchToCart,
  onSwitchToOrders,
}: FloatingActionBarProps) {
  const router = useRouter()
  const [shouldShow, setShouldShow] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const showTrackOrder = hasActiveOrder
  const showCart = cartItemCount > 0 && !hasActiveOrder

  const isOnCartTab = currentTab === "cart"

  useEffect(() => {
    const newShouldShow = (showTrackOrder || showCart) && !isOnCartTab

    if (newShouldShow !== shouldShow) {
      setIsAnimating(true)
      setShouldShow(newShouldShow)

      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [showTrackOrder, showCart, shouldShow, isOnCartTab])

  const handleClick = () => {
    if (showTrackOrder) {
      onTrackOrderClick?.()
      onSwitchToOrders?.()
    } else {
      onCartClick?.()
      onSwitchToCart?.()
    }
  }

  if (!shouldShow) return null

  return (
    <>
      {/* Mobile version */}
      <div
        className="md:hidden fixed left-0 right-0 z-50"
        style={{
          bottom: "calc(100px + env(safe-area-inset-bottom))",
          paddingLeft: "max(12px, env(safe-area-inset-left))",
          paddingRight: "max(12px, env(safe-area-inset-right))",
        }}
      >
        <div className="flex justify-center px-3 xs:px-4 sm:px-5">
          <Button
            onClick={handleClick}
            className={`group relative overflow-hidden 
              w-full max-w-[300px] xs:max-w-[320px] sm:max-w-[380px]
              h-14 xs:h-15 sm:h-16
              ${
                showTrackOrder
                  ? "bg-gradient-to-r from-orange-50 to-orange-100/90 hover:from-orange-100 hover:to-orange-200/90 border-orange-200/80 hover:border-orange-300/90"
                  : "bg-gradient-to-r from-orange-50 to-red-50/90 hover:from-orange-100 hover:to-red-100/90 border-orange-200/80 hover:border-orange-300/90"
              }
              text-gray-800 hover:text-gray-900 
              rounded-xl xs:rounded-2xl sm:rounded-2xl
              shadow-lg hover:shadow-2xl transition-all duration-300 ease-out 
              active:scale-[0.96] hover:scale-[1.02]
              ${isAnimating ? (shouldShow ? "animate-slide-up" : "animate-slide-down") : ""}
              ${showTrackOrder ? "ring-2 ring-orange-300/70 shadow-orange-200/30" : "ring-1 ring-orange-200/50 shadow-orange-100/20"}
              border-2 backdrop-blur-sm
            `}
            style={{
              boxShadow: showTrackOrder
                ? "0 12px 48px rgba(251, 146, 60, 0.25), 0 8px 24px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(251, 146, 60, 0.1)"
                : "0 12px 48px rgba(251, 146, 60, 0.18), 0 8px 24px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(251, 146, 60, 0.08)",
            }}
          >
            <div className="flex items-center justify-between w-full px-3 xs:px-4 sm:px-5">
              <div className="flex items-center gap-2.5 xs:gap-3 sm:gap-4">
                <div
                  className={`
                  w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11
                  rounded-full flex items-center justify-center shadow-md
                  transform transition-transform duration-200 group-hover:scale-105
                  ${
                    showTrackOrder
                      ? "bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white shadow-orange-300/40"
                      : "bg-gradient-to-br from-red-400 via-red-500 to-red-600 text-white shadow-red-300/40"
                  }
                `}
                >
                  {showTrackOrder ? (
                    <MapPin className="w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 drop-shadow-sm" />
                  ) : (
                    <ShoppingCart className="w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 drop-shadow-sm" />
                  )}
                </div>

                <div className="text-left flex-1 min-w-0">
                  <p className="font-bold text-sm xs:text-base sm:text-base leading-tight text-gray-800 mb-0.5 truncate">
                    {showTrackOrder ? "Track Your Order" : "View Cart"}
                  </p>
                  <p className="text-xs xs:text-sm sm:text-sm text-gray-600 leading-tight font-medium truncate">
                    {showTrackOrder
                      ? "Check delivery status"
                      : `${cartItemCount} item${cartItemCount !== 1 ? "s" : ""} ready`}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md ml-2 transition-all duration-200 group-hover:bg-white group-hover:scale-105">
                <ChevronRight className="w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 text-gray-600 group-hover:text-gray-800 transition-all duration-200 group-hover:translate-x-0.5 flex-shrink-0" />
              </div>
            </div>

            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/25 via-white/10 to-white/20 rounded-xl xs:rounded-2xl sm:rounded-2xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent rounded-xl xs:rounded-2xl sm:rounded-2xl pointer-events-none opacity-70" />
            <div className="absolute -inset-px bg-gradient-to-r from-orange-200/40 to-transparent rounded-xl xs:rounded-2xl sm:rounded-2xl pointer-events-none opacity-60" />
          </Button>
        </div>
      </div>

      {/* Tablet and Desktop version */}
      <div
        className="hidden md:block fixed left-0 right-0 z-50"
        style={{
          bottom: "calc(145px + env(safe-area-inset-bottom))",
          paddingLeft: "max(12px, env(safe-area-inset-left))",
          paddingRight: "max(12px, env(safe-area-inset-right))",
        }}
      >
        <div className="flex justify-center px-6">
          <Button
            onClick={handleClick}
            className={`group relative overflow-hidden 
              w-full max-w-[420px] lg:max-w-[380px] xl:max-w-[360px]
              h-[68px] lg:h-[64px] xl:h-[60px]
              ${
                showTrackOrder
                  ? "bg-gradient-to-r from-orange-50 to-orange-100/90 hover:from-orange-100 hover:to-orange-200/90 border-orange-200/80 hover:border-orange-300/90"
                  : "bg-gradient-to-r from-orange-50 to-red-50/90 hover:from-orange-100 hover:to-red-100/90 border-orange-200/80 hover:border-orange-300/90"
              }
              text-gray-800 hover:text-gray-900 
              rounded-3xl
              shadow-lg hover:shadow-2xl transition-all duration-300 ease-out 
              active:scale-[0.96] hover:scale-[1.02]
              ${isAnimating ? (shouldShow ? "animate-slide-up" : "animate-slide-down") : ""}
              ${showTrackOrder ? "ring-2 ring-orange-300/70 shadow-orange-200/30" : "ring-1 ring-orange-200/50 shadow-orange-100/20"}
              border-2 backdrop-blur-sm
            `}
            style={{
              boxShadow: showTrackOrder
                ? "0 12px 48px rgba(251, 146, 60, 0.25), 0 8px 24px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(251, 146, 60, 0.1)"
                : "0 12px 48px rgba(251, 146, 60, 0.18), 0 8px 24px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(251, 146, 60, 0.08)",
            }}
          >
            <div className="flex items-center justify-between w-full px-6 lg:px-5">
              <div className="flex items-center gap-5 lg:gap-4">
                <div
                  className={`
                  w-12 h-12 lg:w-11 lg:h-11
                  rounded-full flex items-center justify-center shadow-md
                  transform transition-transform duration-200 group-hover:scale-105
                  ${
                    showTrackOrder
                      ? "bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white shadow-orange-300/40"
                      : "bg-gradient-to-br from-red-400 via-red-500 to-red-600 text-white shadow-red-300/40"
                  }
                `}
                >
                  {showTrackOrder ? (
                    <MapPin className="w-6 h-6 lg:w-5 lg:h-5 drop-shadow-sm" />
                  ) : (
                    <ShoppingCart className="w-6 h-6 lg:w-5 lg:h-5 drop-shadow-sm" />
                  )}
                </div>

                <div className="text-left flex-1 min-w-0">
                  <p className="font-bold text-lg lg:text-base leading-tight text-gray-800 mb-0.5 truncate">
                    {showTrackOrder ? "Track Your Order" : "View Cart"}
                  </p>
                  <p className="text-base lg:text-sm text-gray-600 leading-tight font-medium truncate">
                    {showTrackOrder
                      ? "Check delivery status"
                      : `${cartItemCount} item${cartItemCount !== 1 ? "s" : ""} ready`}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center w-11 h-11 lg:w-10 lg:h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md ml-2 transition-all duration-200 group-hover:bg-white group-hover:scale-105">
                <ChevronRight className="w-6 h-6 lg:w-5 lg:h-5 text-gray-600 group-hover:text-gray-800 transition-all duration-200 group-hover:translate-x-0.5 flex-shrink-0" />
              </div>
            </div>

            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/25 via-white/10 to-white/20 rounded-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent rounded-3xl pointer-events-none opacity-70" />
            <div className="absolute -inset-px bg-gradient-to-r from-orange-200/40 to-transparent rounded-3xl pointer-events-none opacity-60" />
          </Button>
        </div>
      </div>
    </>
  )
}

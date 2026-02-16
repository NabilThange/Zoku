"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Home, User, ShoppingCart } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface StudentNavbarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  cartItemCount?: number
}

export function StudentNavbar({ activeTab, onTabChange, cartItemCount = 0 }: StudentNavbarProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [prevCartCount, setPrevCartCount] = useState(cartItemCount)
  const [badgeKey, setBadgeKey] = useState(0)

  useEffect(() => {
    if (cartItemCount > prevCartCount) {
      setBadgeKey((prev) => prev + 1)
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50])
      }
    }
    setPrevCartCount(cartItemCount)
  }, [cartItemCount, prevCartCount])

  const navItems = [
    { id: "menu", icon: Home, label: "Home" },
    { id: "cart", icon: ShoppingCart, label: "Cart", badge: cartItemCount },
    { id: "profile", icon: User, label: "Profile" },
  ]

  const handleTabClick = (tabId: string) => {
    if (tabId === activeTab) return
    setIsAnimating(true)
    onTabChange(tabId)

    if (navigator.vibrate) {
      navigator.vibrate(10)
    }

    setTimeout(() => setIsAnimating(false), 400)
  }

  return (
    <>
      <div
        className="fixed left-0 right-0 z-50 pb-safe"
        style={{
          bottom: "4px",
          paddingBottom: "max(4px, env(safe-area-inset-bottom))",
          paddingLeft: "max(4px, env(safe-area-inset-left))",
          paddingRight: "max(4px, env(safe-area-inset-right))",
        }}
      >
        <div className="flex justify-center px-2 sm:px-3 md:px-4 lg:px-6">
          <div
            className="bg-white rounded-2xl sm:rounded-2xl md:rounded-3xl border border-gray-100/60 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 md:py-3 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl w-full md:px-8"
            style={{
              boxShadow:
                "0 16px 48px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.04), 0 1px 4px rgba(0, 0, 0, 0.02)",
              backdropFilter: "blur(12px)",
            }}
          >
            <TooltipProvider>
              <nav
                className="flex items-center justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-20"
                role="navigation"
                aria-label="Main navigation"
              >
                {navItems.map((item, index) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id

                  return (
                    <Tooltip key={item.id}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleTabClick(item.id)}
                          className={`
                            relative flex items-center justify-center group
                            w-14 h-14 sm:w-16 sm:h-16 md:w-16 md:h-16 lg:w-18 lg:h-18 
                            rounded-xl sm:rounded-xl md:rounded-2xl transition-all duration-200 ease-out
                            focus:outline-none focus-visible:ring-3 focus-visible:ring-offset-2 focus-visible:ring-orange-400/40
                            hover:scale-[1.02] active:scale-95
                            ${
                              isActive
                                ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 ring-2 ring-orange-400/20"
                                : "text-gray-500 hover:text-orange-600 hover:bg-orange-50 hover:shadow-sm hover:shadow-orange-500/10 bg-gray-50/50 hover:bg-gradient-to-br hover:from-orange-50 hover:to-orange-100/80"
                            }
                          `}
                          style={
                            {
                              minWidth: "56px",
                              minHeight: "56px",
                              fontSize: "0.875rem",
                              fontWeight: "500",
                              letterSpacing: "-0.025em",
                              "--tw-ring-color": "rgb(251 146 60 / 0.4)",
                            } as React.CSSProperties
                          }
                          aria-label={`${item.label} tab${isActive ? ", currently selected" : ""}${item.badge ? `, ${item.badge} items` : ""}`}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <Icon
                            className={`w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6 lg:w-7 lg:h-7 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"}`}
                            strokeWidth={isActive ? 2.5 : 2}
                            aria-hidden="true"
                          />

                          {item.badge && item.badge > 0 && (
                            <div
                              key={badgeKey}
                              className="absolute -top-1 -right-1 min-w-[18px] sm:min-w-[20px] md:min-w-[22px] h-[18px] sm:h-[20px] md:h-[22px] px-1.5 bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] sm:text-xs md:text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-lg ring-2 ring-red-500/30"
                              style={{
                                animation: "badge-bounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                                lineHeight: "1",
                                fontSize: "10px",
                              }}
                              aria-label={`${item.badge} items in cart`}
                            >
                              {item.badge > 99 ? "99+" : item.badge}
                            </div>
                          )}

                          {isActive && (
                            <div
                              className="absolute inset-0 rounded-xl sm:rounded-xl md:rounded-2xl bg-white/15"
                              style={{
                                animation: "active-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) 0.1s 1",
                              }}
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        className="bg-gray-900 text-white border-0 rounded-xl px-3 py-2 text-sm font-medium shadow-lg"
                        style={{
                          backgroundColor: "#2D3748",
                          fontSize: "0.8125rem",
                          fontWeight: "500",
                          letterSpacing: "-0.01em",
                        }}
                        sideOffset={12}
                      >
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </nav>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes badge-bounce {
          0% {
            transform: scale(0.3) rotate(-12deg);
            opacity: 0;
          }
          30% {
            transform: scale(1.3) rotate(8deg);
            opacity: 1;
          }
          60% {
            transform: scale(0.9) rotate(-3deg);
            opacity: 1;
          }
          80% {
            transform: scale(1.1) rotate(1deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes active-pulse {
          0% {
            opacity: 0.8;
            transform: scale(0.95);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.02);
          }
          100% {
            opacity: 0;
            transform: scale(1.05);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            transform: none !important;
          }
        }

        @media (max-width: 359px) {
          div[style*="paddingBottom"] > div {
            padding-left: 8px;
            padding-right: 8px;
          }
        }

        @media (min-width: 360px) and (max-width: 479px) {
          div[style*="paddingBottom"] > div {
            padding-left: 12px;
            padding-right: 12px;
          }
        }

        @media (min-width: 1024px) {
          div[style*="paddingBottom"] > div {
            padding-left: 32px;
            padding-right: 32px;
          }
        }

        @media (min-width: 1440px) {
          div[style*="paddingBottom"] > div {
            padding-left: 48px;
            padding-right: 48px;
          }
        }

        @media (prefers-contrast: high) {
          nav {
            border: 2px solid currentColor;
            background: white !important;
          }
          
          button[aria-current="page"] {
            outline: 3px solid currentColor !important;
            outline-offset: 2px;
            background: #FF6B35 !important;
          }

          button:not([aria-current="page"]) {
            border: 1px solid currentColor;
          }
        }

        @media (prefers-color-scheme: dark) {
          div[style*="boxShadow"] {
            background: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(16px);
          }
        }

        @media (max-width: 480px) and (max-height: 800px) {
          div[style*="backdropFilter"] {
            backdrop-filter: none;
            background: white !important;
          }
        }

        @media (min-width: 1920px) {
          nav {
            gap: 24px;
          }
        }
      `}</style>
    </>
  )
}

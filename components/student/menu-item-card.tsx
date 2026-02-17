"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Clock, Plus, Minus, Star, Flame, ShoppingCart, Zap, Heart, ArrowLeft, Award, TrendingUp } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export interface MenuItem {
  id: number
  name: string
  price: number
  image: string
  category: string
  isVeg: boolean
  prepTime: number
  available: boolean
  truckName?: string // NEW: Which truck this item belongs to
  truckId?: number // NEW: Truck identifier
  description?: string
  rating?: number
  reviewCount?: number
  isSpicy?: boolean
  isPopular?: boolean
  isBestseller?: boolean
  calories?: number
  originalPrice?: number
  tags?: string[]
  ingredients?: string[]
  allergens?: string[]
  nutritionalInfo?: {
    protein?: number
    carbs?: number
    fat?: number
    fiber?: number
    [key: string]: number | undefined // Allow dynamic nutritional keys
  }
  chef?: string
  dateAdded?: string
  lastUpdated?: string
  stockQuantity?: number
  minimumOrderQuantity?: number
  customizations?: {
    id: string
    name: string
    options: { name: string; price: number }[]
  }[]
}

interface MenuItemCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem, quantity: number) => void
  cartQuantity?: number
  onItemClick?: (item: MenuItem) => void
  compact?: boolean
}

export function MenuItemCard({ item, onAddToCart, cartQuantity = 0, onItemClick, compact = false }: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(cartQuantity)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedCustomizations, setSelectedCustomizations] = useState<Record<string, string>>({})
  const [isAdditionalInfoOpen, setIsAdditionalInfoOpen] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  const hasDiscount = item.originalPrice && item.originalPrice > item.price
  const discountPercent = hasDiscount ? Math.round(((item.originalPrice! - item.price) / item.originalPrice!) * 100) : 0

  const handleAddToCart = () => {
    const newQuantity = quantity + 1
    setQuantity(newQuantity)
    onAddToCart(item, 1)
  }

  const handleQuantityChange = (change: number) => {
    const minQuantity = item.minimumOrderQuantity || 1
    const newQuantity = Math.max(0, quantity + change)

    if (newQuantity > 0 && newQuantity < minQuantity) {
      setQuantity(minQuantity)
      onAddToCart(item, minQuantity - quantity)
    } else {
      setQuantity(newQuantity)
      onAddToCart(item, change)
    }
  }

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if ((e.target as Element).closest("button")) return

    setIsDetailModalOpen(true)
    if (onItemClick) {
      onItemClick(item)
    }
  }

  const calculateTotalPrice = () => {
    let total = item.price
    Object.values(selectedCustomizations).forEach((optionId) => {
      item.customizations?.forEach((custom) => {
        const option = custom.options.find((opt) => opt.name === optionId)
        if (option) total += option.price
      })
    })
    return total
  }

  // Clean, minimal card design following Zoku design system
  return (
    <>
      <Card
        className={cn(
          "group overflow-hidden bg-white transition-all duration-200 cursor-pointer border border-[var(--color-border)] rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 flex flex-col relative",
          compact ? "max-w-sm h-auto" : "h-auto min-h-[340px]",
        )}
        onClick={handleCardClick}
      >
        {!item.available && <div className="absolute inset-0 bg-gray-500/30 z-10 rounded-lg" />}

        {!item.available && (
          <div className="absolute top-2 left-2 z-20">
            <Badge className="bg-red-500 text-white text-xs px-2 py-1 font-medium shadow-lg">Unavailable</Badge>
          </div>
        )}

        {/* Image takes upper half */}
        <div className={cn("relative bg-cream-deep overflow-hidden flex-shrink-0 rounded-t-xl", compact ? "h-[140px]" : "h-[180px]")}>
          {!imageError ? (
            <img
              src={item.image || "/placeholder.svg?height=180&width=240"}
              alt={item.name}
              className={cn(
                "w-full h-full object-cover transition-all duration-300",
                imageLoaded ? "opacity-100" : "opacity-0",
                "group-hover:scale-105",
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="w-6 h-6 bg-gray-300 rounded-full mx-auto mb-1 flex items-center justify-center">
                  <span className="text-gray-500 text-xs">🍽️</span>
                </div>
                <span className="text-xs text-gray-400 font-medium">No Image</span>
              </div>
            </div>
          )}

          {!imageLoaded && !imageError && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}

          {/* Van Badge - Clean monospace style */}
          {item.truckName && (
            <div className="absolute top-2 left-2 z-10">
              <Badge 
                className={cn(
                  "text-white font-mono text-xs px-2 py-1 font-medium shadow-md backdrop-blur-sm border-0 uppercase tracking-wider",
                  item.truckName === "Veg Van" && "bg-green-600",
                  item.truckName === "Non-Veg Van" && "bg-red-600",
                  item.truckName === "Healthy Van" && "bg-purple-600",
                  item.truckName === "Dessert Van" && "bg-yellow-600",
                  !["Veg Van", "Non-Veg Van", "Healthy Van", "Dessert Van"].includes(item.truckName) && "bg-ink"
                )}
              >
                {item.truckName}
              </Badge>
            </div>
          )}

          {/* Veg/Non-veg Indicator - moved right when truck badge present */}
          <div className={cn("absolute top-2", item.truckName ? "right-2" : "left-2")}>
            <div
              className={cn(
                "w-4 h-4 rounded-sm border-2 flex items-center justify-center bg-white/95 backdrop-blur-sm shadow-sm",
                item.isVeg ? "border-green-500" : "border-red-500",
              )}
            >
              <div className={cn("w-1.5 h-1.5 rounded-full", item.isVeg ? "bg-green-500" : "bg-red-500")} />
            </div>
          </div>

          {/* Bestseller Badge - Clean style */}
          {item.isBestseller && (
            <div className="absolute bottom-2 left-2">
              <Badge className="bg-gold text-white font-mono text-xs px-2 py-0.5 font-medium shadow-md border-0 uppercase tracking-wider">
                Bestseller
              </Badge>
            </div>
          )}

          {/* Only Available/Unavailable Status */}
          {item.available ? (
            <div className="absolute bottom-2 right-2">
              <Badge className="bg-cream-deep text-ink-soft border border-[var(--color-border-strong)] font-mono text-xs px-2 py-0.5 font-medium shadow-sm uppercase tracking-wider">
                Available
              </Badge>
            </div>
          ) : (
            <div className="absolute bottom-2 right-2">
              <Badge className="bg-ink text-cream font-mono text-xs px-2 py-0.5 font-medium shadow-sm uppercase tracking-wider">
                Sold Out
              </Badge>
            </div>
          )}
        </div>

        {/* Content takes remaining space */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          {/* Title & Rating Row */}
          <div className="space-y-2 flex-shrink-0">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={cn(
                  "font-display font-bold text-ink line-clamp-2 leading-tight flex-1",
                  compact ? "text-lg" : "text-xl",
                )}
              >
                {item.name}
              </h3>

              {/* Heart Icon */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsFavorited(!isFavorited)
                }}
                className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Heart className={cn("w-4 h-4", isFavorited ? "fill-red-500 text-red-500" : "text-gray-400")} />
              </button>
            </div>

            {/* Rating & Time */}
            <div className="flex items-center justify-between">
              {item.rating && item.reviewCount ? (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-gold text-gold" />
                  <span className="font-mono text-xs font-medium text-ink-soft">{item.rating}</span>
                  <span className="font-mono text-xs text-ink-muted">({item.reviewCount})</span>
                </div>
              ) : (
                <div></div>
              )}

              <div className="flex items-center gap-1 text-ink-soft">
                <Clock className="w-4 h-4" />
                <span className="font-mono text-sm font-medium">{item.prepTime}m</span>
              </div>
            </div>
          </div>

          {/* Bottom section with price and cart - Always visible */}
          <div className="flex items-center justify-between flex-shrink-0">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className={cn("font-mono font-bold text-ink", compact ? "text-lg" : "text-xl")}>₹{item.price}</span>
                {hasDiscount && <span className="font-mono text-sm text-ink-muted line-through">₹{item.originalPrice}</span>}
              </div>

              {/* Small calories */}
              {item.calories && <span className="font-mono text-xs text-ink-muted uppercase tracking-wider">{item.calories} cal</span>}
            </div>

            {/* Add to Cart Button */}
            <div className="flex items-center flex-shrink-0">
              {quantity === 0 ? (
                <Button
                  size="sm"
                  disabled={!item.available}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddToCart()
                  }}
                  className={cn(
                    "bg-white border-2 border-[var(--color-border-strong)] text-ink hover:bg-cream-deep hover:border-ink font-sans font-semibold uppercase tracking-wider transition-all duration-150",
                    compact ? "h-8 px-3 text-xs" : "h-9 px-4 text-sm",
                  )}
                >
                  ADD
                </Button>
              ) : (
                <div className="flex items-center gap-1 bg-cream-deep border-2 border-ink rounded-md px-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleQuantityChange(-1)
                    }}
                    className="h-7 w-7 p-0 text-ink hover:bg-cream"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>

                  <span className="font-mono font-bold text-ink px-2 min-w-[1.5rem] text-center text-sm">{quantity}</span>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleQuantityChange(1)
                    }}
                    className="h-7 w-7 p-0 text-ink hover:bg-cream"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Updated Modal - Almost Full Screen */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent
          className="max-w-none max-h-none h-[calc(100vh-10px)] w-[calc(100vw-10px)] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl fixed top-[5px] left-[5px] transform-none translate-x-0 translate-y-0"
          style={{ margin: "0" }}
        >
          <div className="flex flex-col h-full bg-white max-h-full rounded-2xl overflow-hidden">
            {/* Header with Back Button and Heart */}
            <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDetailModalOpen(false)}
                className="h-10 px-3 bg-white/90 hover:bg-white/95 text-gray-700 rounded-full backdrop-blur-sm shadow-lg border border-white/20 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFavorited(!isFavorited)}
                className="w-10 h-10 p-0 bg-white/90 hover:bg-white/95 rounded-full backdrop-blur-sm shadow-lg border border-white/20"
              >
                <Heart className={cn("w-5 h-5", isFavorited ? "fill-red-500 text-red-500" : "text-gray-700")} />
              </Button>
            </div>

            {/* Main Image */}
            <div className="relative h-80 w-full bg-gray-100 overflow-hidden rounded-t-2xl flex-shrink-0">
              <img
                src={item.image || "/placeholder.svg?height=320&width=400"}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Card with Shadow and Rounded Top */}
            <div className="bg-white rounded-t-[24px] sm:rounded-t-[32px] -mt-6 sm:-mt-8 relative z-10 shadow-2xl flex-1 min-h-0 flex flex-col">
              <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-0 space-y-4 sm:space-y-6 flex-1 min-h-0 overflow-auto">
                {/* Title with Veg/Non-veg Icon */}
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-sm border-2 flex items-center justify-center flex-shrink-0 mt-1",
                      item.isVeg ? "border-green-500" : "border-red-500",
                    )}
                  >
                    <div className={cn("w-2 h-2 rounded-full", item.isVeg ? "bg-green-500" : "bg-red-500")} />
                  </div>
                  <DialogTitle className="font-display text-2xl font-bold text-ink leading-tight tracking-tight flex-1">
                    {item.name}
                  </DialogTitle>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Van Badge in Modal - PROMINENT */}
                  {item.truckName && (
                    <Badge 
                      className={cn(
                        "text-white font-mono text-sm px-3 py-1.5 font-medium shadow-md uppercase tracking-wider",
                        item.truckName === "Veg Van" && "bg-green-600",
                        item.truckName === "Non-Veg Van" && "bg-red-600",
                        item.truckName === "Healthy Van" && "bg-purple-600",
                        item.truckName === "Dessert Van" && "bg-yellow-600",
                        !["Veg Van", "Non-Veg Van", "Healthy Van", "Dessert Van"].includes(item.truckName) && "bg-ink"
                      )}
                    >
                      {item.truckName}
                    </Badge>
                  )}
                  {item.isBestseller && (
                    <Badge className="bg-gold-light text-gold-dark border border-gold font-mono uppercase tracking-wider">
                      Best Seller
                    </Badge>
                  )}
                  {item.isSpicy && (
                    <Badge className="bg-cream-deep text-ink border border-[var(--color-border-strong)] font-mono uppercase tracking-wider">
                      Spicy
                    </Badge>
                  )}
                  {item.isPopular && (
                    <Badge className="bg-cream-deep text-ink border border-[var(--color-border-strong)] font-mono uppercase tracking-wider">
                      Popular
                    </Badge>
                  )}
                </div>

                {/* Pills - Calories, Time, Rating */}
                <div className="flex items-center gap-3 flex-wrap">
                  {item.calories && (
                    <div className="bg-cream-deep rounded-full px-4 py-2 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-ink-soft" />
                      <span className="font-mono text-sm font-medium text-ink uppercase tracking-wider">{item.calories} cals</span>
                    </div>
                  )}

                  <div className="bg-cream-deep rounded-full px-4 py-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-ink-soft" />
                    <span className="font-mono text-sm font-medium text-ink uppercase tracking-wider">{item.prepTime}min</span>
                  </div>

                  {item.rating && (
                    <div className="bg-cream-deep rounded-full px-4 py-2 flex items-center gap-2">
                      <Star className="w-4 h-4 fill-gold text-gold" />
                      <span className="font-mono text-sm font-medium text-ink uppercase tracking-wider">{item.rating} stars</span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-3xl font-bold text-ink leading-tight tracking-tight">₹{item.price}</span>
                  {hasDiscount && (
                    <span className="font-mono text-lg text-ink-muted line-through leading-tight">₹{item.originalPrice}</span>
                  )}
                </div>

                {/* Description */}
                {item.description && (
                  <div>
                    <p className="font-sans text-ink-soft leading-relaxed text-base">{item.description}</p>
                  </div>
                )}

                {item.nutritionalInfo && Object.keys(item.nutritionalInfo).length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 leading-[1.3] tracking-tight">
                      Nutritional Information
                    </h3>

                    <div className="bg-gray-50 rounded-2xl p-5 space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
                          <div className="text-2xl font-bold text-blue-600 leading-[1.1]">{item.calories || 0}</div>
                          <div className="text-sm text-blue-600 font-medium leading-[1.3] mt-1">Calories</div>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
                          <div className="text-2xl font-bold text-green-600 leading-[1.1]">{item.rating || 0}</div>
                          <div className="text-sm text-green-600 font-medium leading-[1.3] mt-1">Rating</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800 text-base leading-[1.3] tracking-tight">
                          Nutritional Breakdown
                        </h4>
                        <div className="space-y-3">
                          {Object.entries(item.nutritionalInfo).map(([key, value], index) => {
                            if (value === undefined || value === null) return null

                            const colorMap: Record<string, string> = {
                              protein: "bg-red-500",
                              carbs: "bg-yellow-500",
                              fat: "bg-purple-500",
                              fiber: "bg-orange-500",
                              sugar: "bg-pink-500",
                              sodium: "bg-blue-500",
                              calcium: "bg-green-500",
                              iron: "bg-gray-500",
                            }

                            const colorClass = colorMap[key.toLowerCase()] || "bg-gray-500"
                            const displayName = key.charAt(0).toUpperCase() + key.slice(1)

                            return (
                              <div
                                key={key}
                                className={cn(
                                  "flex items-center justify-between py-2",
                                  index < Object.keys(item.nutritionalInfo!).length - 1
                                    ? "border-b border-gray-200"
                                    : "",
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={cn("w-3 h-3 rounded-full", colorClass)}></div>
                                  <span className="text-sm font-medium text-black leading-[1.4]">{displayName}</span>
                                </div>
                                <span className="text-sm font-bold text-black leading-[1.4]">{value}g</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer with Add to Cart / Quantity Selector */}
              <div className="p-6 border-t border-[var(--color-border)] bg-white rounded-b-2xl flex-shrink-0">
                {quantity === 0 ? (
                  <Button
                    size="lg"
                    disabled={!item.available}
                    onClick={handleAddToCart}
                    className="w-full h-14 text-lg font-bold bg-ink hover:bg-ink-soft text-cream rounded-lg shadow-md font-sans uppercase tracking-wider"
                  >
                    <ShoppingCart className="w-5 h-5 mr-3" />
                    Add to Cart
                  </Button>
                ) : (
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => handleQuantityChange(-1)}
                      className="w-14 h-14 rounded-lg border-2 border-ink text-ink hover:bg-cream-deep"
                    >
                      <Minus className="w-5 h-5" />
                    </Button>

                    <div className="flex-1 text-center">
                      <div className="font-mono text-2xl font-bold text-ink leading-tight">{quantity}</div>
                      <div className="font-mono text-sm text-ink-muted leading-tight mt-1 uppercase tracking-wider">In Cart</div>
                    </div>

                    <Button
                      size="lg"
                      onClick={() => handleQuantityChange(1)}
                      className="w-14 h-14 rounded-lg bg-ink hover:bg-ink-soft text-cream"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

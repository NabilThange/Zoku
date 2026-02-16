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

  // Clean, minimal card design
  return (
    <>
      <Card
        className={cn(
          "group overflow-hidden bg-white transition-all duration-200 cursor-pointer border-0 shadow-sm hover:shadow-md flex flex-col relative",
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
        <div className={cn("relative bg-gray-50 overflow-hidden flex-shrink-0", compact ? "h-[140px]" : "h-[180px]")}>
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

          {/* Van Badge - Color Coded by Van Type */}
          {item.truckName && (
            <div className="absolute top-2 left-2 z-10">
              <Badge 
                className={cn(
                  "text-white text-xs px-2 py-1 font-bold shadow-lg backdrop-blur-sm border-0 flex items-center gap-1",
                  item.truckName === "Veg Van" && "bg-green-600",
                  item.truckName === "Non-Veg Van" && "bg-red-600",
                  item.truckName === "Healthy Van" && "bg-purple-600",
                  item.truckName === "Dessert Van" && "bg-yellow-600",
                  !["Veg Van", "Non-Veg Van", "Healthy Van", "Dessert Van"].includes(item.truckName) && "bg-black/80"
                )}
              >
                <span className="text-sm">
                  {item.truckName === "Veg Van" && "🥗"}
                  {item.truckName === "Non-Veg Van" && "🍗"}
                  {item.truckName === "Healthy Van" && "🥙"}
                  {item.truckName === "Dessert Van" && "🍰"}
                  {!["Veg Van", "Non-Veg Van", "Healthy Van", "Dessert Van"].includes(item.truckName) && "🚚"}
                </span>
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

          {/* Bestseller Badge - NEW */}
          {item.isBestseller && (
            <div className="absolute bottom-2 left-2">
              <Badge className="bg-yellow-500 text-white text-xs px-2 py-0.5 font-bold shadow-md border-0 flex items-center gap-1">
                <span>🔥</span>
                Bestseller
              </Badge>
            </div>
          )}

          {/* Only Available/Unavailable Status */}
          {item.available ? (
            <div className="absolute bottom-2 right-2">
              <Badge className="bg-green-100 text-green-700 border border-green-200 text-xs px-2 py-0.5 font-medium shadow-sm">
                Available
              </Badge>
            </div>
          ) : (
            <div className="absolute bottom-2 right-2">
              <Badge className="bg-red-100 text-red-700 border border-red-200 text-xs px-2 py-0.5 font-medium shadow-sm">
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
                  "font-semibold text-gray-900 line-clamp-2 leading-tight flex-1",
                  compact ? "text-sm" : "text-base",
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
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium text-gray-700">{item.rating}</span>
                  <span className="text-xs text-gray-500">({item.reviewCount})</span>
                </div>
              ) : (
                <div></div>
              )}

              <div className="flex items-center gap-1 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{item.prepTime}m</span>
              </div>
            </div>
          </div>

          {/* Bottom section with price and cart - Always visible */}
          <div className="flex items-center justify-between flex-shrink-0">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className={cn("font-bold text-gray-900", compact ? "text-lg" : "text-xl")}>₹{item.price}</span>
                {hasDiscount && <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>}
              </div>

              {/* Small calories */}
              {item.calories && <span className="text-xs text-gray-500">{item.calories} cal</span>}
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
                    "bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold transition-colors",
                    compact ? "h-8 px-3 text-xs" : "h-9 px-4 text-sm",
                  )}
                >
                  ADD
                </Button>
              ) : (
                <div className="flex items-center gap-1 bg-green-50 border-2 border-green-500 rounded-md px-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleQuantityChange(-1)
                    }}
                    className="h-7 w-7 p-0 text-green-600 hover:bg-green-100"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>

                  <span className="font-bold text-green-600 px-2 min-w-[1.5rem] text-center text-sm">{quantity}</span>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleQuantityChange(1)
                    }}
                    className="h-7 w-7 p-0 text-green-600 hover:bg-green-100"
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
                  <DialogTitle className="text-2xl font-bold text-gray-900 leading-[1.2] tracking-tight flex-1">
                    {item.name}
                  </DialogTitle>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Van Badge in Modal - PROMINENT */}
                  {item.truckName && (
                    <Badge 
                      className={cn(
                        "text-white text-sm px-3 py-1.5 font-bold shadow-md flex items-center gap-1.5",
                        item.truckName === "Veg Van" && "bg-green-600",
                        item.truckName === "Non-Veg Van" && "bg-red-600",
                        item.truckName === "Healthy Van" && "bg-purple-600",
                        item.truckName === "Dessert Van" && "bg-yellow-600",
                        !["Veg Van", "Non-Veg Van", "Healthy Van", "Dessert Van"].includes(item.truckName) && "bg-black/80"
                      )}
                    >
                      <span className="text-base">
                        {item.truckName === "Veg Van" && "🥗"}
                        {item.truckName === "Non-Veg Van" && "🍗"}
                        {item.truckName === "Healthy Van" && "🥙"}
                        {item.truckName === "Dessert Van" && "🍰"}
                        {!["Veg Van", "Non-Veg Van", "Healthy Van", "Dessert Van"].includes(item.truckName) && "🚚"}
                      </span>
                      {item.truckName}
                    </Badge>
                  )}
                  {item.isBestseller && (
                    <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      Best Seller
                    </Badge>
                  )}
                  {item.isSpicy && (
                    <Badge className="bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      Spicy
                    </Badge>
                  )}
                  {item.isPopular && (
                    <Badge className="bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Popular
                    </Badge>
                  )}
                </div>

                {/* Pills - Calories, Time, Rating */}
                <div className="flex items-center gap-3 flex-wrap">
                  {item.calories && (
                    <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700 leading-[1.4]">{item.calories} cals</span>
                    </div>
                  )}

                  <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700 leading-[1.4]">{item.prepTime}min</span>
                  </div>

                  {item.rating && (
                    <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-700 leading-[1.4]">{item.rating} stars</span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900 leading-[1.1] tracking-tight">₹{item.price}</span>
                  {hasDiscount && (
                    <span className="text-lg text-gray-500 line-through leading-[1.2]">₹{item.originalPrice}</span>
                  )}
                </div>

                {/* Description */}
                {item.description && (
                  <div>
                    <p className="text-gray-600 leading-[1.6] text-base tracking-wide">{item.description}</p>
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
              <div className="p-6 border-t border-gray-100 bg-white rounded-b-2xl flex-shrink-0">
                {quantity === 0 ? (
                  <Button
                    size="lg"
                    disabled={!item.available}
                    onClick={handleAddToCart}
                    className="w-full h-14 text-lg font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-2xl shadow-lg leading-[1.2] tracking-tight"
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
                      className="w-14 h-14 rounded-2xl border-2 border-orange-500 text-orange-600 hover:bg-orange-50"
                    >
                      <Minus className="w-5 h-5" />
                    </Button>

                    <div className="flex-1 text-center">
                      <div className="text-2xl font-bold text-gray-900 leading-[1.1]">{quantity}</div>
                      <div className="text-sm text-gray-500 leading-[1.3] mt-1">In Cart</div>
                    </div>

                    <Button
                      size="lg"
                      onClick={() => handleQuantityChange(1)}
                      className="w-14 h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white"
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

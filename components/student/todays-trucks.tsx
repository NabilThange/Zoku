"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface Truck {
  id: number
  name: string
  logo: string
  cuisineType: string
  location: string
  parkingSpot: string
  openTime: string
  closeTime: string
  isOpen: boolean
  queueLength: number
  rating: number
  distance: string
  specialToday?: string
}

interface TodaysTrucksProps {
  trucks: Truck[]
  onTruckClick?: (truckId: number) => void
}

export function TodaysTrucks({ trucks, onTruckClick }: TodaysTrucksProps) {
  if (trucks.length === 0) {
    return (
      <Card className="shadow-md border-0" style={{ backgroundColor: "white", borderRadius: "16px" }}>
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">🚚</span>
            </div>
            <div>
              <p className="font-semibold mb-1 text-gray-900">No Trucks Today</p>
              <p className="text-gray-600 text-sm">Check back tomorrow for new trucks!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold" style={{ color: "#2D3748" }}>
          Today's Trucks on Campus 🚚
        </h3>
        <Badge className="bg-orange-100 text-orange-700 border border-orange-200 text-xs px-2 py-1 font-medium">
          {trucks.filter((t) => t.isOpen).length} Open Now
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {trucks.map((truck) => (
          <Card
            key={truck.id}
            className={cn(
              "overflow-hidden transition-all duration-200 cursor-pointer border-2 hover:shadow-lg hover:-translate-y-1",
              truck.isOpen ? "border-green-500 bg-white" : "border-gray-300 bg-gray-50",
            )}
            onClick={() => onTruckClick?.(truck.id)}
          >
            <CardContent className="p-4 space-y-3">
              {/* Header with Logo and Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl"
                    style={{
                      backgroundColor: truck.isOpen ? "#FFF7ED" : "#F3F4F6",
                      border: `2px solid ${truck.isOpen ? "#FF6B35" : "#D1D5DB"}`,
                    }}
                  >
                    {truck.logo || "🚚"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-base text-gray-900 truncate">{truck.name}</h4>
                    <p className="text-sm text-gray-600 truncate">{truck.cuisineType}</p>
                  </div>
                </div>
                <Badge
                  className={cn(
                    "text-xs px-2 py-1 font-medium flex-shrink-0",
                    truck.isOpen
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-gray-100 text-gray-700 border-gray-200",
                  )}
                >
                  {truck.isOpen ? "Open" : "Closed"}
                </Badge>
              </div>

              {/* Special Today Banner */}
              {truck.specialToday && truck.isOpen && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                  <p className="text-xs font-medium text-yellow-800 flex items-center gap-1">
                    <span>🔥</span>
                    Today's Special: {truck.specialToday}
                  </p>
                </div>
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-gray-600">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{truck.parkingSpot}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">
                    {truck.openTime} - {truck.closeTime}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Users className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Queue: {truck.queueLength} people</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                  <span>{truck.rating} rating</span>
                </div>
              </div>

              {/* Distance */}
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">📍 {truck.distance} from main building</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

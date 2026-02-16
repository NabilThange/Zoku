"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface DaySchedule {
  day: string
  dayShort: string
  date: string
  trucks: {
    id: number
    name: string
    cuisineType: string
    logo: string
  }[]
  isToday: boolean
}

interface WeeklyScheduleProps {
  schedule: DaySchedule[]
  onTruckClick?: (truckId: number) => void
}

export function WeeklySchedule({ schedule, onTruckClick }: WeeklyScheduleProps) {
  return (
    <Card className="shadow-md border-0" style={{ backgroundColor: "white", borderRadius: "16px" }}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-bold" style={{ color: "#2D3748" }}>
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "#FF6B35" }} />
          This Week's Trucks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {schedule.map((day) => (
          <div
            key={day.day}
            className={cn(
              "p-4 rounded-xl border-2 transition-all duration-200",
              day.isToday
                ? "bg-orange-50 border-orange-500 shadow-md"
                : "bg-gray-50 border-gray-200 hover:border-gray-300",
            )}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-base text-gray-900">{day.day}</h4>
                  {day.isToday && (
                    <Badge className="bg-orange-500 text-white text-xs px-2 py-0.5 font-medium border-0">Today</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{day.date}</p>
              </div>
            </div>

            {day.trucks.length > 0 ? (
              <div className="space-y-2">
                {day.trucks.map((truck) => (
                  <div
                    key={truck.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-white border border-gray-200 hover:border-orange-300 transition-all cursor-pointer"
                    onClick={() => onTruckClick?.(truck.id)}
                  >
                    <div className="w-8 h-8 rounded-md flex items-center justify-center text-lg bg-orange-50 border border-orange-200 flex-shrink-0">
                      {truck.logo || "🚚"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">{truck.name}</p>
                      <p className="text-xs text-gray-600 truncate">{truck.cuisineType}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No trucks scheduled</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

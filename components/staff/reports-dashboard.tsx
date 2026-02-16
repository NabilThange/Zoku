"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Clock, Users } from "lucide-react"

interface ReportData {
  todayStats: {
    totalOrders: number
    totalRevenue: number
    averageOrderValue: number
    completedOrders: number
    pendingOrders: number
    averageWaitTime: number
  }
  popularItems: Array<{
    name: string
    orders: number
    revenue: number
    category: string
  }>
  hourlyData: Array<{
    hour: string
    orders: number
    revenue: number
  }>
  weeklyComparison: {
    ordersChange: number
    revenueChange: number
  }
}

interface ReportsDashboardProps {
  data: ReportData
}

export function ReportsDashboard({ data }: ReportsDashboardProps) {
  const { todayStats, popularItems, hourlyData, weeklyComparison } = data

  const peakHour = hourlyData.reduce((max, current) => (current.orders > max.orders ? current : max))

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">Reports Dashboard</h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">Today's performance and analytics overview</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-slate-200 hover:shadow-md transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-slate-600 mb-2">Orders Today</p>
                <p className="text-xl sm:text-3xl font-bold text-slate-900 mb-3">{todayStats.totalOrders}</p>
                <div className="flex items-center gap-2">
                  {weeklyComparison.ordersChange >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 flex-shrink-0" />
                  )}
                  <span className={`text-xs font-medium ${
                    weeklyComparison.ordersChange >= 0 ? "text-emerald-600" : "text-red-500"
                  }`}>
                    {Math.abs(weeklyComparison.ordersChange)}% vs last week
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 hover:shadow-md transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-slate-600 mb-2">Revenue Today</p>
                <p className="text-xl sm:text-3xl font-bold text-slate-900 mb-3">₹{todayStats.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center gap-2">
                  {weeklyComparison.revenueChange >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 flex-shrink-0" />
                  )}
                  <span className={`text-xs font-medium ${
                    weeklyComparison.revenueChange >= 0 ? "text-emerald-600" : "text-red-500"
                  }`}>
                    {Math.abs(weeklyComparison.revenueChange)}% vs last week
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 hover:shadow-md transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-slate-600 mb-2">Avg Order Value</p>
                <p className="text-xl sm:text-3xl font-bold text-slate-900 mb-3">₹{todayStats.averageOrderValue}</p>
                <p className="text-xs text-slate-500">{todayStats.completedOrders} completed orders</p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 hover:shadow-md transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-slate-600 mb-2">Avg Wait Time</p>
                <p className="text-xl sm:text-3xl font-bold text-slate-900 mb-3">{todayStats.averageWaitTime}m</p>
                <p className="text-xs text-slate-500">{todayStats.pendingOrders} pending orders</p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-orange-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Cards - Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Overview */}
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl font-semibold text-slate-900">Order Status Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700">Completed Orders</span>
                <span className="font-bold text-slate-900">{todayStats.completedOrders}</span>
              </div>
              <div className="space-y-2">
                <Progress 
                  value={(todayStats.completedOrders / todayStats.totalOrders) * 100} 
                  className="h-3"
                />
                <p className="text-xs text-slate-500 text-right">
                  {Math.round((todayStats.completedOrders / todayStats.totalOrders) * 100)}% completion rate
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700">Pending Orders</span>
                <span className="font-bold text-slate-900">{todayStats.pendingOrders}</span>
              </div>
              <div className="space-y-2">
                <Progress 
                  value={(todayStats.pendingOrders / todayStats.totalOrders) * 100} 
                  className="h-3"
                />
                <p className="text-xs text-slate-500 text-right">
                  {Math.round((todayStats.pendingOrders / todayStats.totalOrders) * 100)}% pending
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Popular Items */}
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl font-semibold text-slate-900">Popular Items Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularItems.slice(0, 5).map((item, index) => (
                <div key={item.name} className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-blue-700 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-slate-900 truncate">{item.name}</p>
                      <Badge 
                        variant="outline" 
                        className="text-xs mt-1 bg-slate-50 text-slate-600 border-slate-300"
                      >
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-sm text-slate-900">{item.orders} orders</p>
                    <p className="text-xs text-slate-500">₹{item.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Peak Hours Analysis - Full Width */}
      <Card className="border-slate-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl font-semibold text-slate-900">Peak Hours Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4 sm:p-6 bg-blue-50 rounded-lg border border-blue-200">
            <div>
              <p className="font-semibold text-slate-900 text-base sm:text-lg">Peak Hour</p>
              <p className="text-sm text-slate-600 mt-1">{peakHour.hour}</p>
            </div>
            <div className="flex flex-row sm:flex-col sm:text-right gap-4 sm:gap-1">
              <div>
                <p className="font-bold text-blue-700 text-lg sm:text-xl">{peakHour.orders} orders</p>
                <p className="text-sm text-slate-600">₹{peakHour.revenue.toLocaleString()} revenue</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2">
              Hourly Breakdown
            </h4>
            <div className="space-y-3">
              {hourlyData.slice(0, 6).map((hour) => (
                <div key={hour.hour} className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-slate-700 w-16 flex-shrink-0">{hour.hour}</span>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-1 max-w-32 sm:max-w-40">
                      <Progress 
                        value={(hour.orders / peakHour.orders) * 100} 
                        className="h-2"
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-900 w-12 text-right flex-shrink-0">
                      {hour.orders}
                    </span>
                    <span className="text-xs text-slate-500 w-16 text-right flex-shrink-0">
                      ₹{hour.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

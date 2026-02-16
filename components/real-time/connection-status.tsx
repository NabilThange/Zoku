"use client"

import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Loader2 } from "lucide-react"

interface ConnectionStatusProps {
  status: "connecting" | "connected" | "disconnected"
  className?: string
}

export function ConnectionStatus({ status, className = "" }: ConnectionStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "connecting":
        return {
          icon: Loader2,
          label: "Connecting...",
          variant: "secondary" as const,
          iconClass: "animate-spin",
        }
      case "connected":
        return {
          icon: Wifi,
          label: "Live",
          variant: "default" as const,
          iconClass: "",
        }
      case "disconnected":
        return {
          icon: WifiOff,
          label: "Offline",
          variant: "destructive" as const,
          iconClass: "",
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={`flex items-center gap-1 ${className}`}>
      <Icon className={`w-3 h-3 ${config.iconClass}`} />
      {config.label}
    </Badge>
  )
}

'use client'

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SettingsLayoutProps {
  title: string
  description: string
  children: React.ReactNode
  primaryAction?: {
    label: string
    onClick: () => void
    loading?: boolean
    loadingLabel?: string
    disabled?: boolean
  }
  secondaryAction?: {
    label: string
    onClick: () => void
    loading?: boolean
    loadingLabel?: string
    disabled?: boolean
    variant?: "outline" | "secondary" | "ghost"
  }
  showBackButton?: boolean
  backUrl?: string
}

export function SettingsLayout({
  title,
  description,
  children,
  primaryAction,
  secondaryAction,
  showBackButton = true,
  backUrl = "/dashboard/settings"
}: SettingsLayoutProps) {
  return (
    <div className="w-full max-w-full space-y-4 md:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Link href={backUrl} className="text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            )}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">{title}</h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            {description}
          </p>
        </div>
        
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {secondaryAction && (
              <Button
                onClick={secondaryAction.onClick}
                disabled={secondaryAction.disabled || secondaryAction.loading}
                variant={secondaryAction.variant || "outline"}
                className="w-full sm:w-auto"
              >
                {secondaryAction.loading ? (
                  secondaryAction.loadingLabel || "Loading..."
                ) : (
                  secondaryAction.label
                )}
              </Button>
            )}
            {primaryAction && (
              <Button 
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled || primaryAction.loading}
                className="w-full sm:w-auto"
              >
                {primaryAction.loading ? (
                  primaryAction.loadingLabel || "Loading..."
                ) : (
                  primaryAction.label
                )}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="w-full max-w-full">
        {children}
      </div>
    </div>
  )
} 
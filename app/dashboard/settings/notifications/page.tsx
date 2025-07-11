import { Suspense } from 'react'
import { OptimizedNotificationSettings } from '@/components/dashboard/optimized-notification-settings'
import { Bell } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function NotificationSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Bell className="h-6 w-6 text-slate-700" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notification Settings</h1>
          <p className="text-muted-foreground">
            Configure your notification preferences with smart presets and customizable options.
          </p>
        </div>
      </div>

      {/* Optimized Settings Component */}
      <Suspense fallback={
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      }>
        <OptimizedNotificationSettings />
      </Suspense>
    </div>
  )
} 
import { Suspense } from 'react'
import { OptimizedNotificationSettings } from '@/components/dashboard/optimized-notification-settings'
import { SettingsLayout } from '@/components/dashboard/settings-layout'

export const dynamic = 'force-dynamic'

export default function NotificationSettingsPage() {
  return (
    <SettingsLayout
      title="Notification Settings"
      description="Configure your notification preferences with smart presets and customizable options"
    >
      {/* Optimized Settings Component */}
      <Suspense fallback={
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      }>
        <OptimizedNotificationSettings />
      </Suspense>
    </SettingsLayout>
  )
} 
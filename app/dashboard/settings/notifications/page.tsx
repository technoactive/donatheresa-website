import { Suspense } from 'react'
import { NotificationSettingsForm } from '@/components/dashboard/notification-settings-form'
import { NotificationDemo } from '@/components/notifications/notification-demo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Bell, Settings } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function NotificationSettingsPage() {
  return (
    <div className="container mx-auto py-6 space-y-8 max-w-6xl">
      <div className="flex items-center gap-3">
        <Bell className="h-6 w-6 text-slate-700" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notification Settings</h1>
          <p className="text-muted-foreground">
            Configure how you receive alerts for bookings, cancellations, and system events.
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        {/* Settings Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Customize when and how you receive notifications from the booking system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<NotificationSettingsSkeleton />}>
                <NotificationSettingsForm />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Demo Component */}
        <div className="space-y-6">
          <NotificationDemo />
        </div>
      </div>
    </div>
  )
}

function NotificationSettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
      <Skeleton className="h-10 w-24" />
    </div>
  )
} 
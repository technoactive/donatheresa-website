import { Suspense } from 'react'
import { NotificationSettingsForm } from '@/components/dashboard/notification-settings-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

export default function NotificationSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notification Settings</h1>
        <p className="text-muted-foreground">
          Configure how you receive and interact with booking notifications
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Customize your notification experience to match your workflow and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<NotificationSettingsSkeleton />}>
              <NotificationSettingsForm />
            </Suspense>
          </CardContent>
        </Card>
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
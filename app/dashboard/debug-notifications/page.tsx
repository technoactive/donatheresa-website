import { NotificationDebugger } from '@/components/notifications/notification-debugger'

export default function DebugNotificationsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🔍</span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notification System Debugger</h1>
          <p className="text-muted-foreground">
            Diagnose and test notification system functionality in real-time.
          </p>
        </div>
      </div>

      <NotificationDebugger />
    </div>
  )
} 
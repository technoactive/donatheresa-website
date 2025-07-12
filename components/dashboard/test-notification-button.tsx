'use client'

import { Button } from "@/components/ui/button"
import { notificationManager } from "@/lib/notifications"

export function TestNotificationButton() {
  const handleTestNotification = () => {
    console.log('🧪 Testing notification...');
    
    const wasAdded = notificationManager.addNotification({
      type: 'system_alert',
      title: '🧪 Test Notification',
      message: 'If you see this immediately in the bell icon, notifications are working! Time: ' + new Date().toLocaleTimeString(),
      priority: 'high',
      dismissed: false
    });
    
    console.log('🧪 Test notification added:', wasAdded);
    
    if (wasAdded) {
      alert('✅ Notification created! Check the bell icon in the header.');
    } else {
      alert('❌ Notification was blocked. Check your notification settings.');
    }
  };

  return (
    <Button 
      onClick={handleTestNotification}
      className="bg-orange-600 hover:bg-orange-700 text-white"
    >
      🧪 Test Notification
    </Button>
  );
} 
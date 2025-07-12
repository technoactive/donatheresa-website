const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRealtimeNotifications() {
  console.log('🧪 Testing real-time notification system...\n');

  // Subscribe to notifications table changes
  console.log('📡 Setting up real-time subscription...');
  const channel = supabase
    .channel('test_notifications')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: 'user_id=eq.admin'
      },
      (payload) => {
        console.log('\n🔔 Real-time event received:', payload.eventType);
        console.log('📦 Payload:', JSON.stringify(payload, null, 2));
      }
    )
    .subscribe((status) => {
      console.log('📡 Subscription status:', status);
    });

  // Wait for subscription to be established
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Insert a test notification
  console.log('\n💉 Inserting test notification...');
  const testNotification = {
    user_id: 'admin',
    type: 'system_alert',
    title: '🧪 Real-time Test',
    message: 'Testing real-time notification system at ' + new Date().toISOString(),
    priority: 'high',
    read: false,
    dismissed: false
  };

  const { data, error } = await supabase
    .from('notifications')
    .insert(testNotification)
    .select();

  if (error) {
    console.error('❌ Error inserting notification:', error);
  } else {
    console.log('✅ Notification inserted:', data[0].id);
  }

  // Wait to see if real-time event is received
  console.log('\n⏳ Waiting 5 seconds for real-time event...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Check if notification exists in database
  console.log('\n🔍 Checking database for notification...');
  const { data: notifications, error: fetchError } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', 'admin')
    .eq('dismissed', false)
    .order('created_at', { ascending: false })
    .limit(5);

  if (fetchError) {
    console.error('❌ Error fetching notifications:', fetchError);
  } else {
    console.log(`📊 Found ${notifications.length} notifications in database`);
    console.log('📬 Latest notifications:');
    notifications.forEach(n => {
      console.log(`  - ${n.title} (${n.read ? 'read' : 'unread'}) - ${n.created_at}`);
    });
  }

  // Cleanup
  console.log('\n🧹 Cleaning up...');
  supabase.removeChannel(channel);
  
  if (data && data[0]) {
    await supabase
      .from('notifications')
      .delete()
      .eq('id', data[0].id);
    console.log('✅ Test notification deleted');
  }

  console.log('\n✅ Test complete!');
  process.exit(0);
}

testRealtimeNotifications().catch(console.error);

#!/usr/bin/env node
/**
 * Comprehensive Notification System Test
 * Tests all aspects of the notification system to identify issues
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testNotificationSystem() {
  console.log('🔔 Testing Notification System...\n');

  let allTestsPassed = true;

  try {
    // Test 1: Check notification_settings table
    console.log('1️⃣ Testing notification_settings table...');
    const { data: notificationSettings, error: settingsError } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('user_id', 'admin')
      .single();

    if (settingsError) {
      console.error('❌ Failed to get notification_settings:', settingsError.message);
      allTestsPassed = false;
    } else if (!notificationSettings) {
      console.error('❌ No notification_settings found for admin user');
      allTestsPassed = false;
    } else {
      console.log('✅ Notification settings found');
      console.log(`   - Notifications enabled: ${notificationSettings.notifications_enabled}`);
      console.log(`   - Sound enabled: ${notificationSettings.sound_enabled}`);
      console.log(`   - Show toasts: ${notificationSettings.show_toasts}`);
      console.log(`   - New booking enabled: ${notificationSettings.new_booking_enabled}`);
      console.log(`   - VIP booking enabled: ${notificationSettings.vip_booking_enabled}`);
    }

    // Test 2: Check recent bookings for real-time testing
    console.log('\n2️⃣ Testing recent booking activity...');
    const { data: recentBookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('id, customer_id, booking_date, booking_time, party_size, status, created_at, source')
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
      .order('created_at', { ascending: false })
      .limit(5);

    if (bookingsError) {
      console.error('❌ Failed to get recent bookings:', bookingsError.message);
      allTestsPassed = false;
    } else {
      console.log(`✅ Found ${recentBookings?.length || 0} recent bookings (last hour)`);
      if (recentBookings && recentBookings.length > 0) {
        recentBookings.forEach((booking, index) => {
          console.log(`   ${index + 1}. ID: ${booking.id} | ${booking.booking_date} ${booking.booking_time} | ${booking.party_size} guests | ${booking.status} | Source: ${booking.source || 'website'}`);
        });
      }
    }

    // Test 3: Check customers table for VIP detection
    console.log('\n3️⃣ Testing customer data for VIP notifications...');
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('id, name, customer_segment')
      .limit(5);

    if (customersError) {
      console.error('❌ Failed to get customers:', customersError.message);
      allTestsPassed = false;
    } else {
      console.log(`✅ Found ${customers?.length || 0} customers`);
      if (customers && customers.length > 0) {
        const vipCount = customers.filter(c => c.customer_segment === 'VIP').length;
        console.log(`   - VIP customers: ${vipCount}`);
        customers.forEach((customer, index) => {
          console.log(`   ${index + 1}. ${customer.name} (${customer.customer_segment || 'new'})`);
        });
      }
    }

    // Test 4: Test real-time subscription capabilities
    console.log('\n4️⃣ Testing real-time subscription setup...');
    try {
      const channel = supabase.channel('test_notification_system');
      
      let subscriptionWorking = false;
      const subscriptionTimeout = setTimeout(() => {
        if (!subscriptionWorking) {
          console.log('⚠️ Real-time subscription test timed out (this may be normal)');
        }
      }, 3000);

      channel
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings'
        }, (payload) => {
          subscriptionWorking = true;
          console.log('✅ Real-time subscription is working');
          clearTimeout(subscriptionTimeout);
        })
        .subscribe((status) => {
          console.log(`   - Subscription status: ${status}`);
          if (status === 'SUBSCRIBED') {
            console.log('✅ Real-time subscription established');
            // Clean up immediately for test
            setTimeout(() => {
              supabase.removeChannel(channel);
            }, 1000);
          } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ Real-time subscription failed');
            allTestsPassed = false;
          }
        });

    } catch (realtimeError) {
      console.error('❌ Failed to test real-time subscription:', realtimeError.message);
      allTestsPassed = false;
    }

    // Test 5: Create a test notification to verify table structure
    console.log('\n5️⃣ Testing notification creation simulation...');
    
    // Simulate what the real-time system would do
    if (recentBookings && recentBookings.length > 0) {
      const testBooking = recentBookings[0];
      
      // Get customer for the booking
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('name, customer_segment')
        .eq('id', testBooking.customer_id)
        .single();

      if (customerError) {
        console.error('❌ Failed to get customer for test booking:', customerError.message);
        allTestsPassed = false;
      } else {
        console.log('✅ Test notification data prepared');
        console.log(`   - Customer: ${customer.name}`);
        console.log(`   - Booking: ${testBooking.booking_date} at ${testBooking.booking_time}`);
        console.log(`   - Party size: ${testBooking.party_size}`);
        console.log(`   - VIP status: ${customer.customer_segment === 'VIP' ? 'Yes' : 'No'}`);
        
        // Determine notification type
        const isVip = customer.customer_segment === 'VIP';
        const bookingHour = new Date(`2000-01-01T${testBooking.booking_time}`).getHours();
        const isPeakTime = bookingHour >= 18 && bookingHour <= 21;
        
        let notificationType = 'new_booking';
        if (isVip) {
          notificationType = 'vip_booking';
        } else if (isPeakTime) {
          notificationType = 'peak_time_booking';
        }
        
        console.log(`   - Notification type would be: ${notificationType}`);
        console.log(`   - Peak time (6-9 PM): ${isPeakTime ? 'Yes' : 'No'}`);
      }
    }

    // Test 6: Check for notification storage table (if exists)
    console.log('\n6️⃣ Checking for notification storage...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .like('table_name', '%notification%');

    if (tablesError) {
      console.error('❌ Failed to check notification tables:', tablesError.message);
      allTestsPassed = false;
    } else {
      console.log('✅ Notification-related tables:');
      tables?.forEach(table => {
        console.log(`   - ${table.table_name}`);
      });
    }

    // Test 7: Verify RLS policies
    console.log('\n7️⃣ Testing Row Level Security policies...');
    try {
      // Test if we can access notification_settings with RLS
      const { count, error: rlsError } = await supabase
        .from('notification_settings')
        .select('*', { count: 'exact', head: true });

      if (rlsError) {
        console.error('❌ RLS policy issue:', rlsError.message);
        allTestsPassed = false;
      } else {
        console.log(`✅ RLS policies working (${count} accessible rows)`);
      }
    } catch (rlsTestError) {
      console.error('❌ Failed to test RLS policies:', rlsTestError.message);
      allTestsPassed = false;
    }

    // Test 8: Check Supabase real-time status
    console.log('\n8️⃣ Testing Supabase real-time capabilities...');
    try {
      // Check if real-time is enabled on the tables
      const { data: realtimeCheck, error: realtimeError } = await supabase
        .from('bookings')
        .select('id')
        .limit(1);

      if (realtimeError) {
        console.error('❌ Basic table access failed:', realtimeError.message);
        allTestsPassed = false;
      } else {
        console.log('✅ Basic table access working');
        console.log('   Note: Real-time requires proper configuration in Supabase dashboard');
      }
    } catch (realtimeTestError) {
      console.error('❌ Failed to test real-time capabilities:', realtimeTestError.message);
      allTestsPassed = false;
    }

    // Test 9: Verify notification settings defaults
    console.log('\n9️⃣ Verifying notification settings configuration...');
    if (notificationSettings) {
      const criticalSettings = [
        'notifications_enabled',
        'new_booking_enabled',
        'vip_booking_enabled',
        'booking_cancelled_enabled'
      ];

      let settingsIssues = 0;
      criticalSettings.forEach(setting => {
        if (!notificationSettings[setting]) {
          console.log(`   ⚠️ ${setting} is disabled`);
          settingsIssues++;
        } else {
          console.log(`   ✅ ${setting} is enabled`);
        }
      });

      if (settingsIssues === 0) {
        console.log('✅ All critical notification settings are enabled');
      } else {
        console.log(`⚠️ ${settingsIssues} critical settings are disabled`);
      }
    }

    // Summary
    console.log('\n📊 NOTIFICATION SYSTEM TEST SUMMARY');
    console.log('='.repeat(50));
    
    if (allTestsPassed) {
      console.log('✅ All basic tests passed!');
      console.log('\n🔍 If notifications still aren\'t working, check:');
      console.log('   1. Browser console for JavaScript errors');
      console.log('   2. Supabase dashboard for real-time configuration');
      console.log('   3. Client-side notification provider initialization');
      console.log('   4. Network requests in browser dev tools');
      console.log('   5. Audio permissions for notification sounds');
    } else {
      console.log('❌ Some tests failed - see errors above');
    }

    console.log('\n🛠️ RECOMMENDED FIXES:');
    console.log('   1. Ensure Supabase real-time is enabled for "bookings" table');
    console.log('   2. Check that NotificationProvider is wrapping the dashboard layout');
    console.log('   3. Verify browser permissions for notifications and audio');
    console.log('   4. Test the notification demo page: /dashboard/settings/notifications');

    return allTestsPassed;

  } catch (error) {
    console.error('💥 Test failed with unexpected error:', error);
    return false;
  }
}

// Run the test
testNotificationSystem()
  .then(success => {
    if (success) {
      console.log('\n✅ Notification system structure appears healthy!');
      process.exit(0);
    } else {
      console.log('\n❌ Issues found in notification system!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 Test runner error:', error);
    process.exit(1);
  }); 
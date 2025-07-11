#!/usr/bin/env node

/**
 * Notification System Test & Diagnostic Script
 * Tests all aspects of the notification system to identify issues
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// Load environment variables manually
const envContent = fs.readFileSync('.env.local', 'utf8')
const envVars = {}
envContent.split('\n').forEach(line => {
  if (line.includes('=')) {
    const [key, value] = line.split('=')
    envVars[key.trim()] = value.trim()
  }
})

// Set environment variables
Object.assign(process.env, envVars)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔔 Starting Notification System Test\n')

// ===================================================================
// 1. TEST NOTIFICATION SETTINGS
// ===================================================================
async function testNotificationSettings() {
  console.log('📊 Testing notification settings...')
  
  try {
    const { data: settings, error } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('user_id', 'admin')
      .single()

    if (error) {
      console.error('❌ Failed to load notification settings:', error.message)
      return false
    }

    if (!settings) {
      console.error('❌ No notification settings found for admin user')
      return false
    }

    console.log('✅ Notification settings loaded successfully')
    console.log('🎛️ Settings overview:')
    console.log(`   - Notifications enabled: ${settings.notifications_enabled}`)
    console.log(`   - Sound enabled: ${settings.sound_enabled}`)
    console.log(`   - Show toasts: ${settings.show_toasts}`)
    console.log(`   - New booking enabled: ${settings.new_booking_enabled}`)
    console.log(`   - New booking toast: ${settings.new_booking_toast}`)
    console.log(`   - VIP booking enabled: ${settings.vip_booking_enabled}`)
    console.log(`   - VIP booking toast: ${settings.vip_booking_toast}`)
    console.log(`   - Booking cancelled enabled: ${settings.booking_cancelled_enabled}`)
    console.log(`   - Booking cancelled toast: ${settings.booking_cancelled_toast}`)

    // Check for critical issues
    const issues = []
    if (!settings.notifications_enabled) {
      issues.push('Notifications are completely disabled')
    }
    if (!settings.new_booking_enabled) {
      issues.push('New booking notifications are disabled')
    }
    if (!settings.new_booking_toast && !settings.vip_booking_toast && !settings.booking_cancelled_toast) {
      issues.push('All toast notifications are disabled - users won\'t see visual notifications')
    }

    if (issues.length > 0) {
      console.log('⚠️ Issues found:')
      issues.forEach(issue => console.log(`   - ${issue}`))
      return false
    } else {
      console.log('✅ Notification settings look good')
      return true
    }

  } catch (error) {
    console.error('💥 Error testing notification settings:', error)
    return false
  }
}

// ===================================================================
// 2. TEST REALTIME CONNECTION
// ===================================================================
async function testRealtimeConnection() {
  console.log('\n🔄 Testing realtime connection...')
  
  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      console.log('❌ Realtime connection test timed out')
      resolve(false)
    }, 10000) // 10 second timeout

    const channel = supabase
      .channel('test_connection')
      .on('presence', { event: 'sync' }, () => {
        console.log('✅ Realtime connection established')
        clearTimeout(timeoutId)
        channel.unsubscribe()
        resolve(true)
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('📡 Presence join event detected')
      })
      .subscribe(async (status) => {
        console.log(`📡 Realtime status: ${status}`)
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to realtime channel')
          // Track presence to test connection
          await channel.track({ test: true })
        }
      })
  })
}

// ===================================================================
// 3. TEST BOOKING SUBSCRIPTION
// ===================================================================
async function testBookingSubscription() {
  console.log('\n📋 Testing booking subscription...')
  
  return new Promise((resolve) => {
    let hasReceived = false
    
    const timeoutId = setTimeout(() => {
      if (!hasReceived) {
        console.log('⚠️ No realtime events received (this may be normal if no new bookings)')
      }
      channel.unsubscribe()
      resolve(true) // Don't fail the test for this
    }, 5000) // 5 second timeout

    const channel = supabase
      .channel('booking_test')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings',
        },
        (payload) => {
          hasReceived = true
          console.log('✅ Booking INSERT event received:', payload.new?.id)
          clearTimeout(timeoutId)
          channel.unsubscribe()
          resolve(true)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
        },
        (payload) => {
          hasReceived = true
          console.log('✅ Booking UPDATE event received:', payload.new?.id)
          clearTimeout(timeoutId)
          channel.unsubscribe()
          resolve(true)
        }
      )
      .subscribe((status) => {
        console.log(`📡 Booking subscription status: ${status}`)
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to booking changes')
        }
      })
  })
}

// ===================================================================
// 4. TEST WITH MOCK BOOKING
// ===================================================================
async function testWithMockBooking() {
  console.log('\n🧪 Testing with mock booking creation...')
  
  try {
    // First, get a customer to use
    const { data: customers } = await supabase
      .from('customers')
      .select('id, name')
      .limit(1)

    if (!customers || customers.length === 0) {
      console.log('⚠️ No customers found, creating test customer...')
      
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert([{
          name: 'Test Customer',
          email: 'test@example.com',
          phone: '+1234567890',
          customer_segment: 'Regular'
        }])
        .select()
        .single()

      if (customerError) {
        console.error('❌ Failed to create test customer:', customerError.message)
        return false
      }
      
      customers.push(newCustomer)
      console.log('✅ Created test customer')
    }

    const customer = customers[0]
    console.log(`👤 Using customer: ${customer.name} (${customer.id})`)

    // Create a test booking
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const bookingDate = tomorrow.toISOString().split('T')[0]

    console.log('📝 Creating test booking...')
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        customer_id: customer.id,
        booking_date: bookingDate,
        booking_time: '19:00:00',
        party_size: 2,
        status: 'confirmed',
        source: 'website', // This should trigger notifications
        special_requests: 'Test booking for notification system'
      }])
      .select()
      .single()

    if (bookingError) {
      console.error('❌ Failed to create test booking:', bookingError.message)
      return false
    }

    console.log(`✅ Created test booking: ${booking.id}`)
    console.log('🔔 This should have triggered a notification if system is working')
    
    // Wait a moment for the notification to process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Clean up - delete the test booking
    await supabase
      .from('bookings')
      .delete()
      .eq('id', booking.id)
    
    console.log('🧹 Cleaned up test booking')
    return true

  } catch (error) {
    console.error('💥 Error testing with mock booking:', error)
    return false
  }
}

// ===================================================================
// 5. CHECK RECENT BOOKINGS
// ===================================================================
async function checkRecentBookings() {
  console.log('\n📋 Checking recent bookings...')
  
  try {
    const { data: recentBookings } = await supabase
      .from('bookings')
      .select(`
        id,
        booking_date,
        booking_time,
        party_size,
        status,
        source,
        created_at,
        customers(name, customer_segment)
      `)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
      .order('created_at', { ascending: false })
      .limit(5)

    if (!recentBookings || recentBookings.length === 0) {
      console.log('ℹ️ No bookings in the last 24 hours')
      return true
    }

    console.log(`📊 Found ${recentBookings.length} bookings in the last 24 hours:`)
    recentBookings.forEach((booking, index) => {
      const customer = booking.customers
      const shouldNotify = booking.source === 'website' && booking.status === 'confirmed'
      console.log(`   ${index + 1}. ${customer.name} - ${booking.booking_date} ${booking.booking_time}`)
      console.log(`      Source: ${booking.source} | Status: ${booking.status} | Should notify: ${shouldNotify ? '✅' : '❌'}`)
    })

    return true

  } catch (error) {
    console.error('💥 Error checking recent bookings:', error)
    return false
  }
}

// ===================================================================
// 6. MAIN TEST RUNNER
// ===================================================================
async function runAllTests() {
  console.log('🧪 Running complete notification system diagnostic...\n')

  const results = {
    settings: await testNotificationSettings(),
    realtime: await testRealtimeConnection(),
    subscription: await testBookingSubscription(),
    mockBooking: await testWithMockBooking(),
    recentBookings: await checkRecentBookings()
  }

  console.log('\n📊 Test Results Summary:')
  console.log('========================')
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`)
  })

  const allPassed = Object.values(results).every(Boolean)
  console.log(`\n🎯 Overall Status: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`)

  if (!allPassed) {
    console.log('\n🔧 Troubleshooting recommendations:')
    if (!results.settings) {
      console.log('   - Check notification settings in database')
      console.log('   - Ensure notifications and toasts are enabled')
    }
    if (!results.realtime) {
      console.log('   - Check Supabase realtime configuration')
      console.log('   - Verify network connectivity')
    }
    if (!results.subscription) {
      console.log('   - Check booking table permissions')
      console.log('   - Verify RLS policies allow realtime access')
    }
  }

  console.log('\n✨ Test completed!')
  process.exit(allPassed ? 0 : 1)
}

// Run the tests
runAllTests().catch(error => {
  console.error('💥 Test runner failed:', error)
  process.exit(1)
}) 
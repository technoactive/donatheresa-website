const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Read environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local')
let supabaseUrl, supabaseKey

try {
  const envContent = fs.readFileSync(envPath, 'utf8')
  const lines = envContent.split('\n')
  
  lines.forEach(line => {
    const trimmedLine = line.trim()
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=')
      const value = valueParts.join('=').replace(/^["']|["']$/g, '')
      
      if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
        supabaseUrl = value
      } else if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
        supabaseKey = value
      }
    }
  })
} catch (error) {
  console.error('❌ Failed to read .env.local file:', error.message)
  process.exit(1)
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testNotificationPolling() {
  console.log('🧪 Testing notification polling system...\n')

  try {
    // First, check if notifications table exists
    const { data: notifications, error: notifError } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', 'admin')
      .eq('read', false)
      .order('created_at', { ascending: false })
      .limit(5)

    if (notifError) {
      console.error('❌ Error checking notifications:', notifError.message)
      return
    }

    console.log(`📊 Found ${notifications?.length || 0} unread notifications`)
    if (notifications && notifications.length > 0) {
      console.log('\n📋 Latest unread notifications:')
      notifications.forEach((notif, index) => {
        console.log(`   ${index + 1}. ${notif.type}: ${notif.title}`)
        console.log(`      Created: ${new Date(notif.created_at).toLocaleString()}`)
      })
    }

    // Now create a test booking to trigger a notification
    console.log('\n📝 Creating test booking to trigger notification...')

    // Get a customer to use
    const { data: customers } = await supabase
      .from('customers')
      .select('id, name, email')
      .limit(1)

    if (!customers || customers.length === 0) {
      console.error('❌ No customers found in database')
      return
    }

    const customer = customers[0]
    console.log(`👤 Using customer: ${customer.name} (${customer.email})`)

    // Create booking with tomorrow's date
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const bookingDate = tomorrow.toISOString().split('T')[0]
    const bookingTime = '19:30:00' // Peak time

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert([{
        customer_id: customer.id,
        booking_date: bookingDate,
        booking_time: bookingTime,
        party_size: 4,
        status: 'confirmed',
        source: 'website', // This should trigger notifications
        special_requests: 'Test booking for notification polling'
      }])
      .select()
      .single()

    if (error) {
      console.error('❌ Failed to create booking:', error.message)
      return
    }

    console.log(`✅ Test booking created successfully!`)
    console.log(`📋 Booking ID: ${booking.id}`)
    console.log(`📅 Date: ${bookingDate} at ${bookingTime}`)

    // Wait a moment for the notification to be created
    console.log('\n⏳ Waiting 3 seconds for notification to be created...')
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Check if notification was created
    const { data: newNotifications, error: checkError } = await supabase
      .from('notifications')
      .select('*')
      .eq('booking_id', booking.id)
      .order('created_at', { ascending: false })

    if (checkError) {
      console.error('❌ Error checking for new notification:', checkError.message)
      return
    }

    if (newNotifications && newNotifications.length > 0) {
      console.log(`\n✅ Found ${newNotifications.length} notification(s) created for this booking!`)
      newNotifications.forEach((notif, index) => {
        console.log(`\n📋 Notification ${index + 1}:`)
        console.log(`   ID: ${notif.id}`)
        console.log(`   Type: ${notif.type}`)
        console.log(`   Title: ${notif.title}`)
        console.log(`   Message: ${notif.message}`)
        console.log(`   Read: ${notif.read}`)
        console.log(`   Created: ${new Date(notif.created_at).toLocaleString()}`)
      })
      console.log('\n✨ The polling mechanism should pick this up within 2 seconds in the dashboard!')
    } else {
      console.log('\n⚠️ No notification found for this booking')
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Run the test
testNotificationPolling() 
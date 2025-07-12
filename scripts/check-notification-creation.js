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

async function checkNotificationCreation() {
  console.log('🔍 Checking notification creation for recent bookings...\n')

  try {
    // Get recent bookings from website
    const { data: recentBookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*, customers(*)')
      .eq('source', 'website')
      .order('created_at', { ascending: false })
      .limit(10)

    if (bookingsError) {
      console.error('❌ Error fetching bookings:', bookingsError.message)
      return
    }

    console.log(`📊 Found ${recentBookings?.length || 0} recent website bookings\n`)

    if (recentBookings && recentBookings.length > 0) {
      for (const booking of recentBookings) {
        console.log(`📋 Booking ${booking.id}:`)
        console.log(`   Customer: ${booking.customers.name}`)
        console.log(`   Date: ${booking.booking_date} at ${booking.booking_time}`)
        console.log(`   Party size: ${booking.party_size}`)
        console.log(`   Created: ${new Date(booking.created_at).toLocaleString()}`)
        
        // Check for notifications for this booking
        const { data: notifications, error: notifError } = await supabase
          .from('notifications')
          .select('*')
          .eq('booking_id', booking.id)
          
        if (notifError) {
          console.log(`   ❌ Error checking notifications: ${notifError.message}`)
        } else if (notifications && notifications.length > 0) {
          console.log(`   ✅ Found ${notifications.length} notification(s):`)
          notifications.forEach(notif => {
            console.log(`      - ${notif.type}: ${notif.title} (Read: ${notif.read})`)
          })
        } else {
          console.log(`   ⚠️ No notifications found for this booking`)
        }
        console.log('')
      }
    }

    // Check all recent notifications
    console.log('\n📬 All recent notifications:')
    const { data: allNotifications, error: allNotifError } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (allNotifError) {
      console.error('❌ Error fetching notifications:', allNotifError.message)
    } else if (allNotifications && allNotifications.length > 0) {
      allNotifications.forEach((notif, index) => {
        console.log(`${index + 1}. ${notif.type}: ${notif.title}`)
        console.log(`   Created: ${new Date(notif.created_at).toLocaleString()}`)
        console.log(`   Booking ID: ${notif.booking_id || 'N/A'}`)
        console.log(`   Read: ${notif.read}`)
        console.log('')
      })
    } else {
      console.log('📭 No notifications found')
    }

  } catch (error) {
    console.error('❌ Check failed:', error.message)
  }
}

// Run the check
checkNotificationCreation() 
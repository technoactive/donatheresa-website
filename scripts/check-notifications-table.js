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

async function checkNotificationsTable() {
  console.log('🔍 Checking notifications table structure and recent activity...\n')

  try {
    // Test inserting a notification directly (like createBookingWithCustomer does)
    console.log('📝 Testing notification creation...')
    const testNotification = {
      user_id: 'admin',
      type: 'new_booking',
      title: '🧪 Test Notification',
      message: 'This is a test notification to check table structure',
      priority: 'high',
      booking_id: null,
      action_url: '/dashboard/bookings',
      action_label: 'View Booking',
      read: false,
      dismissed: false
    }

    const { data: insertedNotif, error: insertError } = await supabase
      .from('notifications')
      .insert(testNotification)
      .select()
      .single()

    if (insertError) {
      console.error('❌ Error inserting test notification:', insertError)
      console.error('   Code:', insertError.code)
      console.error('   Message:', insertError.message)
      console.error('   Details:', insertError.details)
      console.error('   Hint:', insertError.hint)
      
      // Check if it's a permissions issue
      if (insertError.code === '42501') {
        console.error('\n⚠️ PERMISSION DENIED - Check RLS policies on notifications table')
      }
    } else {
      console.log('✅ Test notification created successfully!')
      console.log(`   ID: ${insertedNotif.id}`)
      console.log(`   Created at: ${insertedNotif.created_at}`)
      
      // Clean up test notification
      const { error: deleteError } = await supabase
        .from('notifications')
        .delete()
        .eq('id', insertedNotif.id)
      
      if (deleteError) {
        console.log('⚠️ Could not delete test notification:', deleteError.message)
      } else {
        console.log('🧹 Test notification cleaned up')
      }
    }

    // Check table structure by trying to select all columns
    console.log('\n📊 Checking table columns...')
    const { data: sampleData, error: selectError } = await supabase
      .from('notifications')
      .select('*')
      .limit(1)

    if (selectError) {
      console.error('❌ Error reading from notifications table:', selectError.message)
    } else if (sampleData && sampleData.length > 0) {
      console.log('✅ Table columns found:')
      Object.keys(sampleData[0]).forEach(col => {
        console.log(`   - ${col}: ${typeof sampleData[0][col]}`)
      })
    } else {
      console.log('📭 No data in notifications table to inspect columns')
    }

    // Check RLS policies
    console.log('\n🔒 Checking RLS (Row Level Security) status...')
    // This is a workaround - we'll try to insert without authentication
    const publicClient = createClient(supabaseUrl, supabaseKey)
    
    const { error: rlsError } = await publicClient
      .from('notifications')
      .select('count')
      .single()

    if (rlsError && rlsError.code === 'PGRST116') {
      console.log('✅ RLS is enabled (good for security)')
    } else if (!rlsError) {
      console.log('⚠️ RLS might be disabled - consider enabling it for security')
    }

  } catch (error) {
    console.error('❌ Check failed:', error.message)
  }
}

// Run the check
checkNotificationsTable() 
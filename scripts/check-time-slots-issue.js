#!/usr/bin/env node

/**
 * Diagnose Time Slots Issue
 * 
 * This script checks the database configuration and service periods
 * to diagnose why time slots aren't loading properly.
 */

const { createClient } = require('@supabase/supabase-js')

// Load environment variables from .env.local if it exists
const fs = require('fs')
if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8')
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...values] = line.split('=')
      if (key && values.length > 0) {
        process.env[key] = values.join('=')
      }
    }
  })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTimeSlots() {
  console.log('🔍 Diagnosing Time Slots Issue...\n')

  try {
    // 1. Check booking_config table
    console.log('📊 Checking booking_config table...')
    const { data: bookingConfig, error: configError } = await supabase
      .from('booking_config')
      .select('*')
      .eq('id', 1)
      .single()

    if (configError) {
      console.error('❌ Error fetching booking config:', configError)
    } else {
      console.log('✅ Booking config found')
      console.log('📅 Available times count:', bookingConfig.available_times?.length || 0)
      console.log('📅 Available times:', bookingConfig.available_times)
      console.log('🎯 Booking enabled:', bookingConfig.booking_enabled)
      console.log('')
    }

    // 2. Check service_periods table
    console.log('🕐 Checking service_periods table...')
    const { data: servicePeriods, error: periodsError } = await supabase
      .from('service_periods')
      .select('*')
      .order('sort_order')

    if (periodsError) {
      console.error('❌ Error fetching service periods:', periodsError)
    } else {
      console.log('✅ Service periods found:', servicePeriods.length)
      servicePeriods.forEach(period => {
        console.log(`  - ${period.name}: ${period.start_time} to ${period.end_time} (${period.interval_minutes}min) - ${period.enabled ? 'ENABLED' : 'DISABLED'}`)
      })
      console.log('')
    }

    // 3. Test generate_time_slots_from_periods function
    console.log('⚙️ Testing generate_time_slots_from_periods function...')
    const { data: generatedSlots, error: slotsError } = await supabase
      .rpc('generate_time_slots_from_periods')

    if (slotsError) {
      console.error('❌ Error generating time slots:', slotsError)
    } else {
      console.log('✅ Time slots generated successfully')
      console.log('🎯 Generated slots count:', generatedSlots?.length || 0)
      console.log('📅 Generated slots:', generatedSlots)
      console.log('')
    }

    // 4. Compare available_times with generated slots
    if (bookingConfig && generatedSlots) {
      console.log('🔄 Comparing database times with generated times...')
      const dbTimes = bookingConfig.available_times || []
      const genTimes = generatedSlots || []
      
      console.log('📊 Database times count:', dbTimes.length)
      console.log('📊 Generated times count:', genTimes.length)
      
      if (JSON.stringify(dbTimes.sort()) === JSON.stringify(genTimes.sort())) {
        console.log('✅ Times match - database is up to date')
      } else {
        console.log('⚠️  Times don\'t match - database needs updating')
        console.log('📅 Database times:', dbTimes)
        console.log('📅 Generated times:', genTimes)
      }
      console.log('')
    }

    // 5. Provide recommendations
    console.log('💡 Recommendations:')
    
    if (!servicePeriods || servicePeriods.length === 0) {
      console.log('❌ No service periods found! Run the database schema script to create default periods.')
    } else {
      const enabledPeriods = servicePeriods.filter(p => p.enabled)
      if (enabledPeriods.length === 0) {
        console.log('❌ No enabled service periods! Enable at least one period in Settings > Bookings.')
      } else {
        console.log('✅ Service periods are configured properly')
      }
    }

    if (generatedSlots && generatedSlots.length > 0) {
      if (bookingConfig?.available_times?.length !== generatedSlots.length) {
        console.log('⚠️  Database available_times needs updating. Run the service periods save action.')
      } else {
        console.log('✅ Time slots are synchronized properly')
      }
    } else {
      console.log('❌ No time slots generated! Check service periods configuration.')
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

checkTimeSlots() 
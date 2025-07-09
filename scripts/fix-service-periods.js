#!/usr/bin/env node

/**
 * Fix Service Periods Configuration
 * 
 * This script updates the service periods to have proper dinner service hours
 * and regenerates the time slots.
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

async function fixServicePeriods() {
  console.log('🔧 Fixing Service Periods Configuration...\n')

  try {
    // 1. Update Dinner Service to proper hours
    console.log('📝 Updating Dinner Service hours...')
    const { data: updateResult, error: updateError } = await supabase
      .from('service_periods')
      .update({
        start_time: '18:00:00',
        end_time: '22:00:00',
        last_order_time: '21:30:00',
        kitchen_closing_time: '22:00:00',
        updated_at: new Date().toISOString()
      })
      .eq('name', 'Dinner Service')
      .select()

    if (updateError) {
      console.error('❌ Error updating dinner service:', updateError)
      return
    }

    console.log('✅ Dinner Service updated successfully')
    console.log('📅 New hours: 18:00-22:00 (last order: 21:30)')
    console.log('')

    // 2. Regenerate time slots
    console.log('⚙️ Regenerating time slots...')
    const { data: newSlots, error: slotsError } = await supabase
      .rpc('generate_time_slots_from_periods')

    if (slotsError) {
      console.error('❌ Error generating time slots:', slotsError)
      return
    }

    console.log('✅ New time slots generated:', newSlots.length, 'slots')
    console.log('📅 Time slots:', newSlots)
    console.log('')

    // 3. Update booking_config with new time slots
    console.log('📊 Updating booking configuration...')
    const { data: configUpdate, error: configError } = await supabase
      .from('booking_config')
      .update({
        available_times: newSlots,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1)

    if (configError) {
      console.error('❌ Error updating booking config:', configError)
      return
    }

    console.log('✅ Booking configuration updated successfully')
    console.log('')

    // 4. Verify the changes
    console.log('🔍 Verifying changes...')
    const { data: verifyConfig, error: verifyError } = await supabase
      .from('booking_config')
      .select('available_times')
      .eq('id', 1)
      .single()

    if (verifyError) {
      console.error('❌ Error verifying changes:', verifyError)
      return
    }

    console.log('✅ Verification complete')
    console.log('📅 Final time slots count:', verifyConfig.available_times.length)
    console.log('📅 Final time slots:', verifyConfig.available_times)
    console.log('')

    console.log('🎉 Service periods fixed successfully!')
    console.log('💡 The booking dialog should now show the proper time slots')
    console.log('💡 New dinner service: 18:00-21:30 (every 30 minutes)')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

fixServicePeriods() 
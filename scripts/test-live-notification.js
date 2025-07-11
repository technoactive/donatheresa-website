#!/usr/bin/env node

/**
 * Live Notification Test Script
 * Creates a test booking from "website" source to trigger notifications
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

async function createTestBooking() {
  console.log('🧪 Creating test booking to trigger live notifications...\n')

  try {
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

    // Create booking with tomorrow's date and peak time
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const bookingDate = tomorrow.toISOString().split('T')[0]
    const bookingTime = '19:30:00' // Peak time should trigger notifications

    console.log(`📅 Booking details:`)
    console.log(`   - Date: ${bookingDate}`)
    console.log(`   - Time: ${bookingTime}`)
    console.log(`   - Party size: 4`)
    console.log(`   - Source: website (should trigger notifications)`)

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert([{
        customer_id: customer.id,
        booking_date: bookingDate,
        booking_time: bookingTime,
        party_size: 4,
        status: 'confirmed',
        source: 'website', // This should trigger notifications
        special_requests: 'Test booking for live notification check'
      }])
      .select()
      .single()

    if (error) {
      console.error('❌ Failed to create booking:', error.message)
      return
    }

    console.log(`\n✅ Test booking created successfully!`)
    console.log(`📋 Booking ID: ${booking.id}`)
    console.log(`\n🔔 This should trigger notifications in your dashboard if you have it open.`)
    console.log(`\n📝 Instructions:`)
    console.log(`   1. Open your dashboard in a browser`)
    console.log(`   2. Open browser Developer Tools (F12)`)
    console.log(`   3. Check the Console tab for notification logs`)
    console.log(`   4. Look for messages starting with 🔔, 📥, 🍞`)
    console.log(`   5. Check if toast notifications appear in top-right corner`)
    console.log(`\n⏰ Waiting 10 seconds before cleanup...`)

    // Wait 10 seconds for notification to be processed
    await new Promise(resolve => setTimeout(resolve, 10000))

    // Clean up the test booking
    console.log(`\n🧹 Cleaning up test booking...`)
    await supabase
      .from('bookings')
      .delete()
      .eq('id', booking.id)

    console.log(`✅ Test booking deleted`)
    console.log(`\n📊 Check your dashboard notifications center and console logs!`)

  } catch (error) {
    console.error('💥 Test failed:', error)
  }
}

// Run the test
createTestBooking() 
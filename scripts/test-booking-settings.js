#!/usr/bin/env node

/**
 * Comprehensive Booking Settings Test Suite
 * Tests all aspects of the booking settings system for production readiness
 */

const { createClient } = require('@supabase/supabase-js')

// Test configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_KEY'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

console.log('🚀 BOOKING SETTINGS COMPREHENSIVE TEST SUITE')
console.log('='.repeat(60))
console.log(`Testing against: ${BASE_URL}`)
console.log(`Supabase URL: ${SUPABASE_URL}`)

// Initialize Supabase client if we have credentials
let supabase = null
if (SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_SERVICE_KEY !== 'YOUR_SERVICE_KEY') {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
}

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  failures: []
}

// Utility functions
function logTest(testName, passed, message = '') {
  testResults.total++
  if (passed) {
    testResults.passed++
    console.log(`✅ ${testName}`)
  } else {
    testResults.failed++
    testResults.failures.push({ test: testName, message })
    console.log(`❌ ${testName}: ${message}`)
  }
}

function logSection(sectionName) {
  console.log(`\n🔍 ${sectionName}`)
  console.log('='.repeat(50))
}

// Test functions
async function testBasicSetup() {
  logSection('BASIC SETUP VALIDATION')
  
  logTest('Environment Variables Set', 
    SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_SERVICE_KEY !== 'YOUR_SERVICE_KEY',
    'Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables')
  
  logTest('Supabase Client Initialized', !!supabase, 'Supabase client not initialized')
}

async function testDatabaseConnection() {
  logSection('DATABASE CONNECTION TESTS')
  
  if (!supabase) {
    logTest('Database Connection', false, 'Supabase client not available')
    return false
  }
  
  try {
    const { data, error } = await supabase.from('booking_config').select('*').limit(1)
    logTest('Booking Config Table Access', !error, error?.message)
    
    const { data: periodsData, error: periodsError } = await supabase.from('service_periods').select('*').limit(1)
    logTest('Service Periods Table Access', !periodsError, periodsError?.message)
    
    return !error && !periodsError
  } catch (err) {
    logTest('Database Connection', false, err.message)
    return false
  }
}

async function testServicePeriodsCRUD() {
  logSection('SERVICE PERIODS CRUD TESTS')
  
  if (!supabase) {
    logTest('Service Periods CRUD', false, 'Supabase client not available')
    return
  }
  
  const testPeriod = {
    name: 'Test Period ' + Date.now(),
    start_time: '12:00',
    end_time: '15:00',
    interval_minutes: 30,
    enabled: true,
    period_type: 'lunch',
    sort_order: 1
  }
  
  try {
    // Test CREATE
    const { data: createData, error: createError } = await supabase
      .from('service_periods')
      .insert([testPeriod])
      .select()
    
    logTest('Create Service Period', !createError && createData?.length > 0, createError?.message)
    
    if (createData?.length > 0) {
      const createdPeriod = createData[0]
      
      // Test READ
      const { data: readData, error: readError } = await supabase
        .from('service_periods')
        .select('*')
        .eq('id', createdPeriod.id)
        .single()
      
      logTest('Read Service Period', !readError && readData?.name === testPeriod.name, readError?.message)
      
      // Test UPDATE
      const { data: updateData, error: updateError } = await supabase
        .from('service_periods')
        .update({ interval_minutes: 45 })
        .eq('id', createdPeriod.id)
        .select()
      
      logTest('Update Service Period', !updateError && updateData?.[0]?.interval_minutes === 45, updateError?.message)
      
      // Test DELETE
      const { error: deleteError } = await supabase
        .from('service_periods')
        .delete()
        .eq('id', createdPeriod.id)
      
      logTest('Delete Service Period', !deleteError, deleteError?.message)
    }
    
  } catch (err) {
    logTest('Service Periods CRUD', false, err.message)
  }
}

async function testBookingSettings() {
  logSection('BOOKING SETTINGS TESTS')
  
  if (!supabase) {
    logTest('Booking Settings', false, 'Supabase client not available')
    return
  }
  
  try {
    // Get current settings
    const { data: currentData, error: getCurrentError } = await supabase
      .from('booking_config')
      .select('*')
      .single()
    
    logTest('Get Booking Settings', !getCurrentError, getCurrentError?.message)
    
    if (currentData) {
      // Test structure
      const requiredFields = ['booking_enabled', 'max_advance_days', 'max_party_size', 'available_times', 'suspension_message']
      const hasAllFields = requiredFields.every(field => currentData.hasOwnProperty(field))
      logTest('Settings Structure Complete', hasAllFields, 'Missing required fields')
      
      // Test array fields
      logTest('Available Times is Array', Array.isArray(currentData.available_times), 'available_times should be an array')
      logTest('Closed Dates is Array', Array.isArray(currentData.closed_dates), 'closed_dates should be an array')
      logTest('Closed Days of Week is Array', Array.isArray(currentData.closed_days_of_week), 'closed_days_of_week should be an array')
    }
    
  } catch (err) {
    logTest('Booking Settings', false, err.message)
  }
}

async function testDatabaseFunctions() {
  logSection('DATABASE FUNCTIONS TESTS')
  
  if (!supabase) {
    logTest('Database Functions', false, 'Supabase client not available')
    return
  }
  
  try {
    // Test get_service_periods function
    const { data: periodsData, error: periodsError } = await supabase.rpc('get_service_periods')
    logTest('get_service_periods() Function', !periodsError && Array.isArray(periodsData), periodsError?.message)
    
    // Test generate_time_slots_from_periods function
    const { data: slotsData, error: slotsError } = await supabase.rpc('generate_time_slots_from_periods')
    logTest('generate_time_slots_from_periods() Function', !slotsError && Array.isArray(slotsData), slotsError?.message)
    
  } catch (err) {
    logTest('Database Functions', false, err.message)
  }
}

async function testTimeSlotGeneration() {
  logSection('TIME SLOT GENERATION TESTS')
  
  // Test the logic locally
  function generateTestSlots(startTime, endTime, interval) {
    const slots = []
    const [startHour, startMinute] = startTime.split(':').map(Number)
    const [endHour, endMinute] = endTime.split(':').map(Number)
    
    const startMinutes = startHour * 60 + startMinute
    const endMinutes = endHour * 60 + endMinute
    
    for (let currentMinutes = startMinutes; currentMinutes < endMinutes; currentMinutes += interval) {
      const hours = Math.floor(currentMinutes / 60)
      const minutes = currentMinutes % 60
      const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      slots.push(timeStr)
    }
    
    return slots
  }
  
  // Test various intervals
  const intervalTests = [
    { start: '12:00', end: '14:00', interval: 30, expected: 4 },
    { start: '18:00', end: '20:00', interval: 45, expected: 2 },
    { start: '10:00', end: '11:00', interval: 15, expected: 4 },
    { start: '19:00', end: '22:00', interval: 60, expected: 3 }
  ]
  
  intervalTests.forEach(test => {
    const slots = generateTestSlots(test.start, test.end, test.interval)
    logTest(`Time Slots ${test.interval}min (${test.start}-${test.end})`, 
      slots.length === test.expected, 
      `Expected ${test.expected} slots, got ${slots.length}`)
  })
  
  // Test all requested intervals
  const allIntervals = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]
  allIntervals.forEach(interval => {
    const slots = generateTestSlots('12:00', '14:00', interval)
    const expectedCount = Math.floor(120 / interval)
    logTest(`Interval ${interval} minutes`, 
      slots.length === expectedCount, 
      `Expected ${expectedCount} slots, got ${slots.length}`)
  })
}

async function testAPIEndpoints() {
  logSection('API ENDPOINTS TESTS')
  
  try {
    // Use dynamic import for fetch in Node.js
    const fetch = (await import('node-fetch')).default
    
    // Test booking settings API
    const response = await fetch(`${BASE_URL}/api/booking-settings`)
    logTest('Booking Settings API Response', response.ok, `HTTP ${response.status}`)
    
    if (response.ok) {
      const data = await response.json()
      logTest('API Returns Valid JSON', typeof data === 'object', 'Response is not valid JSON')
      
      const requiredFields = ['booking_enabled', 'max_advance_days', 'max_party_size', 'available_times']
      const hasFields = requiredFields.every(field => data.hasOwnProperty(field))
      logTest('API Response Structure', hasFields, 'Missing required fields in API response')
    }
    
  } catch (err) {
    logTest('API Endpoints', false, err.message)
  }
}

async function testPageAccessibility() {
  logSection('PAGE ACCESSIBILITY TESTS')
  
  const pages = [
    { name: 'Settings Page', url: '/dashboard/settings/bookings' },
    { name: 'Booking Form', url: '/reserve' },
    { name: 'Main Settings', url: '/dashboard/settings' }
  ]
  
  try {
    const fetch = (await import('node-fetch')).default
    
    for (const page of pages) {
      try {
        const response = await fetch(`${BASE_URL}${page.url}`)
        logTest(`${page.name} Accessibility`, response.ok, `HTTP ${response.status}`)
      } catch (err) {
        logTest(`${page.name} Accessibility`, false, err.message)
      }
    }
  } catch (err) {
    logTest('Page Accessibility', false, err.message)
  }
}

// Data validation tests
async function testDataValidation() {
  logSection('DATA VALIDATION TESTS')
  
  // Test time format validation
  const timeTests = [
    { time: '12:00', valid: true },
    { time: '23:59', valid: true },
    { time: '00:00', valid: true },
    { time: '24:00', valid: false },
    { time: '12:60', valid: false },
    { time: 'invalid', valid: false }
  ]
  
  timeTests.forEach(test => {
    const isValid = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(test.time)
    logTest(`Time Format: ${test.time}`, 
      isValid === test.valid, 
      `Expected ${test.valid ? 'valid' : 'invalid'} but got ${isValid ? 'valid' : 'invalid'}`)
  })
  
  // Test interval validation
  const intervalTests = [
    { interval: 5, valid: true },
    { interval: 60, valid: true },
    { interval: 0, valid: false },
    { interval: -5, valid: false },
    { interval: 1440, valid: false }
  ]
  
  intervalTests.forEach(test => {
    const isValid = test.interval > 0 && test.interval <= 60
    logTest(`Interval: ${test.interval}min`, 
      isValid === test.valid, 
      `Expected ${test.valid ? 'valid' : 'invalid'} but got ${isValid ? 'valid' : 'invalid'}`)
  })
}

// Performance tests
async function testPerformance() {
  logSection('PERFORMANCE TESTS')
  
  if (!supabase) {
    logTest('Performance Tests', false, 'Supabase client not available')
    return
  }
  
  try {
    // Test query performance
    const startTime = Date.now()
    const { data, error } = await supabase.from('service_periods').select('*')
    const queryTime = Date.now() - startTime
    
    logTest('Service Periods Query Performance', 
      !error && queryTime < 2000, 
      error?.message || `Query took ${queryTime}ms`)
    
    // Test time slot generation performance
    const slotStartTime = Date.now()
    const { data: slotsData, error: slotsError } = await supabase.rpc('generate_time_slots_from_periods')
    const slotTime = Date.now() - slotStartTime
    
    logTest('Time Slot Generation Performance', 
      !slotsError && slotTime < 3000, 
      slotsError?.message || `Generation took ${slotTime}ms`)
    
  } catch (err) {
    logTest('Performance Tests', false, err.message)
  }
}

// Main test runner
async function runAllTests() {
  await testBasicSetup()
  await testDatabaseConnection()
  await testServicePeriodsCRUD()
  await testBookingSettings()
  await testDatabaseFunctions()
  await testTimeSlotGeneration()
  await testAPIEndpoints()
  await testPageAccessibility()
  await testDataValidation()
  await testPerformance()
  
  // Print results
  console.log('\n📊 TEST RESULTS SUMMARY')
  console.log('='.repeat(60))
  console.log(`Total Tests: ${testResults.total}`)
  console.log(`Passed: ${testResults.passed} ✅`)
  console.log(`Failed: ${testResults.failed} ❌`)
  console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`)
  
  if (testResults.failures.length > 0) {
    console.log('\n🔴 FAILURES:')
    testResults.failures.forEach(failure => {
      console.log(`  - ${failure.test}: ${failure.message}`)
    })
  }
  
  console.log('\n🎯 PRODUCTION READINESS ASSESSMENT:')
  if (testResults.failed === 0) {
    console.log('✅ PRODUCTION READY - All tests passed!')
  } else if (testResults.failed <= 2) {
    console.log('⚠️  MOSTLY READY - Minor issues detected')
  } else {
    console.log('❌ NOT READY - Critical issues detected')
  }
  
  process.exit(testResults.failed === 0 ? 0 : 1)
}

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error)
  process.exit(1)
})

// Run the tests
runAllTests().catch(console.error) 
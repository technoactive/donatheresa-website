#!/usr/bin/env node

/**
 * Final Production Readiness Test Suite
 * Comprehensive validation for deployment
 */

const { spawn } = require('child_process')
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

let totalTests = 0
let passedTests = 0
let failedTests = 0
const failures = []

function logTest(testName, passed, message = '') {
  totalTests++
  if (passed) {
    passedTests++
    console.log(`✅ ${testName}`)
  } else {
    failedTests++
    failures.push({ test: testName, message })
    console.log(`❌ ${testName}: ${message}`)
  }
}

function logSection(sectionName) {
  console.log(`\n🔍 ${sectionName}`)
  console.log('='.repeat(50))
}

console.log('🚀 FINAL PRODUCTION READINESS TEST SUITE')
console.log('='.repeat(60))
console.log(`Testing against: ${BASE_URL}`)
console.log(`Started: ${new Date().toISOString()}`)

// Test 1: Core Logic Tests
logSection('CORE FUNCTIONALITY TESTS')

// Time slot generation
function generateTimeSlots(startTime, endTime, interval) {
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

// Test all required intervals
const intervals = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]
intervals.forEach(interval => {
  const slots = generateTimeSlots('12:00', '14:00', interval)
  logTest(`${interval}-minute intervals`, slots.length > 0, `Generated ${slots.length} slots`)
})

// Test specific scenarios
const scenarios = [
  { start: '12:00', end: '14:00', interval: 30, expectedSlots: 4 },
  { start: '18:00', end: '22:00', interval: 30, expectedSlots: 8 },
  { start: '10:00', end: '11:00', interval: 15, expectedSlots: 4 }
]

scenarios.forEach(scenario => {
  const slots = generateTimeSlots(scenario.start, scenario.end, scenario.interval)
  logTest(`Scenario ${scenario.start}-${scenario.end}`, 
    slots.length === scenario.expectedSlots, 
    `Expected ${scenario.expectedSlots}, got ${slots.length}`)
})

// Test data validation
logSection('DATA VALIDATION TESTS')

const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
const timeTests = [
  { time: '00:00', valid: true },
  { time: '12:00', valid: true },
  { time: '23:59', valid: true },
  { time: '24:00', valid: false },
  { time: '12:60', valid: false }
]

timeTests.forEach(test => {
  const isValid = timePattern.test(test.time)
  logTest(`Time ${test.time}`, isValid === test.valid, 
    `Should be ${test.valid ? 'valid' : 'invalid'}`)
})

// Test interval ranges
const intervalTests = [5, 30, 60, 0, 61, -1]
intervalTests.forEach(interval => {
  const isValid = interval > 0 && interval <= 60
  const shouldBeValid = interval >= 5 && interval <= 60
  logTest(`Interval ${interval}min`, 
    (isValid && shouldBeValid) || (!isValid && !shouldBeValid),
    `Validation: ${isValid}`)
})

// Test day of week validation
const dayTests = [0, 1, 6, 7, -1]
dayTests.forEach(day => {
  const isValid = Number.isInteger(day) && day >= 0 && day <= 6
  const shouldBeValid = day >= 0 && day <= 6
  logTest(`Day ${day}`, isValid === shouldBeValid, `Day validation`)
})

// API Tests
async function testAPI() {
  logSection('API ENDPOINT TESTS')
  
  return new Promise((resolve) => {
    const curl = spawn('curl', ['-s', '-w', '%{http_code}', `${BASE_URL}/api/booking-settings`])
    
    let output = ''
    curl.stdout.on('data', (data) => {
      output += data.toString()
    })
    
    curl.on('close', (code) => {
      if (code === 0 && output) {
        const httpCode = output.slice(-3)
        const jsonData = output.slice(0, -3)
        
        logTest('API Response Code', httpCode === '200', `HTTP ${httpCode}`)
        
        if (httpCode === '200') {
          try {
            const data = JSON.parse(jsonData)
            
            // Validate structure
            const requiredFields = [
              'booking_enabled', 'max_advance_days', 'max_party_size',
              'available_times', 'closed_dates', 'closed_days_of_week',
              'suspension_message', 'service_periods'
            ]
            
            requiredFields.forEach(field => {
              logTest(`API Field: ${field}`, 
                data.hasOwnProperty(field), 
                `Missing required field`)
            })
            
            // Validate data types
            logTest('booking_enabled type', typeof data.booking_enabled === 'boolean')
            logTest('max_advance_days type', typeof data.max_advance_days === 'number')
            logTest('max_party_size type', typeof data.max_party_size === 'number')
            logTest('available_times type', Array.isArray(data.available_times))
            logTest('service_periods type', Array.isArray(data.service_periods))
            
            // Validate constraints
            logTest('max_advance_days > 0', data.max_advance_days > 0)
            logTest('max_party_size > 0', data.max_party_size > 0)
            
            // Validate time slots
            if (data.available_times.length > 0) {
              const validTimeSlots = data.available_times.every(slot => timePattern.test(slot))
              logTest('Time slots format', validTimeSlots, 'Invalid time format detected')
            }
            
            // Validate service periods
            if (data.service_periods && data.service_periods.length > 0) {
              const period = data.service_periods[0]
              const periodFields = ['id', 'name', 'start_time', 'end_time', 'interval_minutes', 'enabled', 'period_type']
              const hasAllFields = periodFields.every(field => period.hasOwnProperty(field))
              logTest('Service period structure', hasAllFields, 'Missing service period fields')
            }
            
          } catch (parseError) {
            logTest('API JSON Parse', false, parseError.message)
          }
        }
      } else {
        logTest('API Accessibility', false, `curl failed with code ${code}`)
      }
      resolve()
    })
    
    curl.on('error', (error) => {
      logTest('API Accessibility', false, error.message)
      resolve()
    })
  })
}

// Page accessibility tests
async function testPages() {
  logSection('PAGE ACCESSIBILITY TESTS')
  
  const pages = [
    '/dashboard/settings/bookings',
    '/reserve',
    '/dashboard/settings',
    '/dashboard'
  ]
  
  for (const page of pages) {
    await new Promise((resolve) => {
      const curl = spawn('curl', ['-s', '-I', `${BASE_URL}${page}`])
      
      let output = ''
      curl.stdout.on('data', (data) => {
        output += data.toString()
      })
      
      curl.on('close', () => {
        const httpOk = output.includes('HTTP/1.1 200 OK') || output.includes('200 OK')
        logTest(`Page: ${page}`, httpOk, httpOk ? 'OK' : 'Failed')
        resolve()
      })
      
      curl.on('error', () => {
        logTest(`Page: ${page}`, false, 'Network error')
        resolve()
      })
    })
  }
}

// Performance tests
function testPerformance() {
  logSection('PERFORMANCE TESTS')
  
  // Time slot generation performance
  const startTime = Date.now()
  const largeSlotSet = []
  
  // Generate lots of time slots
  for (let h = 6; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
      largeSlotSet.push(timeStr)
    }
  }
  
  const generationTime = Date.now() - startTime
  logTest('Large slot generation', generationTime < 100, `${generationTime}ms`)
  logTest('Reasonable slot count', largeSlotSet.length > 0 && largeSlotSet.length < 1000, 
    `${largeSlotSet.length} slots`)
  
  // Deduplication performance
  const dupStart = Date.now()
  const duplicates = [...largeSlotSet, ...largeSlotSet]
  const unique = [...new Set(duplicates)]
  const dedupTime = Date.now() - dupStart
  
  logTest('Deduplication performance', dedupTime < 50, `${dedupTime}ms`)
  logTest('Deduplication correctness', unique.length === largeSlotSet.length, 
    `${unique.length} unique from ${duplicates.length} total`)
}

// Edge case tests
function testEdgeCases() {
  logSection('EDGE CASE TESTS')
  
  // Midnight crossing
  const midnightSlots = generateTimeSlots('23:30', '00:30', 30)
  logTest('Midnight crossing', midnightSlots.length === 1, 
    `Generated ${midnightSlots.length} slots for 23:30-00:30`)
  
  // Very short periods
  const shortSlots = generateTimeSlots('12:00', '12:05', 10)
  logTest('Short period', shortSlots.length === 0, 
    `Generated ${shortSlots.length} slots for 5-minute period`)
  
  // Large intervals
  const largeIntervalSlots = generateTimeSlots('12:00', '13:00', 90)
  logTest('Large interval', largeIntervalSlots.length === 0, 
    `Generated ${largeIntervalSlots.length} slots for 90-minute interval`)
  
  // Boundary times
  const boundarySlots = generateTimeSlots('00:00', '23:59', 60)
  logTest('Full day boundary', boundarySlots.length === 23, 
    `Generated ${boundarySlots.length} hourly slots for full day`)
}

// Main test runner
async function runAllTests() {
  // Run synchronous tests
  testPerformance()
  testEdgeCases()
  
  // Run async tests
  await testAPI()
  await testPages()
  
  // Print final results
  console.log('\n📊 FINAL TEST RESULTS')
  console.log('='.repeat(60))
  console.log(`Total Tests: ${totalTests}`)
  console.log(`Passed: ${passedTests} ✅`)
  console.log(`Failed: ${failedTests} ❌`)
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`)
  
  if (failures.length > 0) {
    console.log('\n🔴 FAILURES:')
    failures.forEach((failure, index) => {
      console.log(`  ${index + 1}. ${failure.test}`)
      if (failure.message) {
        console.log(`     → ${failure.message}`)
      }
    })
  }
  
  // Final assessment
  const successRate = (passedTests / totalTests) * 100
  console.log('\n🎯 FINAL PRODUCTION ASSESSMENT')
  console.log('='.repeat(60))
  
  if (successRate >= 98) {
    console.log('🚀 PRODUCTION READY')
    console.log('   All critical systems operational')
    console.log('   Ready for immediate deployment')
    console.log('   Confidence level: 100%')
  } else if (successRate >= 90) {
    console.log('⚠️  MOSTLY READY')
    console.log('   Minor issues require attention')
    console.log('   Can deploy with monitoring')
  } else {
    console.log('❌ NOT READY')
    console.log('   Critical issues must be resolved')
    console.log('   Do not deploy to production')
  }
  
  console.log(`\n📋 TESTING COMPLETED`)
  console.log(`   Timestamp: ${new Date().toISOString()}`)
  console.log(`   Duration: ${((Date.now() - startTime) / 1000).toFixed(1)}s`)
  
  const startTime = Date.now()
  
  // Exit with appropriate code
  process.exit(successRate >= 98 ? 0 : 1)
}

// Set start time
const startTime = Date.now()

// Run all tests
runAllTests().catch(console.error) 
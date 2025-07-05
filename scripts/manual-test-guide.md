# Booking Settings Manual Test Guide

## 🎯 Production Readiness Testing

This guide provides comprehensive manual testing for all booking settings functionality.

## Pre-requisites

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Access the settings page:**
   ```
   http://localhost:3000/dashboard/settings/bookings
   ```

## 🧪 Test Suite 1: Basic Settings CRUD

### Test 1.1: Page Load and Initial State
- [ ] Settings page loads without errors
- [ ] All form sections are visible
- [ ] Loading state shows briefly then resolves
- [ ] Current settings populate correctly

### Test 1.2: Booking System Toggle
- [ ] Toggle "Accept New Bookings" switch
- [ ] Save settings
- [ ] Verify booking form shows/hides suspension message
- [ ] Toggle back and verify booking form works

### Test 1.3: Booking Limits
- [ ] Change "Maximum Advance Days" (try: 7, 30, 90, 365)
- [ ] Change "Maximum Party Size" (try: 2, 8, 12, 20)
- [ ] Save and verify limits work in booking form
- [ ] Test boundary values (1, 0, negative numbers)

### Test 1.4: Suspension Message
- [ ] Edit suspension message text
- [ ] Save settings
- [ ] Disable booking system
- [ ] Verify custom message shows on booking form

## 🧪 Test Suite 2: Service Periods Management

### Test 2.1: Default Service Periods
- [ ] Verify default lunch and dinner periods exist
- [ ] Check time ranges are reasonable
- [ ] Verify they're enabled by default

### Test 2.2: Add New Service Period
- [ ] Click "Add Period" button
- [ ] Fill out new period details:
  - Name: "Afternoon Tea"
  - Start: 15:00
  - End: 17:00
  - Interval: 45 minutes
  - Type: Other
- [ ] Save and verify period appears

### Test 2.3: Edit Service Period
- [ ] Edit existing period name
- [ ] Change start/end times
- [ ] Change interval (test all: 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60 minutes)
- [ ] Save and verify changes

### Test 2.4: Disable/Enable Service Period
- [ ] Toggle period on/off
- [ ] Verify time slots update in preview
- [ ] Save and check booking form reflects changes

### Test 2.5: Delete Service Period
- [ ] Remove a custom period
- [ ] Verify it disappears from list
- [ ] Verify time slots update

## 🧪 Test Suite 3: Time Slot Generation

### Test 3.1: Time Slot Preview
- [ ] Verify time slots appear below service periods
- [ ] Check slot count is accurate
- [ ] Verify slots sort chronologically

### Test 3.2: Interval Testing
Create periods with different intervals and verify correct slots:

**30-minute intervals (12:00-14:00):**
- [ ] Expected: 12:00, 12:30, 13:00, 13:30

**45-minute intervals (18:00-20:00):**
- [ ] Expected: 18:00, 18:45, 19:15

**15-minute intervals (10:00-11:00):**
- [ ] Expected: 10:00, 10:15, 10:30, 10:45

### Test 3.3: Overlapping Periods
- [ ] Create overlapping periods
- [ ] Verify no duplicate time slots
- [ ] Verify all unique slots appear

### Test 3.4: Real-time Updates
- [ ] Change period time
- [ ] Verify preview updates immediately
- [ ] Change interval
- [ ] Verify slot count changes

## 🧪 Test Suite 4: Weekly Closures

### Test 4.1: Day Selection
- [ ] Click each day button (Sun-Sat)
- [ ] Verify button states change (Open/Closed)
- [ ] Verify multiple days can be selected

### Test 4.2: Closure Persistence
- [ ] Select Monday and Tuesday as closed
- [ ] Save settings
- [ ] Reload page and verify selection persists
- [ ] Check booking form respects closures

### Test 4.3: All Days Scenarios
- [ ] Test selecting all days (should prevent all bookings)
- [ ] Test selecting no days (all days open)
- [ ] Test typical restaurant closure (Sunday/Monday)

## 🧪 Test Suite 5: Specific Date Closures

### Test 5.1: Add Closed Dates
- [ ] Select future date from date picker
- [ ] Click "+" button
- [ ] Verify date appears in list
- [ ] Add multiple dates

### Test 5.2: Remove Closed Dates
- [ ] Click trash icon next to date
- [ ] Verify date disappears from list
- [ ] Verify booking form allows date again

### Test 5.3: Date Validation
- [ ] Try adding past dates (should work for admin purposes)
- [ ] Try adding far future dates
- [ ] Add holidays (Christmas, New Year)

## 🧪 Test Suite 6: Save and Persistence

### Test 6.1: Save Functionality
- [ ] Make multiple changes across all sections
- [ ] Click "Save Settings" button
- [ ] Verify success toast appears
- [ ] Verify loading state during save

### Test 6.2: Data Persistence
- [ ] Save settings
- [ ] Refresh page
- [ ] Verify all settings persist correctly
- [ ] Restart dev server and recheck

### Test 6.3: Error Handling
- [ ] Disconnect internet and try to save
- [ ] Verify error message appears
- [ ] Reconnect and verify retry works

## 🧪 Test Suite 7: Frontend Integration

### Test 7.1: Booking Form Integration
- [ ] Go to `/reserve` page
- [ ] Verify time slots from settings appear
- [ ] Verify max party size limit works
- [ ] Verify advance booking limit works

### Test 7.2: Responsive Design
- [ ] Test on mobile device (or dev tools mobile view)
- [ ] Verify all controls work on touch
- [ ] Check layout doesn't break
- [ ] Test day selector grid on mobile

### Test 7.3: Loading States
- [ ] Refresh settings page and watch loading states
- [ ] Verify skeleton states look good
- [ ] Check error states if server is down

## 🧪 Test Suite 8: Database Validation

### Test 8.1: Direct Database Check
Open Supabase dashboard and verify:

- [ ] `booking_config` table updates correctly
- [ ] `service_periods` table has correct data
- [ ] Arrays (closed_dates, closed_days_of_week) store properly
- [ ] Timestamps update on changes

### Test 8.2: SQL Function Testing
In Supabase SQL editor, run:

```sql
-- Test get service periods
SELECT * FROM get_service_periods();

-- Test time slot generation
SELECT * FROM generate_time_slots_from_periods();

-- Test upsert function
SELECT upsert_service_period(
  'Test Period',
  '12:00'::TIME,
  '14:00'::TIME,
  30,
  true,
  'lunch',
  1
);
```

## 🧪 Test Suite 9: Edge Cases and Error Scenarios

### Test 9.1: Boundary Testing
- [ ] Set end time before start time
- [ ] Set 0-minute intervals
- [ ] Set 1440-minute intervals (full day)
- [ ] Very long service period names

### Test 9.2: Network Issues
- [ ] Slow 3G simulation
- [ ] Offline mode testing
- [ ] Server timeout simulation

### Test 9.3: Concurrent Users
- [ ] Open settings in two tabs
- [ ] Make changes in both
- [ ] Verify data consistency

## 🎯 Production Readiness Checklist

### ✅ Functionality
- [ ] All CRUD operations work
- [ ] Time slot generation accurate
- [ ] Real-time updates work
- [ ] Data persistence correct

### ✅ User Experience
- [ ] Responsive design
- [ ] Loading states
- [ ] Error handling
- [ ] Success feedback

### ✅ Performance
- [ ] Page loads quickly (<2s)
- [ ] Save operations fast (<1s)
- [ ] Large datasets handle well
- [ ] No memory leaks

### ✅ Data Integrity
- [ ] All settings save correctly
- [ ] Arrays handle properly
- [ ] Foreign keys maintained
- [ ] Validation works

### ✅ Integration
- [ ] Booking form updates
- [ ] API endpoints work
- [ ] Database functions work
- [ ] Error boundaries work

## 🚀 Final Assessment

After completing all tests:

- **90-100% Pass Rate**: ✅ PRODUCTION READY
- **70-89% Pass Rate**: ⚠️ NEEDS MINOR FIXES
- **<70% Pass Rate**: ❌ NEEDS MAJOR WORK

## 📝 Bug Report Template

```
## Bug Report

**Test Section**: [e.g., Service Periods Management]
**Test Case**: [e.g., Test 2.2: Add New Service Period]
**Expected**: [What should happen]
**Actual**: [What actually happened]
**Severity**: [Critical/High/Medium/Low]
**Steps to Reproduce**:
1. 
2. 
3. 

**Environment**: 
- Browser: 
- Device: 
- Screen Size: 
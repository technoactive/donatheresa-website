# Dona Theresa Restaurant Booking System

A comprehensive restaurant booking and management system built with Next.js 15, TypeScript, and Supabase.

## Features

### 🍽️ Restaurant Website
- Modern, responsive design with dark theme
- Interactive menu with beautiful dish imagery
- About page with restaurant story
- Contact page with location and hours
- Online reservation system

### 📊 Dashboard Management
- Booking management with real-time updates
- Customer database and management
- Advanced time slot configuration
- Service period management (lunch, dinner, custom)
- Comprehensive settings system

### 🌍 Locale & Internationalization
- Full timezone support for accurate booking times
- Currency formatting and localization
- Date/time format preferences
- Restaurant information management
- Dynamic schema.org SEO integration

### ⚙️ Technical Features
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Supabase** for database and real-time features
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Fixed header/sidebar layout** for dashboard
- **Production-ready** with comprehensive testing

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Planned (Supabase Auth)
- **Deployment**: Vercel-ready

## Quick Start

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Set up environment variables (see SUPABASE_SETUP.md)
4. Run development server: `pnpm dev`

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── (public)/          # Public-facing pages
│   ├── dashboard/         # Admin dashboard
│   └── api/              # API routes
├── components/            # Reusable components
│   ├── dashboard/        # Dashboard-specific components
│   ├── public/           # Public site components
│   ├── locale/           # Localization components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utilities and configuration
├── scripts/              # Database scripts and tests
└── public/               # Static assets
```

## Configuration

The system includes comprehensive configuration options:

- **Booking Settings**: Time slots, service periods, party size limits
- **Locale Settings**: Timezone, currency, date/time formatting
- **Restaurant Details**: Contact information, hours, location

## Database

Uses Supabase with a comprehensive schema including:
- Bookings with timezone-aware scheduling
- Customer management
- Service period configuration
- Locale settings for internationalization

## Development

Built with modern development practices:
- TypeScript for type safety
- Component-based architecture
- Responsive design patterns
- Comprehensive error handling
- Production-ready configuration

---

**© 2025 Dona Theresa Restaurant** - Built with ❤️ for exceptional dining experiences.

<!-- Last deployment trigger: 2025-01-05 -->

## Email System Fixes (Latest Update)

### Issues Resolved ✅

**Problem**: Email settings page showed inaccurate daily usage and status information

**Root Causes Identified**:
1. Daily usage counter (`emails_sent_today`) was not being properly incremented when emails were sent
2. Email service wasn't calling the database functions to update counters  
3. Daily reset functionality wasn't being triggered consistently
4. Analytics calculations were using stale data instead of real-time values

**Solutions Implemented**:

1. **Fixed Daily Usage Tracking**:
   - Updated email service to properly increment daily counter after successful sends
   - Added automatic daily reset functionality that triggers on new day
   - Implemented proper database calls for counter management

2. **Enhanced Email Settings Page**:
   - Added real-time daily usage calculation with automatic reset
   - Created `getDailyEmailUsage()` function for accurate current data
   - Improved status indicators with visual progress bars and percentage display
   - Added usage warning alerts when approaching daily limits

3. **Improved Email Analytics**:
   - Updated analytics to use real-time data instead of stale settings
   - Added current daily usage and limit to analytics responses
   - Enhanced calculation accuracy for all metrics

4. **Added System Integrity Testing**:
   - Created comprehensive test script (`scripts/test-email-system-integrity.js`)
   - Tests database functions, triggers, and daily usage tracking
   - Verifies email logs, templates, and settings tables

### How to Test the Fixes

Run the email system integrity test:
```bash
node scripts/test-email-system-integrity.js
```

This will verify:
- ✅ Email settings table and admin configuration
- ✅ Database functions (reset_daily_email_count)
- ✅ Daily usage tracking and increment functionality  
- ✅ Email logs and templates accessibility
- ✅ Database triggers (if configured)

### Files Modified
- `lib/email/email-service.ts` - Fixed daily usage tracking
- `app/dashboard/settings/email/actions.ts` - Added accurate usage functions
- `app/dashboard/settings/email/page.tsx` - Enhanced UI with real-time data
- `lib/email/types.ts` - Updated types for new analytics properties
- `scripts/test-email-system-integrity.js` - New comprehensive test script

---

## 🎨 Notification Settings UX Overhaul (Latest Update)

### Issues Resolved ✅

**Problem**: Notification settings page was a horrible 823-line monster with terrible UX, no organization, and zero optimization.

**Major Issues Fixed**:
1. **Overwhelming interface** - Single massive form with no organization
2. **Poor performance** - All controls rendered at once with no optimization  
3. **Terrible mobile experience** - Complex layouts that didn't work on mobile
4. **No quick setup** - Users had to configure every single option manually
5. **Poor accessibility** - No proper grouping or intuitive navigation
6. **No testing integration** - Separate demo page made testing difficult

### **🎯 Complete UX Redesign**

**✨ New Features:**
- **Tabbed Interface**: Quick Setup | Custom | Test & Demo
- **Smart Presets**: Restaurant Standard, Quiet Mode, High Alert
- **Visual Status**: Clear master switch and status indicators
- **Integrated Testing**: Built-in sound testing for each notification type
- **Mobile Optimized**: Responsive design that works perfectly on all devices

**⚡ Performance Improvements:**
- **Reduced complexity**: From 823 lines to clean, organized code
- **Lazy loading**: Proper suspense and loading states
- **Optimized renders**: Smart form updates with minimal re-renders
- **Faster validation**: Simplified schema for better performance

**🎨 Better UX:**
- **Quick Setup Tab**: Apply presets instantly (Restaurant/Quiet/Alert)
- **Visual Cards**: Notification types with icons and color coding
- **Master Controls**: Single switch to enable/disable everything
- **Real-time Feedback**: Visual volume slider and status indicators
- **Integrated Testing**: Test sounds directly without leaving the page

**📱 Mobile First:**
- **Single column layouts** on mobile devices
- **Touch-friendly controls** with proper spacing
- **Responsive grids** that adapt to screen size
- **Better typography** for readability

### **🧪 How to Use the New Interface**

**Quick Setup (Recommended):**
1. Go to **Dashboard → Settings → Notifications**
2. Choose a **Smart Preset**: Restaurant Standard, Quiet Mode, or High Alert
3. Adjust **Master Volume** and **Visual Settings**
4. Test your setup in the **Test & Demo** tab

**Custom Configuration:**
1. Use the **Custom** tab for granular control
2. Configure individual notification types
3. Set quiet hours and advanced settings
4. Test each notification type individually

**Testing:**
1. Switch to **Test & Demo** tab
2. Test notification sounds for each type
3. Create a real booking to see live notifications

The notification settings are now **intuitive, fast, and user-friendly** instead of the previous horrible experience! 🎉

---

## 🔔 Notification System Fixes (Latest Update)

### Issues Resolved ✅

**Problem**: Notification system was completely non-functional - no real-time alerts, broken UI components, and missing database integration.

**Root Causes Identified**:
1. Notification manager wasn't properly loading settings from the database
2. Real-time subscriptions had poor error handling and debugging
3. Toast notifications weren't showing due to configuration issues
4. Missing debugging and monitoring throughout the notification pipeline
5. TypeScript errors in notification utility functions
6. Inconsistent database field names (booking_date vs date, booking_time vs time)

**Solutions Implemented**:

### **🛠️ Core Notification Manager Fixes**
- **Enhanced settings loading** with automatic fallback to defaults
- **Added comprehensive error handling** for database connection issues
- **Implemented auto-creation** of notification settings if missing
- **Added detailed logging** throughout the notification pipeline
- **Fixed TypeScript errors** in notification utility functions

### **🔄 Real-time Subscription Improvements**
- **Enhanced error handling** for Supabase real-time connections
- **Added comprehensive debugging logs** for monitoring subscription status
- **Fixed database field mapping** (booking_date/booking_time vs date/time)
- **Improved customer data fetching** with proper error handling
- **Added VIP and peak-time detection logic** with logging

### **🍞 Toast Notification System**
- **Enhanced toast container** with detailed debugging logs
- **Fixed notification filtering** logic for proper toast display
- **Added state monitoring** for active toasts
- **Improved toast lifecycle management**

### **🎛️ Notification Provider Enhancements**
- **Added comprehensive state logging** for debugging
- **Enhanced subscription management** with proper cleanup
- **Improved settings synchronization** between components
- **Added initialization debugging** for troubleshooting

### **📊 Testing & Monitoring**
- **Created comprehensive test script** (`scripts/test-notifications-system.js`)
- **Added notification demo component** to settings page for easy testing
- **Enhanced settings page layout** with side-by-side demo and configuration
- **Added real-time test booking creation** for verification

## **🧪 How to Test the Notification System**

### **1. Check Browser Console**
Open your browser's developer tools and watch the console for:
```
📱 Loading notification settings...
✅ Notification settings loaded successfully
🔄 Setting up real-time notifications...
📡 Realtime subscription status: SUBSCRIBED
✅ Real-time notifications are now active
```

### **2. Use the Notification Demo**
1. Go to **Dashboard → Settings → Notifications**
2. Use the **Notification System Demo** on the right side
3. Click **"Send Test"** for different notification types
4. Click **"Test Sound"** to verify audio is working

### **3. Test Real-time Notifications**
**Method 1: Database Test Booking**
- I've created a test booking (6 guests at 8:00 PM) that should trigger a peak-time notification

**Method 2: Create Website Booking**
1. Go to your public booking page: `/reserve`
2. Make a reservation (this will have `source: 'website'`)
3. Watch the dashboard for real-time notifications

**Method 3: Manual Database Insert**
```sql
INSERT INTO bookings (customer_id, booking_date, booking_time, party_size, source) 
VALUES ((SELECT id FROM customers LIMIT 1), CURRENT_DATE + 1, '19:00:00', 4, 'website');
```

### **4. Verify Notification Components**
- **Bell Icon**: Should appear in dashboard header
- **Notification Count**: Red badge should show unread count
- **Toast Notifications**: Should slide in from top-right
- **Sound Alerts**: Should play for enabled notification types

### **5. Check Settings**
- **Notifications Enabled**: ✅ Master switch
- **Sound Enabled**: ✅ Audio feedback  
- **Show Toasts**: ✅ Visual popups
- **New Booking Enabled**: ✅ Website booking alerts

## **🔍 Troubleshooting**

If notifications still don't work:

1. **Check Supabase Real-time** 
   - Ensure real-time is enabled for `bookings` table in Supabase dashboard
   - Verify your Supabase project has real-time enabled

2. **Browser Permissions**
   - Allow audio autoplay in browser settings
   - Check if notifications are blocked

3. **Console Errors**
   - Look for JavaScript errors in browser console
   - Check network tab for failed API calls

4. **Database Issues**
   - Verify `notification_settings` table has data for user 'admin'
   - Check RLS policies allow proper access

## **⚡ Expected Notification Types**

- **🍽️ New Booking**: Regular customer reservations from website
- **👑 VIP Booking**: Customers with `customer_segment = 'VIP'`  
- **🔥 Peak Time**: Bookings between 6:00 PM - 9:00 PM
- **❌ Booking Cancelled**: Status changes to 'cancelled'
- **✏️ Booking Updated**: Changes to date, time, or party size
- **⚠️ System Alert**: Important system notifications

The notification system now includes comprehensive logging, error handling, and should work reliably for real-time restaurant booking alerts!

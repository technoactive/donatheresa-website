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

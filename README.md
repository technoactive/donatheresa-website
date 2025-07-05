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

**© 2024 Dona Theresa Restaurant** - Built with ❤️ for exceptional dining experiences.
# Environment Setup

## Required Environment Variables

To run this application, you need to set up the following environment variables in your `.env.local` file (locally) or in your Vercel dashboard (production):

### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

**Important**: The `SUPABASE_SERVICE_ROLE_KEY` is required for admin operations like updating booking settings. Without it, the booking toggle functionality will not work properly.

### Email Configuration (optional)
```
RESEND_API_KEY=your-resend-api-key
RESTAURANT_EMAIL=reservations@donatheresa.com
RESTAURANT_NAME=Dona Theresa
```

## Setting Up in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each of the above variables
5. Make sure to add the `SUPABASE_SERVICE_ROLE_KEY` - this is critical for the booking system to work

## Getting Your Supabase Keys

1. Go to your Supabase dashboard
2. Select your project
3. Go to Settings → API
4. You'll find:
   - `URL` → Use as `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → Use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → Use as `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

**Security Note**: Never commit your `.env.local` file or expose your service role key publicly.

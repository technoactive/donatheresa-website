# Supabase Integration Setup Guide

## Overview
Your Dona Theresa restaurant website is now fully integrated with Supabase! This guide will help you set up and configure the database to replace the mock data system.

## 🚀 Quick Start

### 1. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project
4. Wait for the project to be created (this takes a few minutes)

### 2. Set Up Environment Variables
Create a `.env.local` file in your project root and add these variables:

```env
# Get these from your Supabase project settings
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

To find these values:
- Go to your Supabase project dashboard
- Click on "Settings" → "API"
- Copy the values from the "Project URL" and "API Keys" sections

### 3. Create Database Schema
1. In your Supabase dashboard, go to "SQL Editor"
2. Copy and paste the contents of `scripts/supabase-schema.sql`
3. Click "Run" to execute the script
4. This will create all necessary tables, functions, and sample data

### 4. Configure MCP Server (Optional)
If you want to use the MCP server integration:

1. Get your personal access token from Supabase:
   - Go to [https://supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens)
   - Create a new token with appropriate permissions

2. Set the environment variable:
   ```bash
   export SUPABASE_ACCESS_TOKEN=your-access-token
   ```

3. The MCP server is already configured in `.cursor/mcp.json`

## 📊 Database Schema

### Tables Created:
- **customers** - Customer information (name, email, phone, notes)
- **bookings** - Reservation data (date, time, guests, status, special requests)
- **booking_settings** - Dashboard configuration (booking rules, availability, messages)
- **contact_messages** - Contact form submissions

### Key Features:
- **Row Level Security (RLS)** enabled for all tables
- **Automatic timestamps** with created_at and updated_at
- **Data validation** with check constraints
- **Optimized indexes** for performance
- **Database functions** for common operations

## 🔧 What's Been Integrated

### ✅ Contact Form
- Now saves messages to `contact_messages` table
- Real-time form validation
- Success/error notifications

### ✅ Booking System
- Customer upsert functionality (create or update)
- Booking validation against settings
- Real-time availability checking
- Status management (pending, confirmed, cancelled)

### ✅ Dashboard
- Live booking statistics
- Real-time data updates
- Customer management
- Booking management with edit/cancel functionality

### ✅ Settings System
- Booking enable/disable
- Time slot management
- Party size limits
- Advance booking limits
- Maintenance mode
- Custom messaging

## 🔄 Database Functions

### Pre-built Functions:
- `upsert_customer()` - Create or update customer records
- `get_booking_settings()` - Retrieve all booking settings
- `update_booking_setting()` - Update individual settings

### Usage Examples:
```sql
-- Create or update a customer
SELECT upsert_customer('John Doe', 'john@example.com', '123-456-7890', 'VIP customer');

-- Get all booking settings
SELECT get_booking_settings();

-- Update a setting
SELECT update_booking_setting('booking_enabled', 'false');
```

## 🔒 Security Features

### Row Level Security (RLS):
- All tables have RLS enabled
- Public access policies for restaurant operations
- Secure data access patterns

### Environment Variables:
- Separate anon key for public operations
- Service role key for admin operations
- Proper key rotation support

## 🎯 Next Steps

### 1. Test the Integration
1. Start your development server: `npm run dev`
2. Try making a reservation through the public form
3. Check the dashboard to see the booking appear
4. Test the contact form
5. Verify all data is being saved to Supabase

### 2. Customize Settings
1. Go to your dashboard → Settings → Bookings
2. Configure your restaurant's specific settings:
   - Available time slots
   - Maximum party size
   - Advance booking limits
   - Custom messages

### 3. Deploy to Production
1. Add environment variables to your hosting platform
2. Deploy your application
3. Update any CORS settings in Supabase if needed

## 📋 Troubleshooting

### Common Issues:

#### Environment Variables Not Found
- Make sure `.env.local` is in your project root
- Restart your development server after adding variables
- Check that variable names match exactly

#### Database Connection Errors
- Verify your Supabase URL and keys are correct
- Check your project is not paused (free tier limitation)
- Ensure your database is accessible

#### MCP Server Issues
- Make sure you have a valid personal access token
- Check the token has the necessary permissions
- Verify the project reference in the MCP configuration

#### Data Not Appearing
- Check the browser console for errors
- Verify the database schema was created correctly
- Test database queries directly in Supabase SQL Editor

## 🔧 Development Tips

### Testing Database Functions:
```sql
-- Test customer creation
SELECT upsert_customer('Test Customer', 'test@example.com', '555-0123');

-- Test booking creation
INSERT INTO bookings (customer_id, date, time, guests, status)
VALUES (
  (SELECT id FROM customers WHERE email = 'test@example.com'),
  '2024-01-15',
  '19:00',
  2,
  'pending'
);
```

### Monitoring Performance:
- Use Supabase's built-in analytics
- Monitor slow queries in the dashboard
- Set up alerts for high usage

### Data Backup:
- Supabase provides automatic backups
- Consider exporting important data regularly
- Test restoration procedures

## 🎉 Success!

Your Dona Theresa restaurant website is now fully integrated with Supabase! You have:
- ✅ Real database storage
- ✅ Complete booking system
- ✅ Customer management
- ✅ Contact form integration
- ✅ Dashboard functionality
- ✅ Settings management
- ✅ Production-ready setup

For any issues or questions, refer to the [Supabase documentation](https://supabase.com/docs) or check the troubleshooting section above. 
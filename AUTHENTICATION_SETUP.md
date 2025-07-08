# Authentication Setup Guide for Dona Theresa Bookings

This guide will help you complete the authentication setup for the dashboard area.

## 🔐 What's Been Implemented

✅ **Next.js Middleware**: Protects dashboard routes and handles session refresh
✅ **Login Page**: Email/password authentication (signup removed)
✅ **Server Actions**: Login and logout functionality
✅ **Dashboard Protection**: Authentication check in dashboard layout
✅ **User Profile System**: Public profiles table linked to auth.users
✅ **Header Integration**: User info display and logout button
✅ **Default Admin User**: Pre-configured admin account

## 🚀 Next Steps

### 1. Environment Variables
Make sure your `.env.local` file contains:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Create Default Admin User
You have several options to create the default admin user:

#### Option A: Using the Setup Script (Recommended)
```bash
node scripts/create-default-admin.js
```

#### Option B: Using the API Route
Start your development server and call:
```bash
npm run dev
# In another terminal:
curl -X POST http://localhost:3000/api/setup-admin
```

#### Option C: Manual Creation in Supabase Dashboard
1. Go to your Supabase dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Add user**
4. Use these credentials:
   - **Email**: `donatheresahatchend@gmail.com`
   - **Password**: `Master002!`
   - **Auto Confirm User**: ✅ Yes

### 3. Supabase Auth Configuration
In your Supabase dashboard:

1. Go to **Authentication** → **Settings**
2. Set your **Site URL** to: `http://localhost:3000` (development) or your production URL
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/confirm` (development)
   - `https://yourdomain.com/auth/confirm` (production)

## 🎯 How to Use

### Login Credentials:
- **Email**: `donatheresahatchend@gmail.com`
- **Password**: `Master002!`

### Steps:
1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/login`
3. Enter the credentials above
4. Click "Sign In"
5. You'll be redirected to `/dashboard`

## 🔒 Security Features

- **Protected Routes**: All `/dashboard/*` routes require authentication
- **Middleware Protection**: Automatic session refresh and route protection
- **Row Level Security**: Database policies ensure users can only access their own data
- **Server-Side Validation**: All authentication logic runs on the server
- **No Signup**: Signup functionality has been disabled for security

## 🛠️ Files Modified/Created

- `middleware.ts` - Route protection and session handling
- `app/login/page.tsx` - Login page (signup removed)
- `app/login/actions.ts` - Server actions for authentication (signup removed)
- `app/auth/confirm/route.ts` - Email confirmation handler
- `app/auth/auth-code-error/page.tsx` - Error page for failed auth
- `app/dashboard/layout.tsx` - Added authentication check
- `components/dashboard/header.tsx` - Added user menu and logout
- `app/api/setup-admin/route.ts` - API route to create default admin
- `scripts/create-default-admin.js` - Script to create default admin
- Database migration for `profiles` table

## 🎉 You're All Set!

The authentication system is now fully implemented with a default admin user. The signup functionality has been removed for security, and only the pre-configured admin account can access the dashboard.

### Default Login Credentials:
- **Email**: `donatheresahatchend@gmail.com`
- **Password**: `Master002!`

Users will be automatically redirected to the login page when accessing dashboard routes without authentication, and the authenticated admin user will see their profile information in the header with a logout option.

## 📧 Memory Note

[[memory:2465475]] The sender email address for the restaurant email system is set to `reservations@donatheresa.com` as per your requirements. 
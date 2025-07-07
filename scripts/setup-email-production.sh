#!/bin/bash

# ===========================================
# DONA THERESA EMAIL SYSTEM - PRODUCTION SETUP
# ===========================================
# This script sets up the complete email system for production use

echo "🚀 SETTING UP EMAIL SYSTEM FOR PRODUCTION"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_error ".env.local file not found"
    echo "Please create .env.local with your Supabase credentials:"
    echo "NEXT_PUBLIC_SUPABASE_URL=your_supabase_url"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key"
    exit 1
fi

print_info "Step 1: Installing dependencies..."
npm install @supabase/supabase-js resend

print_status "Dependencies installed"

print_info "Step 2: Database schema setup"
echo "Please run the following SQL in your Supabase SQL Editor:"
echo ""
echo "👉 Copy and paste: scripts/email-system-schema.sql"
echo ""
echo "This will create:"
echo "  - email_settings table"
echo "  - email_templates table"  
echo "  - email_logs table"
echo "  - email_queue table"
echo "  - Pre-loaded professional email templates"
echo "  - Database functions and triggers"
echo ""

read -p "Press Enter after you've run the SQL schema in Supabase..."

print_info "Step 3: Testing email system..."

# Check if node script exists
if [ ! -f "scripts/email-production-test.js" ]; then
    print_warning "Test script not found, skipping tests"
else
    echo "Running production tests..."
    node scripts/email-production-test.js
fi

print_info "Step 4: Production configuration"
echo ""
echo "🔧 NEXT STEPS - CONFIGURE YOUR EMAIL SYSTEM:"
echo "============================================"
echo ""
echo "1. 📧 GET RESEND API KEY:"
echo "   • Go to https://resend.com"
echo "   • Sign up for free account (100 emails/day free)"
echo "   • Get your API key (starts with 're_')"
echo ""
echo "2. ⚙️ CONFIGURE IN DASHBOARD:"
echo "   • Go to your website /dashboard/settings/email"
echo "   • Click 'Configure Settings'"
echo "   • Paste your Resend API key"
echo "   • Configure email addresses and settings"
echo "   • Save settings"
echo ""
echo "3. ✅ TEST EMAIL DELIVERY:"
echo "   • Make a test booking on your website"
echo "   • Check that confirmation emails are sent"
echo "   • Submit a contact form and verify auto-reply"
echo "   • Check dashboard for email logs"
echo ""
echo "4. 🎯 PRODUCTION FEATURES ENABLED:"
echo "   ✅ Booking confirmation emails"
echo "   ✅ Booking reminder emails (24h before)"
echo "   ✅ Booking cancellation emails"
echo "   ✅ Staff new booking alerts"
echo "   ✅ Contact form auto-replies"
echo "   ✅ Contact form staff notifications"
echo "   ✅ Email analytics and logging"
echo "   ✅ Rate limiting and error handling"
echo ""

print_status "Email system setup complete!"
echo ""
echo "📋 PRODUCTION CHECKLIST:"
echo "========================"
echo "□ Database schema applied"
echo "□ Resend account created"
echo "□ API key configured in dashboard"
echo "□ Test booking made and email received"
echo "□ Contact form tested"
echo "□ Staff email addresses configured"
echo ""
echo "🚀 Once completed, your restaurant will have a professional"
echo "   email system that automatically handles all customer"
echo "   communications!"
echo ""

print_info "Setup script completed. Follow the checklist above to finish configuration." 
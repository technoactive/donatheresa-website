# Booking Reconfirmation System

This system automatically sends reconfirmation emails to large party bookings before their reservation date, helping to reduce no-shows and last-minute cancellations.

## How It Works

1. **Automated Detection**: The system checks daily for upcoming bookings that meet the criteria (party size >= threshold)
2. **Email Sent**: X days before the booking, customer receives an email asking to confirm or cancel
3. **Response Tracking**: Customer can one-click confirm or cancel from the email
4. **No Response Handling**: If no response within the deadline, the system takes action based on your settings

## Setup Instructions

### Step 1: Run the Database Migration

Execute the SQL script in your Supabase SQL Editor:

```
scripts/add-reconfirmation-system.sql
```

This will:
- Add reconfirmation settings columns to `booking_config`
- Add reconfirmation tracking columns to `bookings`
- Create necessary database functions
- Insert email templates

### Step 2: Configure Settings in Dashboard

Go to **Dashboard → Settings → Booking Settings** and scroll to the "Reconfirmation System" section.

Configure:
- **Enable/Disable**: Toggle the system on or off
- **Minimum Party Size**: Only parties with this many guests or more will receive reconfirmation requests (default: 6)
- **Days Before Booking**: When to send the reconfirmation email (default: 2 days before)
- **Response Deadline**: How long customers have to respond (default: 24 hours)
- **No Response Action**:
  - **Flag for manual follow-up**: You'll get a notification to call the customer (safest option)
  - **Send second reminder**: Send another email, then flag if still no response
  - **Auto-cancel booking**: Automatically cancel if no response (most aggressive)

### Step 3: Set Up Cron Jobs

The system requires two cron jobs to function:

#### 1. Send Reconfirmation Emails (Daily at 9 AM)
```
GET /api/cron/send-reconfirmations
Schedule: 0 9 * * * (every day at 9 AM)
```

#### 2. Process Expired Reconfirmations (Hourly)
```
GET /api/cron/process-reconfirmations
Schedule: 0 * * * * (every hour)
```

**For Vercel Projects**, add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/send-reconfirmations",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/process-reconfirmations",
      "schedule": "0 * * * *"
    }
  ]
}
```

**Optional Security**: Add a `CRON_SECRET` environment variable and pass it as Bearer token to secure the endpoints.

## Customer Experience

### Reconfirmation Email
- Clear, mobile-friendly design
- Shows booking details (date, time, party size)
- Prominent "Yes, I'm Coming!" button (green)
- Smaller "Cancel My Booking" option
- Deadline warning

### Reconfirmation Page (`/reconfirm-booking?token=xxx`)
- Shows full booking details
- One-click confirm or cancel
- Success/error states
- Link to make new booking if cancelled

## Staff Notifications

The system creates notifications for:
- **Reconfirmation Sent**: When a reconfirmation email is sent
- **Booking Confirmed**: When customer confirms via the link
- **Booking Cancelled**: When customer cancels via the link
- **No Response**: When deadline expires and manual follow-up is needed
- **Auto-Cancelled**: When a booking is auto-cancelled due to no response

## Database Schema Changes

### booking_config (new columns)
| Column | Type | Default | Description |
|--------|------|---------|-------------|
| reconfirmation_enabled | BOOLEAN | false | Enable/disable the system |
| reconfirmation_min_party_size | INTEGER | 6 | Minimum guests to trigger |
| reconfirmation_days_before | INTEGER | 2 | Days before booking to send |
| reconfirmation_deadline_hours | INTEGER | 24 | Hours to respond |
| reconfirmation_no_response_action | TEXT | 'flag_only' | Action on no response |

### bookings (new columns)
| Column | Type | Description |
|--------|------|-------------|
| reconfirmation_status | TEXT | 'not_required', 'pending', 'sent', 'reminder_sent', 'confirmed', 'no_response', 'auto_cancelled' |
| reconfirmation_sent_at | TIMESTAMP | When reconfirmation email was sent |
| reconfirmation_responded_at | TIMESTAMP | When customer responded |
| reconfirmation_token | UUID | Unique token for one-click actions |
| reconfirmation_deadline | TIMESTAMP | When response is due |
| reconfirmation_reminder_count | INTEGER | Number of reminders sent |

## Email Templates

Two email templates are created:

1. **booking_reconfirmation_request** - Initial reconfirmation email
2. **booking_reconfirmation_reminder** - Urgent second reminder

You can customize these in **Dashboard → Settings → Email → Templates**.

## API Endpoints

### Public
- `GET /api/reconfirm-booking?token=xxx` - Get booking details by token
- `POST /api/reconfirm-booking` - Confirm or cancel booking

### Cron (Admin)
- `GET /api/cron/send-reconfirmations` - Send daily reconfirmation emails
- `GET /api/cron/process-reconfirmations` - Process expired reconfirmations

## Recommended Settings by Scenario

### Conservative (Start Here)
- Min Party Size: 8+
- Days Before: 3
- Deadline: 24 hours
- No Response: Flag for manual follow-up

### Balanced
- Min Party Size: 6+
- Days Before: 2
- Deadline: 24 hours
- No Response: Send second reminder

### Aggressive (High No-Show Rate)
- Min Party Size: 5+
- Days Before: 2
- Deadline: 12 hours
- No Response: Auto-cancel

## Troubleshooting

### Emails not sending
1. Check email service is configured (Dashboard → Settings → Email)
2. Verify cron job is running (check Vercel logs)
3. Check `email_logs` table for errors

### Customers not receiving emails
1. Check spam folder
2. Verify email address is correct
3. Check `email_logs` for delivery status

### Bookings not being flagged/cancelled
1. Ensure `reconfirmation_enabled` is true
2. Check cron jobs are running
3. Verify booking meets party size threshold

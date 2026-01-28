# Deposit System - Technical Documentation

## Overview

The Dona Theresa deposit system uses **Stripe Payment Intents with manual capture** to securely collect and manage booking deposits. This document covers the implementation, security measures, and operational procedures.

---

## 🔒 Security Features

### Authentication & Authorization
- ✅ All admin API routes (`capture`, `cancel`, `refund`) require authenticated Supabase session
- ✅ Webhook endpoint verifies Stripe signature using `STRIPE_WEBHOOK_SECRET`
- ✅ UUID validation on all booking IDs to prevent injection attacks
- ✅ Input validation on amounts (minimum £0.50, maximum £500)

### Idempotency
- ✅ All Stripe operations use idempotency keys to prevent duplicate charges
- ✅ Database updates use optimistic locking (status checks) to prevent race conditions

### Audit Trail
- ✅ All transactions logged to `deposit_transactions` table
- ✅ Logs include: user email, IP address, timestamp, action type, reason
- ✅ Stripe IDs stored for reconciliation (payment_intent_id, charge_id, refund_id)

### Error Handling
- ✅ Generic error messages to users (no Stripe internal details exposed)
- ✅ Detailed errors logged server-side for debugging
- ✅ Specific handling for common Stripe errors (expired auth, already captured, etc.)

---

## 💳 Deposit Status Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DEPOSIT LIFECYCLE                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│    ┌──────┐     ┌─────────┐     ┌────────────┐                     │
│    │ none │ ──► │ pending │ ──► │ authorized │                     │
│    └──────┘     └─────────┘     └────────────┘                     │
│                       │               │                             │
│                       │               ├──────────────────────┐      │
│                       │               │                      │      │
│                       ▼               ▼                      ▼      │
│                  ┌────────┐     ┌───────────┐          ┌─────────┐ │
│                  │ failed │     │ cancelled │          │ expired │ │
│                  └────────┘     └───────────┘          └─────────┘ │
│                                       │                             │
│                                       │                             │
│                                       ▼                             │
│                              ┌──────────┐                          │
│                              │ captured │                          │
│                              └──────────┘                          │
│                                    │                                │
│                       ┌────────────┼────────────┐                  │
│                       │            │            │                  │
│                       ▼            ▼            ▼                  │
│              ┌──────────┐  ┌───────────────┐  (remains            │
│              │ refunded │  │ partially_    │   captured)          │
│              │  (full)  │  │   refunded    │                      │
│              └──────────┘  └───────────────┘                      │
│                                    │                                │
│                                    ▼                                │
│                            ┌──────────┐                            │
│                            │ refunded │                            │
│                            │  (full)  │                            │
│                            └──────────┘                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Status Descriptions

| Status | Description | Customer Charged? |
|--------|-------------|-------------------|
| `none` | No deposit required | No |
| `pending` | Payment form shown, waiting for customer | No |
| `authorized` | Card authorized, hold placed | No (hold only) |
| `captured` | Deposit charged (no-show) | **Yes** |
| `cancelled` | Authorization released (guest attended) | No |
| `refunded` | Full amount returned | Refunded |
| `partially_refunded` | Partial amount returned | Partially refunded |
| `expired` | Authorization expired after 7 days | No |
| `failed` | Payment failed (declined, etc.) | No |

---

## 🛠 API Endpoints

### Public Endpoints

#### `POST /api/stripe/create-payment-intent`
Creates a payment intent for deposit collection.

**Request:**
```json
{
  "bookingId": "uuid",
  "amount": 2000,
  "partySize": 6,
  "customerEmail": "guest@example.com",
  "customerName": "John Smith",
  "bookingDate": "2024-03-15",
  "bookingTime": "19:00"
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

### Admin Endpoints (Authenticated)

#### `POST /api/stripe/capture-deposit`
Charges the authorized deposit (for no-shows).

**Request:**
```json
{
  "bookingId": "uuid",
  "reason": "No-show"
}
```

#### `POST /api/stripe/cancel-deposit`
Releases the authorization (guest attended).

**Request:**
```json
{
  "bookingId": "uuid",
  "reason": "Guest attended"
}
```

#### `POST /api/stripe/refund-deposit`
Refunds a captured deposit (full or partial).

**Request:**
```json
{
  "bookingId": "uuid",
  "amount": 1000,
  "reason": "Partial refund - service issue"
}
```

### Webhook Endpoint

#### `POST /api/stripe/webhooks`
Receives Stripe events. Must be configured in Stripe Dashboard.

**Handled Events:**
- `payment_intent.succeeded` - Marks as authorized
- `payment_intent.payment_failed` - Marks as failed
- `payment_intent.canceled` - Marks as cancelled
- `payment_intent.amount_capturable_updated` - Confirms authorization
- `charge.captured` - Confirms capture
- `charge.refunded` - Updates refund status

---

## 🔧 Environment Variables

```bash
# Required
STRIPE_SECRET_KEY=sk_live_xxx          # Stripe secret key
STRIPE_PUBLISHABLE_KEY=pk_live_xxx     # Stripe publishable key
STRIPE_WEBHOOK_SECRET=whsec_xxx        # Webhook signing secret

# Optional
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx  # For client-side
```

---

## 📊 Database Schema

### booking_config (deposit settings)
```sql
deposit_enabled BOOLEAN DEFAULT false
deposit_min_party_size INTEGER DEFAULT 6
deposit_amount_per_person INTEGER DEFAULT 1000  -- pence
deposit_cancellation_hours INTEGER DEFAULT 48
deposit_late_cancel_charge_percent INTEGER DEFAULT 100
```

### bookings (deposit fields)
```sql
deposit_required BOOLEAN DEFAULT false
deposit_amount INTEGER
stripe_payment_intent_id TEXT
deposit_status TEXT  -- see statuses above
deposit_captured_at TIMESTAMP
deposit_refunded_at TIMESTAMP
deposit_refund_amount INTEGER DEFAULT 0
```

### deposit_transactions (audit log)
```sql
id UUID PRIMARY KEY
booking_id UUID
stripe_payment_intent_id TEXT
stripe_charge_id TEXT
stripe_refund_id TEXT
amount INTEGER NOT NULL
action TEXT NOT NULL  -- created, authorized, captured, etc.
reason TEXT
performed_by TEXT NOT NULL  -- user email or 'system'
metadata JSONB
created_at TIMESTAMP
```

---

## 🚨 Important Notes

### Authorization Expiration
Stripe authorizations **expire after 7 days**. If you don't capture within this window:
- The hold is automatically released
- You cannot charge the customer
- Status should be marked as `expired`

**Recommendation:** Run the `check_expired_deposit_authorizations()` function daily.

### Minimum Amounts
- Stripe minimum for GBP: **£0.50 (50 pence)**
- Our system enforces this on all operations

### Refund Timeline
- Refunds take **5-10 business days** to appear on customer statements
- Inform customers of this delay

### PCI Compliance
- Card details never touch our servers
- All payment processing via Stripe Elements
- Payment Intent uses manual capture for pre-authorization

---

## 🔄 Webhook Setup in Stripe Dashboard

1. Go to Developers → Webhooks
2. Add endpoint: `https://donatheresa.com/api/stripe/webhooks`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
   - `payment_intent.amount_capturable_updated`
   - `charge.captured`
   - `charge.refunded`
   - `charge.dispute.created`
4. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

---

## 📋 Operational Checklist

### Before Going Live
- [ ] Set `STRIPE_SECRET_KEY` (live key, not test)
- [ ] Set `STRIPE_WEBHOOK_SECRET`
- [ ] Test all flows in Stripe test mode first
- [ ] Run database migrations
- [ ] Configure webhook in Stripe Dashboard

### Daily Operations
- [ ] Review `deposit_transactions` for any failures
- [ ] Check for expired authorizations
- [ ] Monitor Stripe Dashboard for disputes

### After No-Show
1. Find booking in dashboard
2. Click "No-Show" button
3. Confirm capture
4. Customer is charged

### After Guest Attends
1. Find booking in dashboard
2. Click "Guest Attended" button
3. Confirm release
4. Customer is NOT charged

---

## 🐛 Troubleshooting

### "Authorization has expired"
The 7-day window has passed. Cannot charge. Status will be `expired`.

### "Deposit already captured"
Someone already captured this deposit. Check `deposit_transactions` log.

### "Cannot refund - not captured"
For uncaptured authorizations, use "Release Authorization" not "Refund".

### Webhook not receiving events
1. Check webhook URL is correct
2. Verify signing secret matches
3. Check Stripe Dashboard for failed deliveries

---

## 📞 Support

For technical issues with the deposit system, check:
1. `deposit_transactions` table for audit trail
2. Stripe Dashboard → Payments for payment status
3. Server logs for detailed error messages

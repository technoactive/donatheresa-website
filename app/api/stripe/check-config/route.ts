import { NextResponse } from 'next/server'

export async function GET() {
  // Check if Stripe keys are configured
  const hasSecretKey = !!process.env.STRIPE_SECRET_KEY
  const hasPublishableKey = !!process.env.STRIPE_PUBLISHABLE_KEY
  
  return NextResponse.json({
    configured: hasSecretKey && hasPublishableKey,
    hasSecretKey,
    hasPublishableKey
  })
}

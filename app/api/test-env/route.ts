import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@/lib/supabase/server';

// Helper function to add delay between requests to respect rate limits
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET() {
  try {
    console.log('⏰ SENDING BOOKING REMINDER TEMPLATES...');
    
    // Recipients
    const recipients = [
      { name: 'Technoactive', email: 'info@technoactive.co.uk' },
      { name: 'David Serediuc', email: 'serediuc.david@gmail.com' }
    ];

    // Get email settings
    const supabase = await createClient();
    const { data: settings } = await supabase
      .from('email_settings')
      .select('*')
      .eq('user_id', 'admin')
      .single();

    if (!settings) {
      return NextResponse.json({ success: false, error: 'No settings found' });
    }

    // Import email service
    const { emailService } = await import('@/lib/email/email-service');

    const results: any = {};

    // Send booking reminder to both recipients
    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      console.log(`Sending booking reminder to: ${recipient.email}`);
      
      if (i > 0) await delay(1000); // Rate limiting
      
      const reminderData = {
        customerName: recipient.name,
        bookingDate: 'Saturday, 22nd February 2025',
        bookingTime: '7:30 PM',
        partySize: 4,
        guestText: 'guests',
        bookingId: `${settings.booking_ref_prefix}-${String(500001 + i).padStart(settings.booking_ref_length, '0')}`,
        restaurantName: 'Dona Theresa Restaurant',
        restaurantPhone: '+44 20 8866 3131',
        restaurantEmail: 'info@donatheresa.com',
        restaurantAddress: '451 Uxbridge Road, Pinner, London HA5 1AA',
        brandColor: settings.brand_color
        // customFooter is now auto-generated from locale settings
      };

      const result = await emailService.sendEmail({
        templateKey: 'booking_reminder',
        recipientEmail: recipient.email,
        recipientName: recipient.name,
        data: reminderData
      });

      if (result.success) {
        console.log(`✅ Booking reminder sent to ${recipient.email}`);
        results[`booking_reminder_${recipient.email}`] = '✅ Sent successfully';
      } else {
        console.error(`❌ Failed to send to ${recipient.email}:`, result.error);
        results[`booking_reminder_${recipient.email}`] = `❌ ${result.error}`;
      }
    }

    return NextResponse.json({
      success: true,
      message: '⏰ BOOKING REMINDER TEMPLATES SENT!',
      details: {
        template_sent: 'booking_reminder',
        template_design: 'Beautiful green gradient with friendly reminder styling',
        recipients: recipients.map(r => r.email),
        sender_email: settings.sender_email,
        results: results,
        note: 'Check both inboxes for the proper booking reminder emails with green design!'
      }
    });

  } catch (error) {
    console.error('❌ Booking reminder test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Booking reminder test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 
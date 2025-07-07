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

    // Import robust email service
    const { robustEmailService } = await import('@/lib/email/robust-email-service');

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
        // Remove hardcoded restaurant details - these will be pulled from settings dynamically
        brandColor: settings.brand_color
        // customFooter is now auto-generated from locale settings
      };

      const result = await robustEmailService.sendEmailRobust({
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipients, templateType = 'booking_confirmation', testData } = body;

    console.log(`📧 SENDING ${templateType.toUpperCase()} TEST EMAIL...`);

    // Get email settings
    const supabase = await createClient();
    const { data: settings } = await supabase
      .from('email_settings')
      .select('*')
      .eq('user_id', 'admin')
      .single();

    if (!settings) {
      return NextResponse.json({ success: false, error: 'No email settings found' });
    }

    // Import robust email service
    const { robustEmailService } = await import('@/lib/email/robust-email-service');

    const results: any = {};

    // Default test data if none provided - removed hardcoded restaurant details
    const defaultTestData = {
      customerName: 'David Serediuc',
      bookingId: 'DT-TEST-001',
      bookingDate: 'Monday, 8th July 2025',
      bookingTime: '7:30 PM',
      partySize: 2,
      guestText: 'guests',
      specialRequests: 'Window table please',
      brandColor: '#1e3a8a' // Fixed navy blue
      // Restaurant details are now pulled dynamically from email settings
    };

    const emailData = { ...defaultTestData, ...testData };

    // Send emails to all recipients
    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      console.log(`Sending ${templateType} to: ${recipient.email}`);
      
      if (i > 0) await delay(1000); // Rate limiting

      const result = await robustEmailService.sendEmailRobust({
        templateKey: templateType,
        recipientEmail: recipient.email,
        recipientName: recipient.name,
        data: {
          ...emailData,
          customerName: recipient.name // Use recipient name for personalization
        }
      });

      if (result.success) {
        console.log(`✅ ${templateType} sent to ${recipient.email}`);
        results[`${templateType}_${recipient.email}`] = '✅ Sent successfully';
      } else {
        console.error(`❌ Failed to send to ${recipient.email}:`, result.error);
        results[`${templateType}_${recipient.email}`] = `❌ ${result.error}`;
      }
    }

    // Template-specific messages
    const templateMessages = {
      booking_confirmation: {
        message: '✨ BOOKING CONFIRMATION TEMPLATES SENT!',
        design: 'Beautiful navy blue gradient with clear reservation details',
        note: 'Check both inboxes for the fixed booking confirmation emails with perfect readability!'
      },
      booking_reminder: {
        message: '⏰ BOOKING REMINDER TEMPLATES SENT!',
        design: 'Beautiful green gradient with friendly reminder styling',
        note: 'Check both inboxes for the booking reminder emails!'
      },
      staff_new_booking: {
        message: '🔔 STAFF BOOKING ALERT TEMPLATES SENT!',
        design: 'Purple gradient with staff notification styling',
        note: 'Check both inboxes for the staff booking alert emails!'
      }
    };

    const templateInfo = templateMessages[templateType as keyof typeof templateMessages] || templateMessages.booking_confirmation;

    return NextResponse.json({
      success: true,
      message: templateInfo.message,
      details: {
        template_sent: templateType,
        template_design: templateInfo.design,
        recipients: recipients.map((r: any) => r.email),
        sender_email: settings.sender_email,
        test_data: emailData,
        results: results,
        note: templateInfo.note
      }
    });

  } catch (error) {
    console.error('❌ Email template test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Email template test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    console.log('🔍 Starting email system diagnostic...');
    
    // Test 1: Check Supabase connection
    console.log('1. Testing Supabase connection...');
    const supabase = await createClient();
    
    // Test 2: Retrieve email settings
    console.log('2. Retrieving email settings...');
    const { data: settings, error: settingsError } = await supabase
      .from('email_settings')
      .select('*')
      .eq('user_id', 'admin')
      .single();

    if (settingsError) {
      console.error('❌ Settings error:', settingsError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to retrieve email settings',
        details: settingsError 
      });
    }

    if (!settings) {
      console.error('❌ No email settings found');
      return NextResponse.json({ 
        success: false, 
        error: 'No email settings found' 
      });
    }

    console.log('✅ Email settings retrieved:', {
      provider: settings.email_provider,
      sender_email: settings.sender_email,
      sender_name: settings.sender_name,
      api_key_length: settings.api_key_encrypted?.length || 0,
      booking_confirmation_enabled: settings.booking_confirmation_enabled
    });

    // Test 3: Check API key format
    console.log('3. Checking API key...');
    if (!settings.api_key_encrypted) {
      console.error('❌ No API key configured');
      return NextResponse.json({ 
        success: false, 
        error: 'No API key configured' 
      });
    }

    if (!settings.api_key_encrypted.startsWith('re_')) {
      console.error('❌ API key format incorrect');
      return NextResponse.json({ 
        success: false, 
        error: 'API key format incorrect - should start with re_' 
      });
    }

    console.log('✅ API key format looks correct');

    // Test 4: Initialize Resend
    console.log('4. Initializing Resend...');
    const resend = new Resend(settings.api_key_encrypted);
    console.log('✅ Resend initialized');

    // Test 5: Get email template
    console.log('5. Getting email template...');
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('template_key', 'booking_confirmation')
      .eq('is_active', true)
      .single();

    if (templateError || !template) {
      console.error('❌ Template error:', templateError);
      return NextResponse.json({ 
        success: false, 
        error: 'Booking confirmation template not found',
        details: templateError 
      });
    }

    console.log('✅ Template retrieved:', {
      name: template.name,
      subject: template.subject
    });

    // Test 6: Send test email
    console.log('6. Sending test email...');
    
    const testEmailData = {
      from: `${settings.sender_name} <${settings.sender_email}>`,
      to: ['delivered@resend.dev'], // Resend's official testing email
      subject: 'Email System Test - Dona Theresa',
      html: `
        <h1>Email System Test</h1>
        <p>This is a test email from your Dona Theresa restaurant booking system.</p>
        <p>If you receive this, your email system is working correctly!</p>
        <p>Sent at: ${new Date().toISOString()}</p>
        <br>
        <p><strong>Settings Summary:</strong></p>
        <ul>
          <li>Provider: ${settings.email_provider}</li>
          <li>Sender: ${settings.sender_email}</li>
          <li>Booking confirmations: ${settings.booking_confirmation_enabled ? 'Enabled' : 'Disabled'}</li>
          <li>Staff alerts: ${settings.staff_booking_alerts ? 'Enabled' : 'Disabled'}</li>
        </ul>
      `,
      text: 'Email System Test - If you receive this, your email system is working!'
    };

    console.log('📧 Sending with data:', {
      from: testEmailData.from,
      to: testEmailData.to,
      subject: testEmailData.subject
    });

    const result = await resend.emails.send(testEmailData);

    if (result.error) {
      console.error('❌ Resend API error:', result.error);
      return NextResponse.json({ 
        success: false, 
        error: 'Resend API error',
        details: result.error,
        apiKeyPreview: `${settings.api_key_encrypted.substring(0, 8)}...`
      });
    }

    console.log('✅ Test email sent successfully!', result.data);

    // Test 7: Simple direct booking confirmation test
    console.log('7. Testing simple booking email...');
    
    try {
      // Test direct Resend call with booking-like content
      const simpleBookingEmailData = {
        from: `${settings.sender_name} <${settings.sender_email}>`,
        to: ['delivered@resend.dev'],
        subject: 'Booking Confirmation Test - Dona Theresa',
        html: `
          <h1>Booking Confirmed!</h1>
          <p>Thank you for your reservation at Dona Theresa Restaurant.</p>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
            <h3>Reservation Details</h3>
            <p><strong>Name:</strong> Test Customer</p>
            <p><strong>Date:</strong> January 15, 2025</p>
            <p><strong>Time:</strong> 7:30 PM</p>
            <p><strong>Party Size:</strong> 2 guests</p>
            <p><strong>Booking Reference:</strong> test-booking-123</p>
          </div>
          <p>We look forward to seeing you!</p>
        `,
        text: 'Your booking at Dona Theresa Restaurant has been confirmed for January 15, 2025 at 7:30 PM for 2 guests.'
      };

      console.log('📧 Sending simple booking email...');
      const simpleResult = await resend.emails.send(simpleBookingEmailData);

      if (simpleResult.error) {
        console.error('❌ Simple booking email failed:', simpleResult.error);
        return NextResponse.json({
          success: false,
          error: 'Simple booking email test failed',
          details: simpleResult.error
        });
      }

      console.log('✅ Simple booking email sent successfully!', simpleResult.data);
    } catch (simpleEmailError) {
      console.error('❌ Simple booking email error:', simpleEmailError);
      return NextResponse.json({
        success: false,
        error: 'Simple booking email test failed',
        details: {
          error_message: simpleEmailError instanceof Error ? simpleEmailError.message : 'Unknown error',
          error_name: simpleEmailError instanceof Error ? simpleEmailError.name : 'Unknown'
        }
      });
    }

    // Test 8: Check email templates count
    const { data: templatesCount } = await supabase
      .from('email_templates')
      .select('template_key', { count: 'exact' })
      .eq('is_active', true);

    return NextResponse.json({
      success: true,
      message: 'Email system diagnostic completed successfully!',
      details: {
        supabase_connection: '✅ Connected',
        email_settings: '✅ Retrieved',
        api_key: '✅ Valid format',
        resend_initialization: '✅ Success',
        template_retrieval: '✅ Success',
        test_email: '✅ Sent',
        booking_confirmation_email: '✅ Sent',
        resend_message_id: result.data?.id,
        active_templates: templatesCount?.length || 0,
        settings_summary: {
          provider: settings.email_provider,
          sender: settings.sender_email,
          confirmations_enabled: settings.booking_confirmation_enabled,
          staff_alerts_enabled: settings.staff_booking_alerts
        }
      }
    });

  } catch (error) {
    console.error('❌ Diagnostic failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Email system diagnostic failed',
      details: {
        error_message: error instanceof Error ? error.message : 'Unknown error',
        error_name: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : undefined
      }
    });
  }
} 
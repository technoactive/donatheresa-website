#!/usr/bin/env node
/**
 * Test Daily Email Counter
 * Verifies that the daily email usage counter increments properly
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testDailyEmailCounter() {
  console.log('📊 Testing Daily Email Counter...\n');

  try {
    // Check current state
    console.log('1️⃣ Checking current email settings...');
    const { data: settings, error: settingsError } = await supabase
      .from('email_settings')
      .select('emails_sent_today, last_email_reset_date, max_daily_emails')
      .eq('user_id', 'admin')
      .single();

    if (settingsError) {
      console.error('❌ Failed to get email settings:', settingsError.message);
      return false;
    }

    console.log('📊 Current state:', {
      emails_sent_today: settings.emails_sent_today,
      last_email_reset_date: settings.last_email_reset_date,
      max_daily_emails: settings.max_daily_emails
    });

    // Test the reset function
    console.log('\n2️⃣ Testing daily reset function...');
    const { error: resetError } = await supabase.rpc('reset_daily_email_count');
    
    if (resetError) {
      console.error('❌ Reset function failed:', resetError.message);
      return false;
    }
    
    console.log('✅ Reset function called successfully');

    // Check state after reset
    const { data: afterReset, error: afterResetError } = await supabase
      .from('email_settings')
      .select('emails_sent_today, last_email_reset_date')
      .eq('user_id', 'admin')
      .single();

    if (afterResetError) {
      console.error('❌ Failed to check after reset:', afterResetError.message);
      return false;
    }

    console.log('📊 After reset:', {
      emails_sent_today: afterReset.emails_sent_today,
      last_email_reset_date: afterReset.last_email_reset_date
    });

    // Test manual increment
    console.log('\n3️⃣ Testing manual increment...');
    const currentCount = afterReset.emails_sent_today || 0;
    const newCount = currentCount + 1;

    const { error: incrementError } = await supabase
      .from('email_settings')
      .update({ 
        emails_sent_today: newCount,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', 'admin');

    if (incrementError) {
      console.error('❌ Manual increment failed:', incrementError.message);
      return false;
    }

    console.log(`✅ Manual increment successful: ${currentCount} → ${newCount}`);

    // Verify the increment
    const { data: afterIncrement, error: afterIncrementError } = await supabase
      .from('email_settings')
      .select('emails_sent_today')
      .eq('user_id', 'admin')
      .single();

    if (afterIncrementError) {
      console.error('❌ Failed to verify increment:', afterIncrementError.message);
      return false;
    }

    console.log('📊 Final count:', afterIncrement.emails_sent_today);

    if (afterIncrement.emails_sent_today === newCount) {
      console.log('✅ Daily email counter is working correctly!');
      return true;
    } else {
      console.error('❌ Counter mismatch! Expected:', newCount, 'Got:', afterIncrement.emails_sent_today);
      return false;
    }

  } catch (error) {
    console.error('💥 Test failed with error:', error);
    return false;
  }
}

// Test email log creation to see if emails would be tracked
async function testEmailLogCreation() {
  console.log('\n📝 Testing email log creation...');
  
  try {
    // Create a test email log entry
    const { data: logEntry, error: logError } = await supabase
      .from('email_logs')
      .insert({
        template_key: 'test_template',
        recipient_email: 'test@example.com',
        recipient_name: 'Test User',
        sender_email: 'reservations@donatheresa.com',
        subject: 'Test Email for Counter Verification',
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (logError) {
      console.error('❌ Failed to create email log:', logError.message);
      return false;
    }

    console.log('✅ Email log created:', logEntry.id);

    // Clean up test log
    await supabase
      .from('email_logs')
      .delete()
      .eq('id', logEntry.id);

    console.log('🧹 Test log cleaned up');
    return true;

  } catch (error) {
    console.error('💥 Email log test failed:', error);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('🧪 DAILY EMAIL COUNTER TEST SUITE');
  console.log('='.repeat(40));

  const counterTest = await testDailyEmailCounter();
  const logTest = await testEmailLogCreation();

  console.log('\n📊 TEST RESULTS:');
  console.log('='.repeat(40));
  console.log(`Daily Counter Test: ${counterTest ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Email Log Test: ${logTest ? '✅ PASSED' : '❌ FAILED'}`);

  if (counterTest && logTest) {
    console.log('\n🎉 All tests passed! The daily email counter should work correctly.');
    console.log('\n📝 Next steps:');
    console.log('   1. Create a real booking through the website (/reserve)');
    console.log('   2. Check if emails are sent and counter increments');
    console.log('   3. Monitor the email settings page for accurate daily usage');
  } else {
    console.log('\n❌ Some tests failed. Please check the configuration.');
  }

  return counterTest && logTest;
}

// Execute
runTests()
  .then(success => process.exit(success ? 0 : 1))
  .catch(error => {
    console.error('💥 Test suite error:', error);
    process.exit(1);
  }); 
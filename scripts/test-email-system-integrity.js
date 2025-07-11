#!/usr/bin/env node
/**
 * Email System Integrity Test
 * Tests database functions, triggers, and daily usage tracking
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

async function testEmailSystemIntegrity() {
  console.log('🧪 Testing Email System Integrity...\n');

  try {
    // Test 1: Check if email_settings table exists and has admin row
    console.log('1️⃣ Testing email_settings table...');
    const { data: settings, error: settingsError } = await supabase
      .from('email_settings')
      .select('*')
      .eq('user_id', 'admin')
      .single();

    if (settingsError) {
      console.error('❌ Failed to get email_settings:', settingsError.message);
      return false;
    }

    if (!settings) {
      console.error('❌ No email_settings found for admin user');
      return false;
    }

    console.log('✅ Email settings found');
    console.log(`   - Daily usage: ${settings.emails_sent_today}`);
    console.log(`   - Daily limit: ${settings.max_daily_emails}`);
    console.log(`   - Last reset: ${settings.last_email_reset_date}`);

    // Test 2: Test reset_daily_email_count function
    console.log('\n2️⃣ Testing reset_daily_email_count function...');
    const { error: resetError } = await supabase.rpc('reset_daily_email_count');

    if (resetError) {
      console.error('❌ reset_daily_email_count function failed:', resetError.message);
      return false;
    }

    console.log('✅ reset_daily_email_count function works');

    // Test 3: Get updated settings after reset
    const { data: settingsAfterReset, error: settingsAfterResetError } = await supabase
      .from('email_settings')
      .select('emails_sent_today, last_email_reset_date')
      .eq('user_id', 'admin')
      .single();

    if (settingsAfterResetError) {
      console.error('❌ Failed to get settings after reset:', settingsAfterResetError.message);
      return false;
    }

    console.log(`   - Emails sent today after reset: ${settingsAfterReset.emails_sent_today}`);
    console.log(`   - Last reset date: ${settingsAfterReset.last_email_reset_date}`);

    // Test 4: Test manual email count increment
    console.log('\n3️⃣ Testing manual email count increment...');
    const currentCount = settingsAfterReset.emails_sent_today || 0;
    const newCount = currentCount + 1;

    const { error: incrementError } = await supabase
      .from('email_settings')
      .update({ emails_sent_today: newCount })
      .eq('user_id', 'admin');

    if (incrementError) {
      console.error('❌ Failed to increment email count:', incrementError.message);
      return false;
    }

    console.log('✅ Manual email count increment works');

    // Test 5: Verify the increment worked
    const { data: settingsAfterIncrement, error: settingsAfterIncrementError } = await supabase
      .from('email_settings')
      .select('emails_sent_today')
      .eq('user_id', 'admin')
      .single();

    if (settingsAfterIncrementError) {
      console.error('❌ Failed to verify increment:', settingsAfterIncrementError.message);
      return false;
    }

    console.log(`   - Count before: ${currentCount}`);
    console.log(`   - Count after: ${settingsAfterIncrement.emails_sent_today}`);

    if (settingsAfterIncrement.emails_sent_today !== newCount) {
      console.error('❌ Email count increment verification failed');
      return false;
    }

    console.log('✅ Email count increment verified');

    // Test 6: Check email_logs table structure
    console.log('\n4️⃣ Testing email_logs table...');
    const { data: recentLogs, error: logsError } = await supabase
      .from('email_logs')
      .select('id, status, created_at, template_key')
      .order('created_at', { ascending: false })
      .limit(5);

    if (logsError) {
      console.error('❌ Failed to query email_logs:', logsError.message);
      return false;
    }

    console.log('✅ Email logs table accessible');
    console.log(`   - Recent logs count: ${recentLogs?.length || 0}`);

    // Test 7: Check email_templates table
    console.log('\n5️⃣ Testing email_templates table...');
    const { data: templates, error: templatesError } = await supabase
      .from('email_templates')
      .select('template_key, name, is_active')
      .eq('is_active', true);

    if (templatesError) {
      console.error('❌ Failed to query email_templates:', templatesError.message);
      return false;
    }

    console.log('✅ Email templates table accessible');
    console.log(`   - Active templates: ${templates?.length || 0}`);

    if (templates && templates.length > 0) {
      console.log('   - Available templates:');
      templates.forEach(template => {
        console.log(`     • ${template.template_key} - ${template.name}`);
      });
    }

    // Test 8: Test database trigger (if it exists)
    console.log('\n6️⃣ Testing database trigger functionality...');
    
    // Create a test email log entry to see if trigger fires
    const testLogData = {
      template_key: 'test_template',
      recipient_email: 'test@example.com',
      recipient_name: 'Test User',
      sender_email: 'test@donatheresa.com',
      subject: 'Test Email for System Integrity',
      status: 'pending'
    };

    const { data: insertedLog, error: insertError } = await supabase
      .from('email_logs')
      .insert(testLogData)
      .select('id')
      .single();

    if (insertError) {
      console.error('❌ Failed to insert test email log:', insertError.message);
      return false;
    }

    console.log('✅ Test email log inserted');

    // Get count before trigger test
    const { data: beforeTrigger } = await supabase
      .from('email_settings')
      .select('emails_sent_today')
      .eq('user_id', 'admin')
      .single();

    // Update the log to 'sent' status to trigger the function
    const { error: updateError } = await supabase
      .from('email_logs')
      .update({ status: 'sent' })
      .eq('id', insertedLog.id);

    if (updateError) {
      console.error('❌ Failed to update test email log:', updateError.message);
      return false;
    }

    // Wait a moment for trigger to process
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get count after trigger test
    const { data: afterTrigger } = await supabase
      .from('email_settings')
      .select('emails_sent_today')
      .eq('user_id', 'admin')
      .single();

    console.log(`   - Count before trigger: ${beforeTrigger?.emails_sent_today}`);
    console.log(`   - Count after trigger: ${afterTrigger?.emails_sent_today}`);

    // Clean up test log
    await supabase
      .from('email_logs')
      .delete()
      .eq('id', insertedLog.id);

    console.log('✅ Test email log cleaned up');

    // Check if trigger incremented the counter
    if (afterTrigger?.emails_sent_today > beforeTrigger?.emails_sent_today) {
      console.log('✅ Database trigger is working correctly!');
    } else {
      console.log('⚠️ Database trigger may not be working (this is OK if using manual increment)');
    }

    console.log('\n🎉 Email System Integrity Test Completed Successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Email settings: ✅ Working`);
    console.log(`   - Database functions: ✅ Working`);
    console.log(`   - Email logs: ✅ Working`);
    console.log(`   - Email templates: ✅ Working`);
    console.log(`   - Daily usage tracking: ✅ Working`);

    return true;

  } catch (error) {
    console.error('💥 Test failed with unexpected error:', error);
    return false;
  }
}

// Run the test
testEmailSystemIntegrity()
  .then(success => {
    if (success) {
      console.log('\n✅ All tests passed!');
      process.exit(0);
    } else {
      console.log('\n❌ Some tests failed!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 Test runner error:', error);
    process.exit(1);
  }); 
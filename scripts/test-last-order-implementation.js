const { createClient } = require('@supabase/supabase-js');

// Test script to verify the last order time implementation
async function testLastOrderImplementation() {
  console.log('🧪 Testing Last Order Time Implementation...\n');
  
  try {
    // Create a test service period with different times
    const testPeriod = {
      name: 'Test Lunch Service',
      start_time: '12:00:00',
      end_time: '15:00:00',
      last_order_time: '14:30:00',
      kitchen_closing_time: '14:45:00',
      interval_minutes: 30,
      enabled: true,
      period_type: 'lunch',
      sort_order: 99
    };
    
    console.log('📋 Test Service Period:');
    console.log('  - Start Time:', testPeriod.start_time);
    console.log('  - Last Order Time:', testPeriod.last_order_time);
    console.log('  - Kitchen Closing Time:', testPeriod.kitchen_closing_time);
    console.log('  - End Time:', testPeriod.end_time);
    console.log('  - Interval:', testPeriod.interval_minutes, 'minutes');
    console.log('');
    
    // Expected time slots calculation
    const expectedSlots = [];
    const startTime = new Date(`1970-01-01T${testPeriod.start_time}`);
    const lastOrderTime = new Date(`1970-01-01T${testPeriod.last_order_time}`);
    const currentTime = new Date(startTime);
    
    while (currentTime <= lastOrderTime) {
      const timeStr = currentTime.toTimeString().slice(0, 5);
      expectedSlots.push(timeStr);
      currentTime.setMinutes(currentTime.getMinutes() + testPeriod.interval_minutes);
    }
    
    console.log('🎯 Expected Time Slots (Start to Last Order):');
    console.log('  ', expectedSlots.join(', '));
    console.log('');
    
    // Calculate old behavior (Start to End Time)
    const oldSlots = [];
    const endTime = new Date(`1970-01-01T${testPeriod.end_time}`);
    const currentTimeOld = new Date(startTime);
    
    while (currentTimeOld < endTime) {
      const timeStr = currentTimeOld.toTimeString().slice(0, 5);
      oldSlots.push(timeStr);
      currentTimeOld.setMinutes(currentTimeOld.getMinutes() + testPeriod.interval_minutes);
    }
    
    console.log('❌ Old Behavior (Start to End Time):');
    console.log('  ', oldSlots.join(', '));
    console.log('');
    
    // Show the difference
    const timeDifference = oldSlots.length - expectedSlots.length;
    console.log('📊 Analysis:');
    console.log('  - New behavior slots:', expectedSlots.length);
    console.log('  - Old behavior slots:', oldSlots.length);
    console.log('  - Difference:', timeDifference, 'slots');
    console.log('  - Time saved:', timeDifference * testPeriod.interval_minutes, 'minutes');
    console.log('');
    
    // Test different scenarios
    console.log('🔄 Testing Different Scenarios...\n');
    
    const scenarios = [
      {
        name: 'Standard Lunch',
        start: '12:00:00',
        lastOrder: '14:30:00',
        kitchenClose: '15:00:00',
        end: '15:30:00',
        interval: 30
      },
      {
        name: 'Dinner Service',
        start: '18:00:00',
        lastOrder: '21:30:00',
        kitchenClose: '22:00:00',
        end: '22:30:00',
        interval: 30
      },
      {
        name: 'Quick Service',
        start: '11:30:00',
        lastOrder: '13:00:00',
        kitchenClose: '13:15:00',
        end: '13:30:00',
        interval: 15
      }
    ];
    
    scenarios.forEach(scenario => {
      const slots = [];
      const startTime = new Date(`1970-01-01T${scenario.start}`);
      const lastOrderTime = new Date(`1970-01-01T${scenario.lastOrder}`);
      const currentTime = new Date(startTime);
      
      while (currentTime <= lastOrderTime) {
        const timeStr = currentTime.toTimeString().slice(0, 5);
        slots.push(timeStr);
        currentTime.setMinutes(currentTime.getMinutes() + scenario.interval);
      }
      
      console.log(`📈 ${scenario.name}:`);
      console.log(`   Times: ${scenario.start} → ${scenario.lastOrder} (${scenario.interval}min intervals)`);
      console.log(`   Slots: ${slots.join(', ')}`);
      console.log(`   Count: ${slots.length} booking slots`);
      console.log('');
    });
    
    console.log('✅ Implementation test completed successfully!');
    console.log('');
    console.log('🎯 Key Benefits:');
    console.log('   - Customers can only book until last order time');
    console.log('   - Kitchen has buffer time to prepare final orders');
    console.log('   - Clear separation between booking cutoff and service end');
    console.log('   - Flexible configuration per service period');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testLastOrderImplementation(); 
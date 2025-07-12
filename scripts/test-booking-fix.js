// Test booking form with all fields
async function testBookingForm() {
  console.log('🧪 Testing booking form with complete data...\n');
  
  const formData = new FormData();
  formData.append('name', 'John Smith');
  formData.append('email', 'john.smith@example.com');
  formData.append('phone', '020 8421 1234');
  formData.append('date', '2024-12-28');
  formData.append('time', '19:00');
  formData.append('partySize', '4');
  formData.append('notes', 'Anniversary dinner');
  
  console.log('📋 Form data:');
  for (const [key, value] of formData.entries()) {
    console.log(`   ${key}: ${value}`);
  }
  
  try {
    const response = await fetch('http://localhost:3000/reserve', {
      method: 'POST',
      body: formData
    });
    
    const html = await response.text();
    
    if (html.includes('Booking confirmed')) {
      console.log('\n✅ SUCCESS! Booking form is working correctly!');
      
      // Extract confirmation details
      const confirmMatch = html.match(/Booking confirmed for ([^!]+)!/);
      if (confirmMatch) {
        console.log(`   Booking confirmed for: ${confirmMatch[1]}`);
      }
      
      // Check for reservation details
      if (html.includes('Your reservation for 4 people')) {
        console.log('   ✓ Party size correctly processed');
      }
      if (html.includes('28') && html.includes('19:00')) {
        console.log('   ✓ Date and time correctly processed');
      }
      
    } else if (html.includes('Please fix the errors below')) {
      console.log('\n❌ FAILED: Still getting validation errors');
      
      // Try to extract which fields are failing
      const errorMatch = html.match(/<ul[^>]*>.*?<\/ul>/s);
      if (errorMatch) {
        console.log('   Error details:', errorMatch[0].replace(/<[^>]*>/g, ' ').trim());
      }
    } else {
      console.log('\n⚠️  Unexpected response');
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testBookingForm(); 
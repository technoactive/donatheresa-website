#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  console.error('')
  console.error('Please add these to your .env.local file')
  process.exit(1)
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createDefaultAdmin() {
  console.log('🔧 Creating default admin user...')
  
  const email = 'donatheresahatchend@gmail.com'
  const password = 'Master002!'
  
  try {
    // Check if user already exists
    const { data: existingUsers, error: checkError } = await supabase.auth.admin.listUsers()
    
    if (checkError) {
      throw checkError
    }
    
    const existingUser = existingUsers.users.find(user => user.email === email)
    
    if (existingUser) {
      console.log('✅ Default admin user already exists:', email)
      return existingUser
    }
    
    // Create the user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        full_name: 'Dona Theresa Admin'
      }
    })
    
    if (error) {
      throw error
    }
    
    console.log('✅ Default admin user created successfully!')
    console.log('📧 Email:', email)
    console.log('🔑 Password:', password)
    console.log('🆔 User ID:', data.user.id)
    
    return data.user
    
  } catch (error) {
    console.error('❌ Error creating default admin user:', error.message)
    process.exit(1)
  }
}

// Run the script
createDefaultAdmin()
  .then(() => {
    console.log('')
    console.log('🎉 Setup complete! You can now login with:')
    console.log('   Email: donatheresahatchend@gmail.com')
    console.log('   Password: Master002!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Script failed:', error)
    process.exit(1)
  }) 
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mizksqfqtwmgwnxjevqi.supabase.co';
const supabaseAnonKey = 'sb_publishable_oimeq0CBdRM2lctsOIYUeQ_uYDfTHMo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔍 Checking Supabase Auth Users...\n');
console.log('='.repeat(80));

async function checkAuthUsers() {
  // Note: The anon key cannot list all auth users for security reasons
  // Only service_role key can do that, which should never be exposed in client apps
  
  console.log('\n⚠️  IMPORTANT SECURITY NOTE:');
  console.log('   The anonymous API key (anon key) cannot list auth users.');
  console.log('   This is a security feature - only admins can see all users.\n');
  
  console.log('📋 To check registered auth users, you need to:');
  console.log('   1. Go to your Supabase Dashboard');
  console.log('   2. Navigate to: Authentication > Users\n');
  
  console.log('🔗 Direct Link:');
  console.log('   https://supabase.com/dashboard/project/mizksqfqtwmgwnxjevqi/auth/users\n');
  
  console.log('='.repeat(80));
  console.log('\n📊 What you should see in the dashboard:\n');
  console.log('   If users are registered in Auth, you\'ll see:');
  console.log('   • Email addresses');
  console.log('   • User IDs');
  console.log('   • Last sign-in times');
  console.log('   • Email confirmation status');
  console.log('   • Creation dates\n');
  
  console.log('='.repeat(80));
  console.log('\n🔐 Expected Auth Users (from your users table):\n');
  
  // Get users from the users table to show what SHOULD be in Auth
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('email, full_name, role')
      .order('role');
    
    if (error) throw error;
    
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email}`);
      console.log(`      Name: ${user.full_name}`);
      console.log(`      Role: ${user.role}`);
      console.log('');
    });
    
    console.log('='.repeat(80));
    console.log('\n✅ NEXT STEPS:\n');
    console.log('   1. Open the Supabase Dashboard link above');
    console.log('   2. Check if these emails exist in the Auth Users list');
    console.log('   3. If they DON\'T exist, you have two options:\n');
    console.log('      Option A: Create auth users manually in dashboard');
    console.log('      Option B: Use the app\'s Sign Up feature to register\n');
    console.log('   4. If they DO exist but login fails:');
    console.log('      • You may have forgotten the password');
    console.log('      • You can reset it in the dashboard');
    console.log('      • Or use "Forgot Password" in the app\n');
    
  } catch (error) {
    console.error('❌ Error fetching users:', error.message);
  }
  
  console.log('='.repeat(80));
  console.log('\n💡 HELPFUL TIPS:\n');
  console.log('   • Auth users are separate from the users table');
  console.log('   • The users table stores profile data');
  console.log('   • Supabase Auth stores credentials & passwords');
  console.log('   • Both need to exist for login to work');
  console.log('   • They\'re linked by the user ID\n');
  
  console.log('='.repeat(80));
}

checkAuthUsers();

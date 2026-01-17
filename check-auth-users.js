const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mizksqfqtwmgwnxjevqi.supabase.co';
const supabaseAnonKey = 'sb_publishable_oimeq0CBdRM2lctsOIYUeQ_uYDfTHMo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAuthUsers() {
  console.log('🔍 Checking available users...\n');
  
  // Get users from the users table
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('full_name');
  
  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }
  
  console.log('📋 AVAILABLE USERS:\n');
  console.log('='.repeat(80));
  
  users.forEach((user, index) => {
    console.log(`\n${index + 1}. ${user.full_name}`);
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   👤 Role: ${user.role}`);
    console.log(`   🆔 ID: ${user.id}`);
  });
  
  console.log('\n' + '='.repeat(80));
  console.log('\n💡 IMPORTANT NOTES:');
  console.log('   • These users need to be registered in Supabase Auth to login');
  console.log('   • The password for authentication is stored in Supabase Auth, not in the users table');
  console.log('   • You may need to use the Supabase dashboard to:');
  console.log('     1. Check if these users exist in Auth');
  console.log('     2. Create auth users or reset passwords if needed');
  console.log('\n📱 TO LOGIN:');
  console.log('   • Use the email from the list above');
  console.log('   • You need the correct password set in Supabase Auth');
  console.log('\n🔗 Supabase Dashboard: https://supabase.com/dashboard/project/mizksqfqtwmgwnxjevqi');
}

checkAuthUsers();

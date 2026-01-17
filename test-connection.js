const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mizksqfqtwmgwnxjevqi.supabase.co';
const supabaseAnonKey = 'sb_publishable_oimeq0CBdRM2lctsOIYUeQ_uYDfTHMo';

console.log('🔍 Testing Supabase Connection...\n');
console.log('='.repeat(80));

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  const tests = [];
  
  // Test 1: Connection Configuration
  console.log('\n✅ Test 1: Configuration');
  console.log(`   URL: ${supabaseUrl}`);
  console.log(`   API Key: ${supabaseAnonKey.substring(0, 20)}...`);
  tests.push({ name: 'Configuration', status: 'PASS' });
  
  // Test 2: Network Connection
  console.log('\n🔄 Test 2: Network Connection...');
  try {
    const response = await fetch(supabaseUrl);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    tests.push({ name: 'Network Connection', status: 'PASS' });
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    tests.push({ name: 'Network Connection', status: 'FAIL', error: error.message });
  }
  
  // Test 3: Users Table Access
  console.log('\n🔄 Test 3: Users Table Access...');
  try {
    const { data, error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .limit(1);
    
    if (error) throw error;
    console.log(`   ✅ Successfully accessed users table`);
    console.log(`   Records: ${count} users found`);
    tests.push({ name: 'Users Table', status: 'PASS', records: count });
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    tests.push({ name: 'Users Table', status: 'FAIL', error: error.message });
  }
  
  // Test 4: Growers Table Access
  console.log('\n🔄 Test 4: Growers Table Access...');
  try {
    const { data, error, count } = await supabase
      .from('growers')
      .select('*', { count: 'exact' })
      .limit(1);
    
    if (error) throw error;
    console.log(`   ✅ Successfully accessed growers table`);
    console.log(`   Records: ${count} growers found`);
    tests.push({ name: 'Growers Table', status: 'PASS', records: count });
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    tests.push({ name: 'Growers Table', status: 'FAIL', error: error.message });
  }
  
  // Test 5: Production Cycles Table Access
  console.log('\n🔄 Test 5: Production Cycles Table Access...');
  try {
    const { data, error, count } = await supabase
      .from('production_cycles')
      .select('*', { count: 'exact' })
      .limit(1);
    
    if (error) throw error;
    console.log(`   ✅ Successfully accessed production_cycles table`);
    console.log(`   Records: ${count} cycles found`);
    tests.push({ name: 'Production Cycles Table', status: 'PASS', records: count });
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    tests.push({ name: 'Production Cycles Table', status: 'FAIL', error: error.message });
  }
  
  // Test 6: Farms Table Access
  console.log('\n🔄 Test 6: Farms Table Access...');
  try {
    const { data, error, count } = await supabase
      .from('farms')
      .select('*', { count: 'exact' })
      .limit(1);
    
    if (error) throw error;
    console.log(`   ✅ Successfully accessed farms table`);
    console.log(`   Records: ${count} farms found`);
    tests.push({ name: 'Farms Table', status: 'PASS', records: count });
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    tests.push({ name: 'Farms Table', status: 'FAIL', error: error.message });
  }
  
  // Test 7: Harvests Table Access
  console.log('\n🔄 Test 7: Harvests Table Access...');
  try {
    const { data, error, count } = await supabase
      .from('harvests')
      .select('*', { count: 'exact' })
      .limit(1);
    
    if (error) throw error;
    console.log(`   ✅ Successfully accessed harvests table`);
    console.log(`   Records: ${count} harvests found`);
    tests.push({ name: 'Harvests Table', status: 'PASS', records: count });
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    tests.push({ name: 'Harvests Table', status: 'FAIL', error: error.message });
  }
  
  // Test 8: Complex Query with Joins
  console.log('\n🔄 Test 8: Complex Query (Production Cycles with Farms)...');
  try {
    const { data, error } = await supabase
      .from('production_cycles')
      .select(`
        *,
        farms(name, location)
      `)
      .limit(1);
    
    if (error) throw error;
    console.log(`   ✅ Successfully executed complex query with joins`);
    if (data && data.length > 0) {
      console.log(`   Sample: ${data[0].farms?.name || 'Unknown'} - ${data[0].status}`);
    }
    tests.push({ name: 'Complex Query', status: 'PASS' });
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    tests.push({ name: 'Complex Query', status: 'FAIL', error: error.message });
  }
  
  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 CONNECTION TEST SUMMARY:\n');
  
  const passed = tests.filter(t => t.status === 'PASS').length;
  const failed = tests.filter(t => t.status === 'FAIL').length;
  
  tests.forEach(test => {
    const icon = test.status === 'PASS' ? '✅' : '❌';
    const records = test.records !== undefined ? ` (${test.records} records)` : '';
    console.log(`   ${icon} ${test.name}${records}`);
    if (test.error) {
      console.log(`      Error: ${test.error}`);
    }
  });
  
  console.log('\n' + '='.repeat(80));
  console.log(`\n📈 Results: ${passed}/${tests.length} tests passed`);
  
  if (failed === 0) {
    console.log('\n🎉 SUCCESS! Your database connection is working perfectly!');
    console.log('   • All tables are accessible');
    console.log('   • Data can be read successfully');
    console.log('   • Complex queries with joins work correctly');
  } else {
    console.log(`\n⚠️  WARNING: ${failed} test(s) failed`);
    console.log('   Please check the errors above for details');
  }
  
  console.log('\n' + '='.repeat(80));
}

testConnection().catch(error => {
  console.error('\n❌ Fatal Error:', error);
  process.exit(1);
});

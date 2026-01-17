const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mizksqfqtwmgwnxjevqi.supabase.co';
const supabaseAnonKey = 'sb_publishable_oimeq0CBdRM2lctsOIYUeQ_uYDfTHMo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getCompleteSchema() {
  console.log('🔍 Fetching complete database schema...\n');
  
  // Extended list of possible tables
  const tableNames = [
    'profiles',
    'users',
    'growers',
    'cycles',
    'production_cycles',
    'harvests',
    'supplies',
    'supply_deliveries',
    'deliveries',
    'notifications',
    'user_roles',
    'farmer_cycles',
    'technician_assignments',
    'farms',
    'mortality_records',
    'feed_records',
    'daily_records',
    'expenses',
    'revenue',
    'reconciliation'
  ];
  
  const existingTables = [];
  const tableStructures = {};
  
  for (const tableName of tableNames) {
    try {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .limit(1);
      
      if (!error) {
        existingTables.push(tableName);
        tableStructures[tableName] = {
          recordCount: count || 0,
          columns: data && data.length > 0 ? Object.keys(data[0]) : [],
          sampleData: data && data.length > 0 ? data[0] : null
        };
      }
    } catch (err) {
      // Table doesn't exist
    }
  }
  
  console.log('📊 COMPLETE DATABASE STRUCTURE\n');
  console.log('='.repeat(100));
  console.log(`\n📋 Found ${existingTables.length} tables:\n`);
  
  for (const tableName of existingTables) {
    const info = tableStructures[tableName];
    console.log(`\n${'▸'.repeat(3)} TABLE: ${tableName.toUpperCase()}`);
    console.log(`   📈 Records: ${info.recordCount}`);
    console.log(`   📝 Columns (${info.columns.length}): ${info.columns.join(', ')}`);
    
    if (info.sampleData) {
      console.log(`   📄 Sample Record:`);
      for (const [key, value] of Object.entries(info.sampleData)) {
        const displayValue = value === null ? 'NULL' : 
                           typeof value === 'string' && value.length > 50 ? 
                           value.substring(0, 47) + '...' : 
                           JSON.stringify(value);
        console.log(`      • ${key}: ${displayValue}`);
      }
    } else {
      console.log(`   📄 (Empty table - no sample data)`);
    }
    console.log(`   ${'─'.repeat(90)}`);
  }
  
  console.log('\n' + '='.repeat(100));
  console.log('\n✅ Schema retrieval complete!\n');
  
  // Summary
  console.log('📊 SUMMARY:');
  console.log(`   • Total tables: ${existingTables.length}`);
  console.log(`   • Tables with data: ${Object.values(tableStructures).filter(t => t.recordCount > 0).length}`);
  console.log(`   • Empty tables: ${Object.values(tableStructures).filter(t => t.recordCount === 0).length}`);
  
  const totalRecords = Object.values(tableStructures).reduce((sum, t) => sum + t.recordCount, 0);
  console.log(`   • Total records: ${totalRecords}`);
  
  console.log('\n💾 Tables with data:');
  Object.entries(tableStructures)
    .filter(([_, info]) => info.recordCount > 0)
    .forEach(([name, info]) => {
      console.log(`   • ${name}: ${info.recordCount} records`);
    });
}

getCompleteSchema();

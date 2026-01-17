const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mizksqfqtwmgwnxjevqi.supabase.co';
const supabaseAnonKey = 'sb_publishable_oimeq0CBdRM2lctsOIYUeQ_uYDfTHMo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getDatabaseStructure() {
  console.log('🔍 Fetching database structure...\n');
  
  try {
    // Query to get all tables in the public schema
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables_info');
    
    if (tablesError) {
      // Alternative approach: try to fetch from information_schema
      console.log('📋 Attempting to fetch table information...\n');
      
      // Get list of tables by trying to query them
      const tableNames = [
        'profiles',
        'users',
        'growers',
        'cycles',
        'harvests',
        'supplies',
        'deliveries',
        'notifications',
        'user_roles',
        'farmer_cycles',
        'technician_assignments'
      ];
      
      console.log('📊 Database Structure:\n');
      console.log('='.repeat(80));
      
      for (const tableName of tableNames) {
        try {
          const { data, error, count } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });
          
          if (!error) {
            console.log(`\n✅ Table: ${tableName}`);
            console.log(`   Record Count: ${count || 0}`);
            
            // Get a sample record to see structure
            const { data: sample } = await supabase
              .from(tableName)
              .select('*')
              .limit(1)
              .single();
            
            if (sample) {
              console.log(`   Columns: ${Object.keys(sample).join(', ')}`);
              console.log(`   Sample Data:`, JSON.stringify(sample, null, 2));
            } else {
              // Try to get columns from first record
              const { data: firstRecord } = await supabase
                .from(tableName)
                .select('*')
                .limit(1);
              
              if (firstRecord && firstRecord.length > 0) {
                console.log(`   Columns: ${Object.keys(firstRecord[0]).join(', ')}`);
              } else {
                console.log(`   Columns: (empty table - fetching from API)`);
              }
            }
          }
        } catch (tableError) {
          // Table doesn't exist or no access
          console.log(`\n❌ Table: ${tableName} - Not found or no access`);
        }
      }
      
      console.log('\n' + '='.repeat(80));
      console.log('\n✨ Database structure retrieved successfully!');
      
    } else {
      console.log('Tables found:', tables);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Note: This script queries the database structure without modifying anything.');
    console.log('💡 You may need to check your Supabase dashboard for RLS policies.');
  }
}

getDatabaseStructure();

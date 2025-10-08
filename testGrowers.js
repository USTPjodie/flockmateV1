// Test script to verify growers functionality
const { createGrower, getAllGrowers } = require('./src/database/sqlite');

async function testGrowers() {
  console.log('Testing growers functionality...');
  
  // Test creating growers
  const grower1 = {
    id: 'test-grower-1',
    name: 'Xyrus Farm',
    contactPerson: 'Xyrus',
    phone: '123-456-7890',
    email: 'xyrus@example.com',
    address: '123 Farm Road'
  };
  
  const grower2 = {
    id: 'test-grower-2',
    name: 'Gabriel Poultry',
    contactPerson: 'Gabriel',
    phone: '098-765-4321',
    email: 'gabriel@example.com',
    address: '456 Chicken Lane'
  };
  
  try {
    console.log('Creating growers...');
    await createGrower(grower1);
    await createGrower(grower2);
    console.log('Growers created successfully!');
    
    // Test retrieving growers
    console.log('Retrieving all growers...');
    const growers = await getAllGrowers();
    console.log(`Found ${growers.length} growers:`);
    growers.forEach(grower => {
      console.log(`- ${grower.name} (${grower.contact_person})`);
    });
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testGrowers();
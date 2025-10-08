import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as SQLite from './database/sqlite';

const TestGrowers = () => {
  useEffect(() => {
    const testGrowers = async () => {
      console.log('Testing growers functionality...');
      
      try {
        // Test retrieving existing growers
        console.log('Retrieving all growers...');
        const growers = await SQLite.getAllGrowers();
        console.log(`Found ${growers.length} growers:`);
        growers.forEach((grower: any) => {
          console.log(`- ${grower.name} (${grower.contact_person})`);
        });
        
        console.log('Test completed!');
      } catch (error) {
        console.error('Test failed:', error);
      }
    };
    
    testGrowers();
  }, []);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Growers Test</Text>
      <Text>Check the console for test results</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default TestGrowers;
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
import { Card, CardContent } from './components/ui/card';
import { RotateCw, Users } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as SQLite from './database/sqlite';
import { randomUUID } from 'expo-crypto';
import { useNavigation } from '@react-navigation/native';

const StartNewCycle = ({ route }: any) => {
  const navigation = useNavigation();
  const { cycle } = route?.params || {};
  
  const [cycleData, setCycleData] = useState({
    name: '',
    startDate: new Date(),
    chickCount: '',
    selectedGrowerId: '',
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [growers, setGrowers] = useState<any[]>([]);
  const [loadingGrowers, setLoadingGrowers] = useState(true);

  // Load growers from database
  useEffect(() => {
    loadGrowers();
  }, []);

  const loadGrowers = async () => {
    try {
      setLoadingGrowers(true);
      const growersData: any = await SQLite.getAllGrowers();
      setGrowers(growersData || []);
    } catch (error) {
      console.error('Error loading growers:', error);
      Alert.alert('Error', 'Failed to load registered farmers: ' + (error as Error).message);
    } finally {
      setLoadingGrowers(false);
    }
  };

  const handleCreateCycle = async () => {
    // Validation
    if (!cycleData.name.trim()) {
      Alert.alert('Validation Error', 'Please enter a cycle name');
      return;
    }
    
    if (!cycleData.selectedGrowerId) {
      Alert.alert('Validation Error', 'Please select a farmer/grower');
      return;
    }
    
    if (!cycleData.chickCount || parseInt(cycleData.chickCount) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid number of chicks');
      return;
    }
    
    try {
      setLoading(true);
      
      // Create cycle in database
      const newCycleId = randomUUID();
      const cycleToCreate = {
        id: newCycleId,
        name: cycleData.name,
        startDate: cycleData.startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        farmerCount: 1, // We're assigning to one specific grower
        chickCount: parseInt(cycleData.chickCount), // Use the chick count from the form
        status: 'Active',
        growerId: cycleData.selectedGrowerId, // Assign to selected grower
      };
      
      await SQLite.createCycle(cycleToCreate);
      
      // Show success message and navigate back
      Alert.alert('Success', 'New cycle created successfully!', [
        { 
          text: 'OK', 
          onPress: () => {
            // Go back to the previous screen
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              // If we can't go back, navigate to the cycles list
              // @ts-ignore
              navigation.navigate('CyclesList');
            }
          }
        }
      ]);
    } catch (error) {
      console.error('Error creating cycle:', error);
      Alert.alert('Error', 'Failed to create cycle: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
  const onChangeDate = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || cycleData.startDate;
    setShowDatePicker(Platform.OS === 'ios');
    setCycleData({ ...cycleData, startDate: currentDate });
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Start New Cycle</Text>
          <Text style={styles.subtitle}>Based on {cycle?.name || 'previous cycle'}</Text>
        </View>

        {/* New Cycle Form */}
        <Card style={styles.formCard}>
          <CardContent style={styles.formContent}>
            <Text style={styles.sectionTitle}>Cycle Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cycle Name</Text>
              <TextInput
                style={styles.input}
                value={cycleData.name}
                onChangeText={(text) => setCycleData({ ...cycleData, name: text })}
                placeholder="Enter cycle name"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Start Date</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {cycleData.startDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              
              {showDatePicker && (
                <DateTimePicker
                  value={cycleData.startDate}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                />
              )}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Number of Chicks</Text>
              <TextInput
                style={styles.input}
                value={cycleData.chickCount}
                onChangeText={(text) => setCycleData({ ...cycleData, chickCount: text })}
                placeholder="Enter number of chicks"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Select Farmer/Grower</Text>
              {loadingGrowers ? (
                <Text style={styles.loadingText}>Loading farmers...</Text>
              ) : growers.length === 0 ? (
                <Text style={styles.noGrowersText}>No registered farmers found</Text>
              ) : (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={cycleData.selectedGrowerId}
                    style={styles.picker}
                    onValueChange={(value) => setCycleData({ ...cycleData, selectedGrowerId: value })}
                  >
                    <Picker.Item label="Select a farmer..." value="" />
                    {growers.map((grower) => (
                      <Picker.Item 
                        key={grower.id} 
                        label={grower.name} 
                        value={grower.id} 
                      />
                    ))}
                  </Picker>
                </View>
              )}
            </View>
            
            <TouchableOpacity 
              style={[styles.createButton, loading && styles.disabledButton]} 
              onPress={handleCreateCycle}
              disabled={loading}
            >
              <View style={{ width: 20, height: 20 }}>
                {/* @ts-ignore */}
                <RotateCw size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.createButtonText}>
                {loading ? 'Creating...' : 'Create New Cycle'}
              </Text>
            </TouchableOpacity>
          </CardContent>
        </Card>
        
        {/* Info Card */}
        <Card style={styles.infoCard}>
          <CardContent style={styles.infoContent}>
            <Text style={styles.infoTitle}>New Cycle Details</Text>
            <Text style={styles.infoText}>
              Creating a new cycle will initialize all tracking systems for your poultry production. 
              You can assign farmers, track deliveries, and monitor progress throughout the cycle.
            </Text>
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  formContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dateInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#0f172a',
  },
  pickerContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
    padding: 12,
  },
  noGrowersText: {
    fontSize: 16,
    color: '#64748b',
    padding: 12,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 8,
    padding: 16,
    marginTop: 10,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    padding: 20,
  },
  infoContent: {
    padding: 0,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#065f46',
    lineHeight: 24,
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default StartNewCycle;
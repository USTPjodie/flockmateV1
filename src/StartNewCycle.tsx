import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Card, CardContent } from './components/ui/card';
import { RotateCw, Users } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const StartNewCycle = ({ route, navigation }) => {
  const { cycle } = route.params || {};
  
  const [cycleData, setCycleData] = useState({
    name: '',
    startDate: new Date(),
    assignedFarmers: '',
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleCreateCycle = () => {
    // In a real app, this would save to Supabase
    console.log('New cycle data:', { ...cycleData, sourceCycleId: cycle?.id });
    // Show success message and navigate back
    alert('New cycle created successfully!');
    navigation.goBack();
  };
  
  const onChangeDate = (event, selectedDate) => {
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
              <Text style={styles.label}>Assigned Farmers</Text>
              <TextInput
                style={styles.input}
                value={cycleData.assignedFarmers}
                onChangeText={(text) => setCycleData({ ...cycleData, assignedFarmers: text })}
                placeholder="Enter farmer names or count"
              />
            </View>
            
            <TouchableOpacity style={styles.createButton} onPress={handleCreateCycle}>
              <RotateCw size={20} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Create New Cycle</Text>
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
    borderWidth: 1,
    borderColor: '#059669',
  },
  infoContent: {
    padding: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#059669',
    lineHeight: 20,
  },
});

export default StartNewCycle;
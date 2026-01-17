import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch, Platform } from 'react-native';
import { Card, CardContent } from './components/ui/card';
import { Scale, AlertCircle } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const MakeHarvest = ({ route }) => {
  const { cycle } = route.params || {};
  
  const [harvestData, setHarvestData] = useState({
    grower: '',
    quantity: '',
    averageWeight: '',
    remarks: '',
    isFinal: false,
    harvestDate: new Date(),
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = () => {
    // In a real app, this would save to Supabase
    console.log('Harvest data:', { ...harvestData, cycleId: cycle?.id });
    // Show success message
    alert('Harvest record saved successfully!');
  };
  
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || harvestData.harvestDate;
    setShowDatePicker(Platform.OS === 'ios');
    setHarvestData({ ...harvestData, harvestDate: currentDate });
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Make Harvest</Text>
          <Text style={styles.subtitle}>{cycle?.name || 'Cycle'}</Text>
        </View>

        {/* Harvest Form */}
        <Card style={styles.formCard}>
          <CardContent style={styles.formContent}>
            <Text style={styles.sectionTitle}>Harvest Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Grower</Text>
              <TextInput
                style={styles.input}
                value={harvestData.grower}
                onChangeText={(text) => setHarvestData({ ...harvestData, grower: text })}
                placeholder="Select or enter grower name"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Harvest Date</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {harvestData.harvestDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              
              {showDatePicker && (
                <DateTimePicker
                  value={harvestData.harvestDate}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                />
              )}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Quantity (birds)</Text>
              <TextInput
                style={styles.input}
                value={harvestData.quantity}
                onChangeText={(text) => setHarvestData({ ...harvestData, quantity: text })}
                placeholder="Enter number of birds harvested"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Average Weight (kg)</Text>
              <TextInput
                style={styles.input}
                value={harvestData.averageWeight}
                onChangeText={(text) => setHarvestData({ ...harvestData, averageWeight: text })}
                placeholder="Enter average bird weight"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Remarks</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={harvestData.remarks}
                onChangeText={(text) => setHarvestData({ ...harvestData, remarks: text })}
                placeholder="Enter any additional remarks"
                multiline
                numberOfLines={3}
              />
            </View>
            
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Final Harvest</Text>
              <Switch
                trackColor={{ false: "#e2e8f0", true: "#059669" }}
                thumbColor={harvestData.isFinal ? "#047857" : "#f4f4f5"}
                onValueChange={(value) => setHarvestData({ ...harvestData, isFinal: value })}
                value={harvestData.isFinal}
              />
            </View>
            
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Scale size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Submit Harvest Report</Text>
            </TouchableOpacity>
          </CardContent>
        </Card>
        
        {/* Info Card */}
        <Card style={styles.infoCard}>
          <CardContent style={styles.infoContent}>
            <View style={styles.infoHeader}>
              <AlertCircle size={20} color="#059669" />
              <Text style={styles.infoTitle}>Harvest Guidelines</Text>
            </View>
            <Text style={styles.infoText}>
              Record accurate harvest data for each grower. Mark as final harvest when 
              all birds have been collected. This information is crucial for performance 
              analysis and payment calculations.
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00623a',
    borderRadius: 8,
    padding: 16,
    marginTop: 10,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: '#e0f2e9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00623a',
  },
  infoContent: {
    padding: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00623a',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#00623a',
    lineHeight: 20,
  },
});

export default MakeHarvest;
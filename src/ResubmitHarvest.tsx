import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Card, CardContent } from './components/ui/card';
import { Edit3, Scale, AlertCircle, Trash2 } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const ResubmitHarvest = ({ route }) => {
  const { cycle } = route.params || {};
  
  const [harvestData, setHarvestData] = useState({
    grower: '',
    quantity: '',
    averageWeight: '',
    remarks: '',
    reason: '',
    harvestDate: new Date(),
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleResubmit = () => {
    // In a real app, this would update the record in Supabase
    console.log('Resubmit harvest data:', { ...harvestData, cycleId: cycle?.id });
    // Show success message
    alert('Harvest record resubmitted successfully!');
  };
  
  const handleDelete = () => {
    // In a real app, this would delete the record from Supabase
    console.log('Delete harvest record:', cycle?.id);
    alert('Harvest record deleted successfully!');
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
          <Text style={styles.title}>Resubmit Harvest</Text>
          <Text style={styles.subtitle}>{cycle?.name || 'Cycle'}</Text>
        </View>

        {/* Resubmit Harvest Form */}
        <Card style={styles.formCard}>
          <CardContent style={styles.formContent}>
            <Text style={styles.sectionTitle}>Edit Harvest Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Grower</Text>
              <TextInput
                style={styles.input}
                value={harvestData.grower}
                onChangeText={(text) => setHarvestData({ ...harvestData, grower: text })}
                placeholder="Enter grower name"
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
                placeholder="Enter corrected number of birds"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Average Weight (kg)</Text>
              <TextInput
                style={styles.input}
                value={harvestData.averageWeight}
                onChangeText={(text) => setHarvestData({ ...harvestData, averageWeight: text })}
                placeholder="Enter corrected average weight"
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
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Reason for Resubmission</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={harvestData.reason}
                onChangeText={(text) => setHarvestData({ ...harvestData, reason: text })}
                placeholder="Explain why this record is being resubmitted"
                multiline
                numberOfLines={3}
              />
            </View>
            
            <TouchableOpacity style={styles.saveButton} onPress={handleResubmit}>
              <Edit3 size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Resubmit Harvest Record</Text>
            </TouchableOpacity>
          </CardContent>
        </Card>
        
        {/* Delete Button */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Trash2 size={20} color="#ef4444" />
          <Text style={styles.deleteButtonText}>Delete Harvest Record</Text>
        </TouchableOpacity>
        
        {/* Info Card */}
        <Card style={styles.infoCard}>
          <CardContent style={styles.infoContent}>
            <View style={styles.infoHeader}>
              <AlertCircle size={20} color="#f59e0b" />
              <Text style={styles.infoTitle}>Resubmission Guidelines</Text>
            </View>
            <Text style={styles.infoText}>
              Only resubmit harvest records that were previously rejected or contain errors. 
              Provide a clear explanation for the changes made to the original submission. 
              Use the delete option only for completely incorrect entries.
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
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f59e0b',
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
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  deleteButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f59e0b',
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
    color: '#f59e0b',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#f59e0b',
    lineHeight: 20,
  },
});

export default ResubmitHarvest;
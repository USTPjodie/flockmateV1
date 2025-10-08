import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Card, CardContent } from './components/ui/card';
import { Edit3, Truck, AlertCircle } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const ResubmitSupply = ({ route }) => {
  const { cycle } = route.params || {};
  
  const [supplyData, setSupplyData] = useState({
    supplyName: '',
    quantity: '',
    unit: '',
    deliveryDate: new Date(),
    reason: '',
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleResubmit = () => {
    // In a real app, this would update the record in Supabase
    console.log('Resubmit supply data:', { ...supplyData, cycleId: cycle?.id });
    // Show success message
    alert('Supply delivery record resubmitted successfully!');
  };
  
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || supplyData.deliveryDate;
    setShowDatePicker(Platform.OS === 'ios');
    setSupplyData({ ...supplyData, deliveryDate: currentDate });
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Resubmit Supply Delivery</Text>
          <Text style={styles.subtitle}>{cycle?.name || 'Cycle'}</Text>
        </View>

        {/* Resubmit Supply Form */}
        <Card style={styles.formCard}>
          <CardContent style={styles.formContent}>
            <Text style={styles.sectionTitle}>Edit Delivery Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Supply Name</Text>
              <TextInput
                style={styles.input}
                value={supplyData.supplyName}
                onChangeText={(text) => setSupplyData({ ...supplyData, supplyName: text })}
                placeholder="Enter supply name"
              />
            </View>
            
            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, styles.inputHalf]}>
                <Text style={styles.label}>Quantity</Text>
                <TextInput
                  style={styles.input}
                  value={supplyData.quantity}
                  onChangeText={(text) => setSupplyData({ ...supplyData, quantity: text })}
                  placeholder="Enter quantity"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={[styles.inputGroup, styles.inputHalf]}>
                <Text style={styles.label}>Unit</Text>
                <TextInput
                  style={styles.input}
                  value={supplyData.unit}
                  onChangeText={(text) => setSupplyData({ ...supplyData, unit: text })}
                  placeholder="e.g., kg, bags"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Delivery Date</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {supplyData.deliveryDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              
              {showDatePicker && (
                <DateTimePicker
                  value={supplyData.deliveryDate}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                />
              )}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Reason for Resubmission</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={supplyData.reason}
                onChangeText={(text) => setSupplyData({ ...supplyData, reason: text })}
                placeholder="Explain why this record is being resubmitted"
                multiline
                numberOfLines={3}
              />
            </View>
            
            <TouchableOpacity style={styles.saveButton} onPress={handleResubmit}>
              <Edit3 size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Resubmit Delivery Record</Text>
            </TouchableOpacity>
          </CardContent>
        </Card>
        
        {/* Info Card */}
        <Card style={styles.infoCard}>
          <CardContent style={styles.infoContent}>
            <View style={styles.infoHeader}>
              <AlertCircle size={20} color="#f59e0b" />
              <Text style={styles.infoTitle}>Resubmission Guidelines</Text>
            </View>
            <Text style={styles.infoText}>
              Only resubmit records that were previously rejected or contain errors. 
              Provide a clear explanation for the changes made to the original submission.
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
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    width: '48%',
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

export default ResubmitSupply;
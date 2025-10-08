import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Card, CardContent } from './components/ui/card';
import { Truck, Package, AlertCircle } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const SupplyDelivery = ({ route }) => {
  const { cycle } = route.params || {};
  
  const [supplyData, setSupplyData] = useState({
    supplyName: '',
    quantity: '',
    unit: '',
    deliveryDate: new Date(),
    notes: '',
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = () => {
    // In a real app, this would save to Supabase
    console.log('Supply delivery data:', { ...supplyData, cycleId: cycle?.id });
    // Show success message
    alert('Supply delivery record saved successfully!');
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
          <Text style={styles.title}>Supply Delivery</Text>
          <Text style={styles.subtitle}>{cycle?.name || 'Cycle'}</Text>
        </View>

        {/* Supply Delivery Form */}
        <Card style={styles.formCard}>
          <CardContent style={styles.formContent}>
            <Text style={styles.sectionTitle}>Delivery Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Supply Name</Text>
              <TextInput
                style={styles.input}
                value={supplyData.supplyName}
                onChangeText={(text) => setSupplyData({ ...supplyData, supplyName: text })}
                placeholder="Enter supply name (e.g., Feed, Medicine)"
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
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={supplyData.notes}
                onChangeText={(text) => setSupplyData({ ...supplyData, notes: text })}
                placeholder="Enter any additional notes"
                multiline
                numberOfLines={3}
              />
            </View>
            
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Truck size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Submit Delivery Record</Text>
            </TouchableOpacity>
          </CardContent>
        </Card>
        
        {/* Info Card */}
        <Card style={styles.infoCard}>
          <CardContent style={styles.infoContent}>
            <View style={styles.infoHeader}>
              <AlertCircle size={20} color="#059669" />
              <Text style={styles.infoTitle}>Instructions</Text>
            </View>
            <Text style={styles.infoText}>
              Record all supply deliveries to growers. Include accurate quantities and delivery dates. 
              This information helps track resource usage and costs throughout the cycle.
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
    backgroundColor: '#059669',
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
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#059669',
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
    color: '#059669',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#059669',
    lineHeight: 20,
  },
});

export default SupplyDelivery;
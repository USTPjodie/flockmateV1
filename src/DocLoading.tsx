import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Card, CardContent } from './components/ui/card';
import { Package, Scale, AlertCircle } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DocLoading = ({ route }) => {
  const { cycle } = route.params || {};
  
  const [docData, setDocData] = useState({
    breed: '',
    group: '',
    totalChicks: '',
    rejectedChicks: '',
    rejectionReason: '',
    sampleWeight: '',
    deliveryDate: new Date(),
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = () => {
    // In a real app, this would save to Supabase
    console.log('DOC Loading data:', { ...docData, cycleId: cycle?.id });
    // Show success message
    alert('DOC Loading record saved successfully!');
  };
  
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || docData.deliveryDate;
    setShowDatePicker(Platform.OS === 'ios');
    setDocData({ ...docData, deliveryDate: currentDate });
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>DOC Loading</Text>
          <Text style={styles.subtitle}>{cycle?.name || 'Cycle'}</Text>
        </View>

        {/* DOC Loading Form */}
        <Card style={styles.formCard}>
          <CardContent style={styles.formContent}>
            <Text style={styles.sectionTitle}>Delivery Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Breed</Text>
              <TextInput
                style={styles.input}
                value={docData.breed}
                onChangeText={(text) => setDocData({ ...docData, breed: text })}
                placeholder="Enter breed"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Group</Text>
              <TextInput
                style={styles.input}
                value={docData.group}
                onChangeText={(text) => setDocData({ ...docData, group: text })}
                placeholder="Enter group"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Delivery Date</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {docData.deliveryDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              
              {showDatePicker && (
                <DateTimePicker
                  value={docData.deliveryDate}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                />
              )}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Total Chicks Received</Text>
              <TextInput
                style={styles.input}
                value={docData.totalChicks}
                onChangeText={(text) => setDocData({ ...docData, totalChicks: text })}
                placeholder="Enter total count"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Rejected Chicks</Text>
              <TextInput
                style={styles.input}
                value={docData.rejectedChicks}
                onChangeText={(text) => setDocData({ ...docData, rejectedChicks: text })}
                placeholder="Enter rejected count"
                keyboardType="numeric"
              />
            </View>
            
            {docData.rejectedChicks && docData.rejectedChicks !== '0' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Rejection Reason</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={docData.rejectionReason}
                  onChangeText={(text) => setDocData({ ...docData, rejectionReason: text })}
                  placeholder="Enter reason for rejection"
                  multiline
                  numberOfLines={3}
                />
              </View>
            )}
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sample Weight (grams)</Text>
              <TextInput
                style={styles.input}
                value={docData.sampleWeight}
                onChangeText={(text) => setDocData({ ...docData, sampleWeight: text })}
                placeholder="Enter sample weight"
                keyboardType="numeric"
              />
            </View>
            
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Submit Loading Record</Text>
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
              Record all DOC delivery details accurately. Rejected chicks should be documented with reasons. 
              Sample weights help track chick quality.
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
    backgroundColor: '#059669',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
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

export default DocLoading;
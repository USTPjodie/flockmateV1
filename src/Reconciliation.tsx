import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Card, CardContent } from './components/ui/card';
import { FileText, TrendingUp, AlertCircle } from 'lucide-react-native';

const Reconciliation = ({ route }) => {
  const { cycle } = route.params || {};
  
  const [performanceData, setPerformanceData] = useState({
    mortalityRate: '',
    averageLiveWeight: '',
    feedConversionRatio: '',
    notes: '',
  });

  const handleSave = () => {
    // In a real app, this would save to Supabase
    console.log('Performance data:', { ...performanceData, cycleId: cycle?.id });
    // Show success message
    alert('Performance reconciliation saved successfully!');
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Reconciliation of Performance</Text>
          <Text style={styles.subtitle}>{cycle?.name || 'Cycle'}</Text>
        </View>

        {/* Performance Metrics */}
        <Card style={styles.metricsCard}>
          <CardContent style={styles.metricsContent}>
            <Text style={styles.sectionTitle}>Performance Indicators</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mortality Rate (%)</Text>
              <TextInput
                style={styles.input}
                value={performanceData.mortalityRate}
                onChangeText={(text) => setPerformanceData({ ...performanceData, mortalityRate: text })}
                placeholder="Enter mortality rate"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Average Live Weight (kg)</Text>
              <TextInput
                style={styles.input}
                value={performanceData.averageLiveWeight}
                onChangeText={(text) => setPerformanceData({ ...performanceData, averageLiveWeight: text })}
                placeholder="Enter average live weight"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Feed Consumption Ratio</Text>
              <TextInput
                style={styles.input}
                value={performanceData.feedConversionRatio}
                onChangeText={(text) => setPerformanceData({ ...performanceData, feedConversionRatio: text })}
                placeholder="Enter feed conversion ratio"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Additional Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={performanceData.notes}
                onChangeText={(text) => setPerformanceData({ ...performanceData, notes: text })}
                placeholder="Enter any additional observations"
                multiline
                numberOfLines={4}
              />
            </View>
            
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <FileText size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save Reconciled Performance</Text>
            </TouchableOpacity>
          </CardContent>
        </Card>
        
        {/* Performance Summary */}
        <Card style={styles.summaryCard}>
          <CardContent style={styles.summaryContent}>
            <View style={styles.summaryHeader}>
              <TrendingUp size={20} color="#059669" />
              <Text style={styles.summaryTitle}>Cycle Performance Summary</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Chickens Started</Text>
              <Text style={styles.summaryValue}>24,000</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Harvested</Text>
              <Text style={styles.summaryValue}>22,450</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Mortality</Text>
              <Text style={styles.summaryValue}>1,550</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Feed Consumed (kg)</Text>
              <Text style={styles.summaryValue}>89,600</Text>
            </View>
          </CardContent>
        </Card>
        
        {/* Info Card */}
        <Card style={styles.infoCard}>
          <CardContent style={styles.infoContent}>
            <View style={styles.infoHeader}>
              <AlertCircle size={20} color="#6366f1" />
              <Text style={styles.infoTitle}>Reconciliation Guidelines</Text>
            </View>
            <Text style={styles.infoText}>
              Finalize and record all performance indicators at the end of the cycle. 
              These metrics are essential for reporting, analysis, and future planning. 
              Ensure all data is accurate and complete before saving.
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
  metricsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  metricsContent: {
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
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
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryContent: {
    padding: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginLeft: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  infoCard: {
    backgroundColor: '#eef2ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6366f1',
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
    color: '#6366f1',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6366f1',
    lineHeight: 20,
  },
});

export default Reconciliation;
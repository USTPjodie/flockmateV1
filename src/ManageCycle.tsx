import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Card, CardContent } from './components/ui/card';
import { BarChart3, Lock, Trash2, Eye, EyeOff } from 'lucide-react-native';

const ManageCycle = ({ route }) => {
  const { cycle } = route.params || {};
  
  const [cycleSettings, setCycleSettings] = useState({
    isLocked: false,
    showReports: true,
  });

  const handleLockCycle = () => {
    setCycleSettings({ ...cycleSettings, isLocked: !cycleSettings.isLocked });
  };

  const handleToggleReports = () => {
    setCycleSettings({ ...cycleSettings, showReports: !cycleSettings.showReports });
  };

  const handleDeleteCycle = () => {
    // In a real app, this would delete the cycle from Supabase
    console.log('Delete cycle:', cycle?.id);
    alert('Cycle deleted successfully!');
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Manage Cycle</Text>
          <Text style={styles.subtitle}>{cycle?.name || 'Cycle'}</Text>
        </View>

        {/* Cycle Stats */}
        <Card style={styles.statsCard}>
          <CardContent style={styles.statsContent}>
            <Text style={styles.sectionTitle}>Cycle Statistics</Text>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Live Chickens</Text>
              <Text style={styles.statValue}>22,450</Text>
            </View>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Feed Supply (kg)</Text>
              <Text style={styles.statValue}>4,200</Text>
            </View>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Harvested Birds</Text>
              <Text style={styles.statValue}>18,750</Text>
            </View>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Mortality Rate</Text>
              <Text style={styles.statValue}>3.2%</Text>
            </View>
          </CardContent>
        </Card>

        {/* Management Options */}
        <Card style={styles.managementCard}>
          <CardContent style={styles.managementContent}>
            <Text style={styles.sectionTitle}>Management Options</Text>
            
            <View style={styles.optionRow}>
              <View style={styles.optionText}>
                <Text style={styles.optionLabel}>Lock Cycle</Text>
                <Text style={styles.optionDescription}>Prevent further edits to this cycle</Text>
              </View>
              <Switch
                trackColor={{ false: "#e2e8f0", true: "#059669" }}
                thumbColor={cycleSettings.isLocked ? "#047857" : "#f4f4f5"}
                onValueChange={handleLockCycle}
                value={cycleSettings.isLocked}
              />
            </View>
            
            <View style={styles.optionRow}>
              <View style={styles.optionText}>
                <Text style={styles.optionLabel}>Show Reports</Text>
                <Text style={styles.optionDescription}>Display daily reports from growers</Text>
              </View>
              <Switch
                trackColor={{ false: "#e2e8f0", true: "#059669" }}
                thumbColor={cycleSettings.showReports ? "#047857" : "#f4f4f5"}
                onValueChange={handleToggleReports}
                value={cycleSettings.showReports}
              />
            </View>
            
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteCycle}>
              <Trash2 size={20} color="#ef4444" />
              <Text style={styles.deleteButtonText}>Delete Cycle</Text>
            </TouchableOpacity>
          </CardContent>
        </Card>
        
        {/* Grower Reports */}
        <Card style={styles.reportsCard}>
          <CardContent style={styles.reportsContent}>
            <View style={styles.reportsHeader}>
              <Text style={styles.sectionTitle}>Grower Reports</Text>
              <TouchableOpacity onPress={handleToggleReports}>
                {cycleSettings.showReports ? 
                  <Eye size={20} color="#059669" /> : 
                  <EyeOff size={20} color="#94A3B8" />
                }
              </TouchableOpacity>
            </View>
            
            {cycleSettings.showReports ? (
              <>
                <View style={styles.reportItem}>
                  <Text style={styles.reportGrower}>John Smith Farm</Text>
                  <Text style={styles.reportDate}>Updated: 2 hours ago</Text>
                </View>
                
                <View style={styles.reportItem}>
                  <Text style={styles.reportGrower}>Mary Johnson Poultry</Text>
                  <Text style={styles.reportDate}>Updated: 5 hours ago</Text>
                </View>
                
                <View style={styles.reportItem}>
                  <Text style={styles.reportGrower}>Robert Davis Coop</Text>
                  <Text style={styles.reportDate}>Updated: 1 day ago</Text>
                </View>
              </>
            ) : (
              <Text style={styles.reportsHidden}>Reports are currently hidden</Text>
            )}
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
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statsContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  statLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  managementCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  managementContent: {
    padding: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#94a3b8',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
  },
  deleteButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  reportsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reportsContent: {
    padding: 20,
  },
  reportsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  reportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  reportGrower: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  reportDate: {
    fontSize: 14,
    color: '#94a3b8',
  },
  reportsHidden: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default ManageCycle;
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Card, CardContent } from './components/ui/card';
import { CheckCircle, Lock, AlertCircle } from 'lucide-react-native';

const PostHarvest = ({ route }) => {
  const { cycle } = route.params || {};
  
  const [checklist, setChecklist] = useState({
    cleaning: false,
    disinfection: false,
    equipmentStorage: false,
    documentation: false,
    facilityInspection: false,
  });

  const [isCycleComplete, setIsCycleComplete] = useState(false);

  const handleToggleItem = (item) => {
    setChecklist({ ...checklist, [item]: !checklist[item] });
  };

  const handleCompleteCycle = () => {
    // Check if all items are completed
    const allCompleted = Object.values(checklist).every(item => item);
    
    if (!allCompleted) {
      alert('Please complete all checklist items before marking the cycle as complete.');
      return;
    }
    
    setIsCycleComplete(true);
    // In a real app, this would update the cycle status in Supabase
    console.log('Cycle completed:', cycle?.id);
    alert('Post-harvest checklist completed and cycle marked as complete!');
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Post-harvest</Text>
          <Text style={styles.subtitle}>{cycle?.name || 'Cycle'}</Text>
        </View>

        {/* Checklist */}
        <Card style={styles.checklistCard}>
          <CardContent style={styles.checklistContent}>
            <Text style={styles.sectionTitle}>Post-harvest Checklist</Text>
            <Text style={styles.sectionDescription}>
              Complete all required tasks before marking the cycle as complete
            </Text>
            
            <TouchableOpacity 
              style={styles.checklistItem}
              onPress={() => handleToggleItem('cleaning')}
            >
              <Switch
                trackColor={{ false: "#e2e8f0", true: "#059669" }}
                thumbColor={checklist.cleaning ? "#047857" : "#f4f4f5"}
                onValueChange={() => handleToggleItem('cleaning')}
                value={checklist.cleaning}
              />
              <View style={styles.itemText}>
                <Text style={styles.itemTitle}>Cleaning</Text>
                <Text style={styles.itemDescription}>Thoroughly clean all facilities and equipment</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.checklistItem}
              onPress={() => handleToggleItem('disinfection')}
            >
              <Switch
                trackColor={{ false: "#e2e8f0", true: "#059669" }}
                thumbColor={checklist.disinfection ? "#047857" : "#f4f4f5"}
                onValueChange={() => handleToggleItem('disinfection')}
                value={checklist.disinfection}
              />
              <View style={styles.itemText}>
                <Text style={styles.itemTitle}>Disinfection</Text>
                <Text style={styles.itemDescription}>Apply appropriate disinfectants to all surfaces</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.checklistItem}
              onPress={() => handleToggleItem('equipmentStorage')}
            >
              <Switch
                trackColor={{ false: "#e2e8f0", true: "#059669" }}
                thumbColor={checklist.equipmentStorage ? "#047857" : "#f4f4f5"}
                onValueChange={() => handleToggleItem('equipmentStorage')}
                value={checklist.equipmentStorage}
              />
              <View style={styles.itemText}>
                <Text style={styles.itemTitle}>Equipment Storage</Text>
                <Text style={styles.itemDescription}>Properly store all equipment for next use</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.checklistItem}
              onPress={() => handleToggleItem('documentation')}
            >
              <Switch
                trackColor={{ false: "#e2e8f0", true: "#059669" }}
                thumbColor={checklist.documentation ? "#047857" : "#f4f4f5"}
                onValueChange={() => handleToggleItem('documentation')}
                value={checklist.documentation}
              />
              <View style={styles.itemText}>
                <Text style={styles.itemTitle}>Documentation</Text>
                <Text style={styles.itemDescription}>Complete and file all required documentation</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.checklistItem}
              onPress={() => handleToggleItem('facilityInspection')}
            >
              <Switch
                trackColor={{ false: "#e2e8f0", true: "#059669" }}
                thumbColor={checklist.facilityInspection ? "#047857" : "#f4f4f5"}
                onValueChange={() => handleToggleItem('facilityInspection')}
                value={checklist.facilityInspection}
              />
              <View style={styles.itemText}>
                <Text style={styles.itemTitle}>Facility Inspection</Text>
                <Text style={styles.itemDescription}>Conduct final inspection of all facilities</Text>
              </View>
            </TouchableOpacity>
          </CardContent>
        </Card>

        {/* Complete Cycle Button */}
        <TouchableOpacity 
          style={[styles.completeButton, isCycleComplete && styles.completedButton]}
          onPress={handleCompleteCycle}
          disabled={isCycleComplete}
        >
          {isCycleComplete ? (
            <>
              <CheckCircle size={20} color="#ffffff" />
              <Text style={styles.completeButtonText}>Cycle Completed</Text>
            </>
          ) : (
            <>
              <Lock size={20} color="#ffffff" />
              <Text style={styles.completeButtonText}>Mark Cycle as Complete</Text>
            </>
          )}
        </TouchableOpacity>
        
        {/* Info Card */}
        <Card style={styles.infoCard}>
          <CardContent style={styles.infoContent}>
            <View style={styles.infoHeader}>
              <AlertCircle size={20} color="#059669" />
              <Text style={styles.infoTitle}>Post-harvest Guidelines</Text>
            </View>
            <Text style={styles.infoText}>
              Completing the post-harvest checklist ensures proper facility preparation 
              for the next cycle. All growers' data will be locked once the cycle is marked 
              as complete. Verify all tasks before finalizing.
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
  checklistCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  checklistContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  itemText: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#94a3b8',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  completedButton: {
    backgroundColor: '#166534',
  },
  completeButtonText: {
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

export default PostHarvest;
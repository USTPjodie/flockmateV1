import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, CardContent } from './components/ui/card';
import { Users, TrendingUp, ChevronDown, ChevronRight, Trash2 } from 'lucide-react-native';

const ManageGrower = ({ route }) => {
  const { cycle } = route.params || {};
  
  const [growers, setGrowers] = useState([
    {
      id: '1',
      name: 'John Smith Farm',
      chickens: 5000,
      performance: 94.2,
      expanded: false,
    },
    {
      id: '2',
      name: 'Mary Johnson Poultry',
      chickens: 3500,
      performance: 91.8,
      expanded: false,
    },
    {
      id: '3',
      name: 'Robert Davis Coop',
      chickens: 4200,
      performance: 93.5,
      expanded: false,
    },
  ]);

  const [expandedGrowerId, setExpandedGrowerId] = useState(null);

  const toggleGrowerExpansion = (growerId) => {
    setExpandedGrowerId(expandedGrowerId === growerId ? null : growerId);
  };

  const handleDeleteGrower = (growerId) => {
    // In a real app, this would delete the grower from Supabase
    console.log('Delete grower:', growerId);
    alert('Grower removed from cycle successfully!');
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Manage Growers</Text>
          <Text style={styles.subtitle}>{cycle?.name || 'Cycle'}</Text>
        </View>

        {/* Grower List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assigned Growers</Text>
          
          {growers.map((grower) => (
            <Card key={grower.id} style={styles.growerCard}>
              <CardContent style={styles.growerContent}>
                <TouchableOpacity 
                  style={styles.growerHeader}
                  onPress={() => toggleGrowerExpansion(grower.id)}
                >
                  <View style={styles.growerInfo}>
                    <Users size={20} color="#059669" />
                    <Text style={styles.growerName}>{grower.name}</Text>
                  </View>
                  
                  <View style={styles.growerStats}>
                    <Text style={styles.chickenCount}>{grower.chickens.toLocaleString()} chickens</Text>
                    {expandedGrowerId === grower.id ? (
                      <ChevronDown size={20} color="#94A3B8" />
                    ) : (
                      <ChevronRight size={20} color="#94A3B8" />
                    )}
                  </View>
                </TouchableOpacity>
                
                {expandedGrowerId === grower.id && (
                  <View style={styles.expandedContent}>
                    <View style={styles.performanceRow}>
                      <Text style={styles.performanceLabel}>Performance Rate</Text>
                      <View style={styles.performanceValueContainer}>
                        <TrendingUp size={16} color="#059669" />
                        <Text style={styles.performanceValue}>{grower.performance}%</Text>
                      </View>
                    </View>
                    
                    <View style={styles.weeklySummary}>
                      <Text style={styles.summaryTitle}>Weekly Performance Summary</Text>
                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Week 1</Text>
                        <Text style={styles.summaryValue}>92.5%</Text>
                      </View>
                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Week 2</Text>
                        <Text style={styles.summaryValue}>93.8%</Text>
                      </View>
                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Week 3</Text>
                        <Text style={styles.summaryValue}>94.2%</Text>
                      </View>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => handleDeleteGrower(grower.id)}
                    >
                      <Trash2 size={16} color="#ef4444" />
                      <Text style={styles.deleteButtonText}>Remove Grower</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </CardContent>
            </Card>
          ))}
        </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  growerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  growerContent: {
    padding: 16,
  },
  growerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  growerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  growerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginLeft: 8,
  },
  growerStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chickenCount: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 8,
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  performanceLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  performanceValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  performanceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginLeft: 4,
  },
  weeklySummary: {
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 12,
  },
  deleteButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ManageGrower;
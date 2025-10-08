import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, CardContent } from './components/ui/card';
import { Users, TrendingUp } from 'lucide-react-native';

const GrowersManagement = () => {
  // Sample data for demonstration
  const growers = [
    {
      id: '1',
      name: 'John Smith Farm',
      cycles: 3,
      performance: 94.2,
    },
    {
      id: '2',
      name: 'Mary Johnson Poultry',
      cycles: 2,
      performance: 91.8,
    },
    {
      id: '3',
      name: 'Robert Davis Coop',
      cycles: 4,
      performance: 93.5,
    },
    {
      id: '4',
      name: 'Sarah Wilson Farms',
      cycles: 1,
      performance: 95.1,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Growers Management</Text>
          <Text style={styles.subtitle}>Manage all growers across cycles</Text>
        </View>

        {/* Growers List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Growers</Text>
          
          {growers.map((grower) => (
            <Card key={grower.id} style={styles.growerCard}>
              <CardContent style={styles.growerContent}>
                <View style={styles.growerHeader}>
                  <View style={styles.growerIcon}>
                    <Users size={24} color="#059669" />
                  </View>
                  <View style={styles.growerInfo}>
                    <Text style={styles.growerName}>{grower.name}</Text>
                    <Text style={styles.growerCycles}>{grower.cycles} cycles</Text>
                  </View>
                  <View style={styles.performanceContainer}>
                    <TrendingUp size={16} color="#059669" />
                    <Text style={styles.performanceValue}>{grower.performance}%</Text>
                  </View>
                </View>
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
    alignItems: 'center',
  },
  growerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  growerInfo: {
    flex: 1,
  },
  growerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  growerCycles: {
    fontSize: 14,
    color: '#94a3b8',
  },
  performanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  performanceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginLeft: 4,
  },
});

export default GrowersManagement;
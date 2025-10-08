import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, CardContent } from './components/ui/card';
import { Calendar, Users, Package, ChevronRight, Bell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const Cycles = () => {
  const navigation = useNavigation();
  const [cycles, setCycles] = useState([
    {
      id: '1',
      name: 'Cycle #2023-001',
      startDate: '2023-10-01',
      farmerCount: 12,
      chickCount: 24000,
      status: 'Active',
    },
    {
      id: '2',
      name: 'Cycle #2023-002',
      startDate: '2023-09-15',
      farmerCount: 8,
      chickCount: 16000,
      status: 'Harvesting',
    },
  ]);
  
  const handleCyclePress = (cycle) => {
    // @ts-ignore - Navigation typing will be handled by React Navigation
    navigation.navigate('CycleManagement', { cycle });
  };

  const handleNotificationPress = () => {
    // @ts-ignore - Navigation typing will be handled by React Navigation
    navigation.navigate('Notifications');
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Panel Header with Notification Bell */}
        <View style={styles.panelHeader}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Poultry Cycles</Text>
            <Text style={styles.subtitle}>Manage production cycles</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={handleNotificationPress}
            activeOpacity={0.7}
          >
            <Bell size={24} color="#0f172a" />
            {/* Notification badge (optional) */}
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>5</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Cycles List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Cycles</Text>
          
          {cycles.map((cycle) => (
            <TouchableOpacity 
              key={cycle.id}
              onPress={() => handleCyclePress(cycle)}
            >
              <Card style={styles.cycleCard}>
                <CardContent style={styles.cycleContent}>
                  <View style={styles.cycleHeader}>
                    <Text style={styles.cycleName}>{cycle.name}</Text>
                    <View style={styles.cycleHeaderRight}>
                      <Text style={[styles.status, 
                        cycle.status === 'Active' ? styles.activeStatus :
                        cycle.status === 'Harvesting' ? styles.harvestingStatus :
                        styles.newStatus
                      ]}>
                        {cycle.status}
                      </Text>
                      <ChevronRight size={20} color="#94A3B8" />
                    </View>
                  </View>
                  
                  <View style={styles.cycleDetails}>
                    <View style={styles.detailItem}>
                      <Calendar size={16} color="#94A3B8" />
                      <Text style={styles.detailText}>{cycle.startDate}</Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                      <Users size={16} color="#94A3B8" />
                      <Text style={styles.detailText}>{cycle.farmerCount} farmers</Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                      <Package size={16} color="#94A3B8" />
                      <Text style={styles.detailText}>{cycle.chickCount.toLocaleString()} chicks</Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
            </TouchableOpacity>
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
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16, // Add spacing at the top
    paddingHorizontal: 8, // Add horizontal padding
  },
  headerTextContainer: {
    flex: 1,
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
  notificationButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
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
  cycleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cycleContent: {
    padding: 16,
  },
  cycleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cycleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  cycleHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 8,
  },
  activeStatus: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  harvestingStatus: {
    backgroundColor: '#ffedd5',
    color: '#9a3412',
  },
  newStatus: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
  },
  cycleDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
  },
});

export default Cycles;
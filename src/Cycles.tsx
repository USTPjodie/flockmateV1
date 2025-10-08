import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card, CardContent } from './components/ui/card';
import { Calendar, Users, Package, ChevronRight, Bell, Plus } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as SQLite from './database/sqlite';
import { randomUUID } from 'expo-crypto';
import { useCallback } from 'react';

const Cycles = ({ route }: any) => {
  const navigation = useNavigation();
  const [cycles, setCycles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadCycles();
    }, [])
  );

  const loadCycles = async () => {
    try {
      setLoading(true);
      const cyclesData: any = await SQLite.getAllCycles();
      setCycles(cyclesData || []);
    } catch (error) {
      console.error('Error loading cycles:', error);
      setCycles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCyclePress = (cycle) => {
    // @ts-ignore - Navigation typing will be handled by React Navigation
    navigation.navigate('CycleManagement', { cycle });
  };

  const handleNotificationPress = () => {
    // @ts-ignore - Navigation typing will be handled by React Navigation
    navigation.navigate('Notifications');
  };

  const handleAddCycle = () => {
    // @ts-ignore - Navigation typing will be handled by React Navigation
    navigation.navigate('StartNewCycle');
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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

        {/* Cycles List Header with Add Button */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Cycles</Text>
          <TouchableOpacity 
            style={styles.addCycleButton}
            onPress={handleAddCycle}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        {/* Cycles List */}
        <View style={styles.section}>
          {loading ? (
            <Text>Loading cycles...</Text>
          ) : cycles.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No cycles found</Text>
              <Text style={styles.emptyStateSubtext}>Create a new cycle to get started</Text>
            </View>
          ) : (
            cycles.map((cycle) => (
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
                        <Text style={styles.detailText}>{formatDate(cycle.start_date)}</Text>
                      </View>
                      
                      <View style={styles.detailItem}>
                        <Users size={16} color="#94A3B8" />
                        <Text style={styles.detailText}>{cycle.farmer_count} farmers</Text>
                      </View>
                      
                      <View style={styles.detailItem}>
                        <Package size={16} color="#94A3B8" />
                        <Text style={styles.detailText}>{cycle.chick_count?.toLocaleString() || 0} chicks</Text>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              </TouchableOpacity>
            ))
          )}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  addCycleButton: {
    width: 36,
    height: 36,
    borderRadius: 8, // Square with rounded corners
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  section: {
    marginBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#64748b',
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
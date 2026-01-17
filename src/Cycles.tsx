import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card, CardContent } from './components/ui/card';
import { Calendar, Users, Package, ChevronRight, Plus } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeProvider';
import * as DataService from './services/dataService';

const Cycles = ({ route }: any) => {
  const navigation = useNavigation();
  const [cycles, setCycles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, role } = useAuth();
  const { theme } = useTheme();

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadCycles();
    }, [user, role])
  );

  const loadCycles = async () => {
    try {
      setLoading(true);
      let cyclesData: any = [];
      
      if (role === 'grower' && user?.email) {
        // For growers, only show cycles linked to them
        const growerData: any = await DataService.getGrowerByEmail(user.email);
        if (growerData) {
          cyclesData = await DataService.getCyclesByGrowerId(growerData.id);
        }
      } else {
        // For technicians and other roles, show all cycles
        cyclesData = await DataService.getAllCycles();
      }
      
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
    // Only technicians should be able to add cycles
    if (role === 'technician') {
      // @ts-ignore - Navigation typing will be handled by React Navigation
      navigation.navigate('StartNewCycle');
    } else {
      Alert.alert('Permission Denied', 'Only technicians can create new cycles.');
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Panel Header */}
        <View style={[styles.panelHeader, { backgroundColor: theme.primary, borderRadius: 16, padding: 12 }]}>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.title, { color: theme.white }]}>Poultry Cycles</Text>
            <Text style={[styles.subtitle, { color: theme.white + 'CC' }]}>Manage production cycles</Text>
          </View>
        </View>

        {/* Cycles List Header with Add Button */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Active Cycles</Text>
          {role === 'technician' && (
            <TouchableOpacity 
              style={[styles.addCycleButton, { backgroundColor: theme.primary }]}
              onPress={handleAddCycle}
            >
              <Plus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Cycles List */}
        <View style={styles.section}>
          {loading ? (
            <Text style={{ color: theme.textSecondary }}>Loading cycles...</Text>
          ) : cycles.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: theme.text }]}>
                No cycles found
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: theme.textSecondary }]}>
                {role === 'grower' 
                  ? 'You have not been assigned to any cycles yet.' 
                  : 'Create a new cycle to get started'}
              </Text>
            </View>
          ) : (
            cycles.map((cycle) => (
              <TouchableOpacity 
                key={cycle.id}
                onPress={() => handleCyclePress(cycle)}
              >
                <Card style={[styles.cycleCard, { backgroundColor: theme.cardBackground }]}>
                  <CardContent style={styles.cycleContent}>
                    <View style={styles.cycleHeader}>
                      <Text style={[styles.cycleName, { color: theme.text }]}>{cycle.name}</Text>
                      <View style={styles.cycleHeaderRight}>
                        <Text style={[styles.status, 
                          cycle.status === 'Active' ? styles.activeStatus :
                          cycle.status === 'Harvesting' ? styles.harvestingStatus :
                          styles.newStatus,
                          { color: cycle.status === 'Active' ? theme.success : cycle.status === 'Harvesting' ? theme.warning : theme.info }
                        ]}>
                          {cycle.status}
                        </Text>
                        <ChevronRight size={20} color={theme.textSecondary} />
                      </View>
                    </View>
                    
                    <View style={styles.cycleDetails}>
                      <View style={styles.detailItem}>
                        <Calendar size={16} color={theme.textSecondary} />
                        <Text style={[styles.detailText, { color: theme.textSecondary }]}>{formatDate(cycle.start_date)}</Text>
                      </View>
                      
                      <View style={styles.detailItem}>
                        <Users size={16} color={theme.textSecondary} />
                        <Text style={[styles.detailText, { color: theme.textSecondary }]}>{cycle.farmer_count} farmers</Text>
                      </View>
                      
                      <View style={styles.detailItem}>
                        <Package size={16} color={theme.textSecondary} />
                        <Text style={[styles.detailText, { color: theme.textSecondary }]}>{cycle.chick_count?.toLocaleString() || 0} chicks</Text>
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 48,
    paddingBottom: 100,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addCycleButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
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
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
  },
  cycleCard: {
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cycleContent: {
    padding: 12,
    paddingVertical: 10,
  },
  cycleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cycleName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cycleHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 8,
  },
  activeStatus: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  harvestingStatus: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  newStatus: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
    fontSize: 13,
    marginLeft: 4,
  },
});

export default Cycles;
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, CardContent } from './components/ui/card';
import { 
  RotateCw, 
  Package, 
  Truck, 
  Scale, 
  FileText, 
  Edit3, 
  Trash2, 
  ChevronRight,
  BarChart3,
  Calendar,
  Leaf
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from './database/sqlite';

const CycleManagement = ({ route }: any) => {
  const navigation = useNavigation();
  const { cycle } = route?.params || {};
  const [cycleData, setCycleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCycleData();
  }, []);

  const loadCycleData = async () => {
    try {
      setLoading(true);
      if (cycle?.id) {
        const data: any = await SQLite.getCycleById(cycle.id);
        if (data) {
          setCycleData(data);
        } else {
          // Fallback to passed cycle data
          setCycleData(cycle);
        }
      } else {
        // Default data if no cycle is passed
        setCycleData({
          id: '1',
          name: 'Cycle #2023-001',
          start_date: '2023-10-01',
          farmer_count: 12,
          chick_count: 24000,
          status: 'Active',
        });
      }
    } catch (error) {
      console.error('Error loading cycle data:', error);
      // Fallback to passed cycle data or default
      setCycleData(cycle || {
        id: '1',
        name: 'Cycle #2023-001',
        start_date: '2023-10-01',
        farmer_count: 12,
        chick_count: 24000,
        status: 'Active',
      });
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const cycleFunctions = [
    {
      id: 'startNew',
      title: 'Start New Cycle',
      description: 'Create a new production cycle for assigned growers',
      icon: RotateCw,
      color: '#059669',
    },
    {
      id: 'docLoading',
      title: 'DOC Loading',
      description: 'Record delivery details of Day-Old Chicks',
      icon: Package,
      color: '#0ea5e9',
    },
    {
      id: 'supplyDelivery',
      title: 'Supply Delivery',
      description: 'Record and track supply deliveries to growers',
      icon: Truck,
      color: '#8b5cf6',
    },
    {
      id: 'resubmitSupply',
      title: 'Resubmit Supply Delivery',
      description: 'Edit and resubmit supply delivery data',
      icon: Edit3,
      color: '#f59e0b',
    },
    {
      id: 'makeHarvest',
      title: 'Make Harvest',
      description: 'Record harvest data per grower',
      icon: Scale,
      color: '#ef4444',
    },
    {
      id: 'resubmitHarvest',
      title: 'Resubmit Harvest',
      description: 'Edit and resubmit harvest records',
      icon: Edit3,
      color: '#f59e0b',
    },
    {
      id: 'reconciliation',
      title: 'Reconciliation of Performance',
      description: 'Finalize performance indicators',
      icon: FileText,
      color: '#6366f1',
    },
    {
      id: 'postHarvest',
      title: 'Post-harvest',
      description: 'Complete post-harvest checklist',
      icon: BarChart3,
      color: '#059669',
    },
  ];

  const handleFunctionPress = (functionId: string) => {
    // Navigate to specific function screens based on functionId
    const navigationData = { cycle: cycleData };
    
    switch (functionId) {
      case 'startNew':
        // Navigate to start new cycle screen
        // @ts-ignore
        navigation.navigate('StartNewCycle', navigationData);
        break;
      case 'docLoading':
        // Navigate to DOC loading screen
        // @ts-ignore
        navigation.navigate('DocLoading', navigationData);
        break;
      case 'supplyDelivery':
        // Navigate to supply delivery screen
        // @ts-ignore
        navigation.navigate('SupplyDelivery', navigationData);
        break;
      case 'resubmitSupply':
        // Navigate to resubmit supply screen
        // @ts-ignore
        navigation.navigate('ResubmitSupply', navigationData);
        break;
      case 'makeHarvest':
        // Navigate to make harvest screen
        // @ts-ignore
        navigation.navigate('MakeHarvest', navigationData);
        break;
      case 'resubmitHarvest':
        // Navigate to resubmit harvest screen
        // @ts-ignore
        navigation.navigate('ResubmitHarvest', navigationData);
        break;
      case 'reconciliation':
        // Navigate to reconciliation screen
        // @ts-ignore
        navigation.navigate('Reconciliation', navigationData);
        break;
      case 'postHarvest':
        // Navigate to post-harvest screen
        // @ts-ignore
        navigation.navigate('PostHarvest', navigationData);
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading cycle data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{cycleData?.name || 'Cycle Management'}</Text>
          <Text style={styles.subtitle}>Cycle Management</Text>
        </View>

        {/* Cycle Info Card */}
        <Card style={styles.infoCard}>
          <CardContent style={styles.infoContent}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Calendar size={16} color="#94A3B8" />
                <Text style={styles.infoText}>{cycleData ? formatDate(cycleData.start_date) : 'N/A'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Leaf size={16} color="#94A3B8" />
                <Text style={styles.infoText}>{cycleData?.chick_count?.toLocaleString() || 0} chicks</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Leaf size={16} color="#94A3B8" />
                <Text style={styles.infoText}>{cycleData?.farmer_count || 0} farmers</Text>
              </View>
              <View style={styles.statusContainer}>
                <Text style={[styles.status, 
                  cycleData?.status === 'Active' ? styles.activeStatus :
                  cycleData?.status === 'Harvesting' ? styles.harvestingStatus :
                  styles.newStatus
                ]}>
                  {cycleData?.status || 'Unknown'}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Functions List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cycle Functions</Text>
          {cycleFunctions.map((func) => {
            const IconComponent = func.icon;
            return (
              <TouchableOpacity 
                key={func.id}
                style={styles.functionCard}
                onPress={() => handleFunctionPress(func.id)}
              >
                <Card style={styles.card}>
                  <CardContent style={styles.cardContent}>
                    <View style={styles.functionHeader}>
                      <View style={[styles.iconContainer, { backgroundColor: `${func.color}20` }]}>
                        <IconComponent size={24} color={func.color} />
                      </View>
                      <View style={styles.functionText}>
                        <Text style={styles.functionTitle}>{func.title}</Text>
                        <Text style={styles.functionDescription}>{func.description}</Text>
                      </View>
                      <ChevronRight size={20} color="#94A3B8" />
                    </View>
                  </CardContent>
                </Card>
              </TouchableOpacity>
            );
          })}
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
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoContent: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#64748b',
    marginLeft: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },
  activeStatus: {
    backgroundColor: '#ecfdf5',
    color: '#059669',
  },
  harvestingStatus: {
    backgroundColor: '#fff7ed',
    color: '#f59e0b',
  },
  newStatus: {
    backgroundColor: '#eff6ff',
    color: '#3b82f6',
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
  functionCard: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardContent: {
    padding: 16,
  },
  functionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  functionText: {
    flex: 1,
  },
  functionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  functionDescription: {
    fontSize: 14,
    color: '#94a3b8',
  },
});

export default CycleManagement;
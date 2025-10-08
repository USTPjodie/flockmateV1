import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, CardContent } from './components/ui/card';
import { Users, TrendingUp, BarChart3, Bell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Cycles: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const GrowersManagement = () => {
  const navigation = useNavigation<NavigationProp>();
  
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

  const handleManageCycles = () => {
    // Navigate to the Cycles tab
    // @ts-ignore - Navigation typing will be handled by React Navigation
    navigation.navigate('Cycles');
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
            <Text style={styles.title}>Growers Management</Text>
            <Text style={styles.subtitle}>Manage all growers across cycles</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={handleNotificationPress}
            activeOpacity={0.7}
          >
            <Bell size={24} color="#0f172a" />
            {/* Notification badge (optional) */}
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>4</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Management Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Management Options</Text>
          
          <TouchableOpacity onPress={handleManageCycles}>
            <Card style={styles.optionCard}>
              <CardContent style={styles.optionContent}>
                <View style={styles.optionHeader}>
                  <View style={styles.optionIcon}>
                    <BarChart3 size={20} color="#059669" />
                  </View>
                  <View style={styles.optionText}>
                    <Text style={styles.optionTitle}>Manage & Monitor Cycles</Text>
                    <Text style={styles.optionDescription}>View and manage all ongoing cycles</Text>
                  </View>
                </View>
              </CardContent>
            </Card>
          </TouchableOpacity>
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
  optionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  optionContent: {
    padding: 16,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    color: '#94a3b8',
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
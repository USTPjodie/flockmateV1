import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, CardContent } from './components/ui/card';
import { Package, Users, TrendingUp, Bell } from 'lucide-react-native';
import { Bird } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from './database/sqlite';
import { useAuth } from './contexts/AuthContext';

const Home = () => {
  const navigation = useNavigation();
  const { user, role } = useAuth();
  const [stats, setStats] = useState({
    totalFarmers: 0,
    activeCycles: 0,
    totalChicks: 0,
    avgPerformance: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user, role]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load growers count
      const growers: any = await SQLite.getAllGrowers();
      const totalFarmers = growers?.length || 0;
      
      // Load cycles count and chick count
      const cycles: any = await SQLite.getAllCycles();
      const activeCycles = cycles?.length || 0;
      const totalChicks = cycles?.reduce((sum: number, cycle: any) => sum + (cycle.chick_count || 0), 0) || 0;
      
      // For demo purposes, we'll use a fixed average performance
      const avgPerformance = 92.5;
      
      setStats({
        totalFarmers,
        activeCycles,
        totalChicks,
        avgPerformance,
      });
      
      // For demo purposes, we'll use fixed recent activity
      setRecentActivity([
        { id: 1, farmer: 'John Smith', action: 'Started new cycle', time: '2 hours ago' },
        { id: 2, farmer: 'Mary Johnson', action: 'Submitted harvest report', time: '5 hours ago' },
        { id: 3, farmer: 'Robert Davis', action: 'Recorded DOC loading', time: '1 day ago' },
        { id: 4, farmer: 'Sarah Wilson', action: 'Requested supply delivery', time: '1 day ago' },
        { id: 5, farmer: 'Michael Brown', action: 'Completed post-harvest checklist', time: '2 days ago' },
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Fallback to default values
      setStats({
        totalFarmers: 0,
        activeCycles: 0,
        totalChicks: 0,
        avgPerformance: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationPress = () => {
    // @ts-ignore - Navigation typing will be handled by React Navigation
    navigation.navigate('Notifications');
  };

  // Determine welcome message based on user role
  const getWelcomeMessage = () => {
    if (user?.full_name) {
      return `Welcome back, ${user.full_name}!`;
    }
    return role === 'technician' 
      ? 'Welcome back, Technician!' 
      : 'Welcome back, Grower!';
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
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.subtitle}>{getWelcomeMessage()}</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={handleNotificationPress}
            activeOpacity={0.7}
          >
            <Bell size={24} color="#0f172a" />
            {/* Notification badge (optional) */}
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Card style={styles.card}>
              <CardContent style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Users size={24} color="#059669" />
                  <Text style={styles.cardTitle}>Farmers</Text>
                </View>
                <Text style={styles.statValue}>{loading ? '--' : stats.totalFarmers}</Text>
                <Text style={styles.cardDescription}>Active growers</Text>
              </CardContent>
            </Card>
          </View>

          <View style={styles.statCard}>
            <Card style={styles.card}>
              <CardContent style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Package size={24} color="#059669" />
                  <Text style={styles.cardTitle}>Cycles</Text>
                </View>
                <Text style={styles.statValue}>{loading ? '--' : stats.activeCycles}</Text>
                <Text style={styles.cardDescription}>Ongoing cycles</Text>
              </CardContent>
            </Card>
          </View>

          <View style={styles.statCard}>
            <Card style={styles.card}>
              <CardContent style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Bird size={24} color="#059669" />
                  <Text style={styles.cardTitle}>Chicks</Text>
                </View>
                <Text style={styles.statValue}>{loading ? '--' : stats.totalChicks.toLocaleString()}</Text>
                <Text style={styles.cardDescription}>Total in cycle</Text>
              </CardContent>
            </Card>
          </View>

          <View style={styles.statCard}>
            <Card style={styles.card}>
              <CardContent style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <TrendingUp size={24} color="#059669" />
                  <Text style={styles.cardTitle}>Performance</Text>
                </View>
                <Text style={styles.statValue}>{loading ? '--' : `${stats.avgPerformance}%`}</Text>
                <Text style={styles.cardDescription}>Avg. success rate</Text>
              </CardContent>
            </Card>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivity.map((activity) => (
            <Card key={activity.id} style={styles.activityCard}>
              <CardContent style={styles.activityContent}>
                <Text style={styles.activityFarmer}>{activity.farmer}</Text>
                <Text style={styles.activityAction}>{activity.action}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
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
    paddingBottom: 32, // Extra padding at bottom for better scroll experience
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
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginLeft: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#94a3b8',
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
  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityContent: {
    padding: 16,
  },
  activityFarmer: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  activityAction: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#94a3b8',
  },
});

export default Home;
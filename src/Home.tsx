import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, CardContent } from './components/ui/card';
import { Package, Users, TrendingUp, Bell, Calendar, Scale, Activity } from 'lucide-react-native';
import { Bird } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from './database/sqlite';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeProvider';
import { useNotifications } from './contexts/NotificationContext';
import NotificationService from './services/notificationService';

const Home = () => {
  const navigation = useNavigation();
  const { user, role } = useAuth();
  const { theme } = useTheme();
  const { notificationCount } = useNotifications();
  const [stats, setStats] = useState({
    assignedCycles: 0,
    totalChicks: 0,
    avgPerformance: 0,
    upcomingTasks: 0,
  });
  const [myCycles, setMyCycles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulate receiving a notification when the component mounts
  useEffect(() => {
    // This is just for demonstration purposes
    // In a real app, this would be triggered by actual events
    const timer = setTimeout(() => {
      NotificationService.simulateNotification();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [user, role]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      if (role === 'grower' && user?.email) {
        // For growers, load their specific data
        const growerData: any = await SQLite.getGrowerByEmail(user.email);
        if (growerData) {
          const cycles: any = await SQLite.getCyclesByGrowerId(growerData.id);
          
          // Calculate grower-specific stats
          const assignedCycles = cycles?.length || 0;
          const totalChicks = cycles?.reduce((sum: number, cycle: any) => sum + (cycle.chick_count || 0), 0) || 0;
          
          // For demo purposes, we'll use a fixed average performance
          const avgPerformance = 88.5;
          
          // Count upcoming tasks (for demo, we'll use a fixed number)
          const upcomingTasks = cycles?.length * 2 || 0;
          
          setStats({
            assignedCycles,
            totalChicks,
            avgPerformance,
            upcomingTasks,
          });
          
          // Get the 3 most recent cycles for display
          const recentCycles = cycles?.slice(0, 3) || [];
          setMyCycles(recentCycles);
        }
      } else {
        // For technicians, load the existing data
        const growers: any = await SQLite.getAllGrowers();
        const totalFarmers = growers?.length || 0;
        
        const cycles: any = await SQLite.getAllCycles();
        const activeCycles = cycles?.length || 0;
        const totalChicks = cycles?.reduce((sum: number, cycle: any) => sum + (cycle.chick_count || 0), 0) || 0;
        
        // For demo purposes, we'll use a fixed average performance
        const avgPerformance = 92.5;
        
        setStats({
          assignedCycles: activeCycles,
          totalChicks,
          avgPerformance,
          upcomingTasks: 12, // Demo value
        });
        
        // Get the 3 most recent cycles for display
        const recentCycles = cycles?.slice(0, 3) || [];
        setMyCycles(recentCycles);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Fallback to default values
      setStats({
        assignedCycles: 0,
        totalChicks: 0,
        avgPerformance: 0,
        upcomingTasks: 0,
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
        {/* Header with Notification Bell */}
        <View style={[styles.panelHeader, { backgroundColor: theme.primary, borderRadius: 12, padding: 16 }]}>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.title, { color: theme.white }]}>Dashboard</Text>
            <Text style={[styles.subtitle, { color: theme.white + 'CC' }]}>{getWelcomeMessage()}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.notificationButton, { backgroundColor: theme.white + '20' }]}
            onPress={handleNotificationPress}
            activeOpacity={0.7}
          >
            <Bell size={24} color={theme.white} />
            {/* Notification badge */}
            {notificationCount > 0 && (
              <View style={[styles.notificationBadge, { backgroundColor: theme.highlight }]}>
                <Text style={styles.notificationBadgeText}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Removed Gamification Section for Growers */}

        {/* Stats Cards - Different for growers vs technicians */}
        <View style={styles.statsContainer}>
          {role === 'grower' ? (
            // Grower-specific stats without gamification
            <>
              <View style={styles.statCard}>
                <Card style={[styles.card, { backgroundColor: theme.cardBackground }]}>
                  <CardContent style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <Package size={24} color={theme.primary} />
                      <Text style={[styles.cardTitle, { color: theme.textTertiary }]}>My Cycles</Text>
                    </View>
                    <Text style={[styles.statValue, { color: theme.primary }]}>{loading ? '--' : stats.assignedCycles}</Text>
                    <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>Assigned cycles</Text>
                  </CardContent>
                </Card>
              </View>

              <View style={styles.statCard}>
                <Card style={[styles.card, { backgroundColor: theme.cardBackground }]}>
                  <CardContent style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <Bird size={24} color={theme.primary} />
                      <Text style={[styles.cardTitle, { color: theme.textTertiary }]}>My Chicks</Text>
                    </View>
                    <Text style={[styles.statValue, { color: theme.primary }]}>{loading ? '--' : stats.totalChicks.toLocaleString()}</Text>
                    <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>Total in my cycles</Text>
                  </CardContent>
                </Card>
              </View>

              <View style={styles.statCard}>
                <Card style={[styles.card, { backgroundColor: theme.cardBackground }]}>
                  <CardContent style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <TrendingUp size={24} color={theme.primary} />
                      <Text style={[styles.cardTitle, { color: theme.textTertiary }]}>Performance</Text>
                    </View>
                    <Text style={[styles.statValue, { color: theme.primary }]}>{loading ? '--' : `${stats.avgPerformance}%`}</Text>
                    <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>My success rate</Text>
                  </CardContent>
                </Card>
              </View>

              <View style={styles.statCard}>
                <Card style={[styles.card, { backgroundColor: theme.cardBackground }]}>
                  <CardContent style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <Calendar size={24} color={theme.primary} />
                      <Text style={[styles.cardTitle, { color: theme.textTertiary }]}>Tasks</Text>
                    </View>
                    <Text style={[styles.statValue, { color: theme.primary }]}>{loading ? '--' : stats.upcomingTasks}</Text>
                    <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>Upcoming tasks</Text>
                  </CardContent>
                </Card>
              </View>
            </>
          ) : (
            // Technician-specific stats without productivity focus
            <>
              <View style={styles.statCard}>
                <Card style={[styles.card, { backgroundColor: theme.cardBackground }]}>
                  <CardContent style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <Users size={24} color={theme.primary} />
                      <Text style={[styles.cardTitle, { color: theme.textTertiary }]}>Farmers</Text>
                    </View>
                    <Text style={[styles.statValue, { color: theme.primary }]}>{loading ? '--' : stats.assignedCycles}</Text>
                    <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>Active growers</Text>
                  </CardContent>
                </Card>
              </View>

              <View style={styles.statCard}>
                <Card style={[styles.card, { backgroundColor: theme.cardBackground }]}>
                  <CardContent style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <Package size={24} color={theme.primary} />
                      <Text style={[styles.cardTitle, { color: theme.textTertiary }]}>Cycles</Text>
                    </View>
                    <Text style={[styles.statValue, { color: theme.primary }]}>{loading ? '--' : stats.assignedCycles}</Text>
                    <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>Ongoing cycles</Text>
                  </CardContent>
                </Card>
              </View>

              <View style={styles.statCard}>
                <Card style={[styles.card, { backgroundColor: theme.cardBackground }]}>
                  <CardContent style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <Bird size={24} color={theme.primary} />
                      <Text style={[styles.cardTitle, { color: theme.textTertiary }]}>Chicks</Text>
                    </View>
                    <Text style={[styles.statValue, { color: theme.primary }]}>{loading ? '--' : stats.totalChicks.toLocaleString()}</Text>
                    <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>Total in cycle</Text>
                  </CardContent>
                </Card>
              </View>

              <View style={styles.statCard}>
                <Card style={[styles.card, { backgroundColor: theme.cardBackground }]}>
                  <CardContent style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <TrendingUp size={24} color={theme.primary} />
                      <Text style={[styles.cardTitle, { color: theme.textTertiary }]}>Performance</Text>
                    </View>
                    <Text style={[styles.statValue, { color: theme.primary }]}>{loading ? '--' : `${stats.avgPerformance}%`}</Text>
                    <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>Avg. success rate</Text>
                  </CardContent>
                </Card>
              </View>
            </>
          )}
        </View>

        {/* My Cycles Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {role === 'grower' ? 'My Cycles' : 'Recent Cycles'}
          </Text>
          {myCycles.length === 0 ? (
            <Card style={[styles.emptyCard, { backgroundColor: theme.cardBackground }]}>
              <CardContent style={styles.emptyCardContent}>
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                  {role === 'grower' 
                    ? 'You have not been assigned to any cycles yet.' 
                    : 'No cycles found.'}
                </Text>
              </CardContent>
            </Card>
          ) : (
            myCycles.map((cycle) => (
              <Card key={cycle.id} style={[styles.cycleCard, { backgroundColor: theme.cardBackground }]}>
                <CardContent style={styles.cycleContent}>
                  <View style={styles.cycleHeader}>
                    <Text style={[styles.cycleName, { color: theme.text }]}>{cycle.name}</Text>
                    <Text style={[styles.status, 
                      cycle.status === 'Active' ? styles.activeStatus :
                      cycle.status === 'Harvesting' ? styles.harvestingStatus :
                      styles.newStatus,
                      { color: cycle.status === 'Active' ? '#166534' : cycle.status === 'Harvesting' ? '#9a3412' : '#1e40af' }
                    ]}>
                      {cycle.status}
                    </Text>
                  </View>
                  
                  <View style={styles.cycleDetails}>
                    <View style={styles.detailItem}>
                      <Calendar size={16} color={theme.textSecondary} />
                      <Text style={[styles.detailText, { color: theme.textSecondary }]}>Start: {formatDate(cycle.start_date)}</Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                      <Bird size={16} color={theme.textSecondary} />
                      <Text style={[styles.detailText, { color: theme.textSecondary }]}>{cycle.chick_count?.toLocaleString() || 0} chicks</Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))
          )}
        </View>

        {/* Performance Insights for Growers */}
        {role === 'grower' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Performance Insights</Text>
            <Card style={[styles.insightsCard, { backgroundColor: theme.cardBackground }]}>
              <CardContent style={styles.insightsContent}>
                <View style={styles.insightRow}>
                  <Activity size={20} color={theme.primary} />
                  <Text style={[styles.insightText, { color: theme.text }]}>Your performance is 5% above average for similar farms</Text>
                </View>
                <View style={styles.insightRow}>
                  <Scale size={20} color={theme.primary} />
                  <Text style={[styles.insightText, { color: theme.text }]}>Recommended to increase feed by 2% for better growth</Text>
                </View>
              </CardContent>
            </Card>
          </View>
        )}
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
    paddingBottom: 32,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
    paddingHorizontal: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 20,
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
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Removed gamificationSection styles
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
    borderRadius: 16,
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
    marginLeft: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cycleCard: {
    borderRadius: 16,
    marginBottom: 12,
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
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(220, 252, 231, 0.5)',
  },
  activeStatus: {
    backgroundColor: 'rgba(220, 252, 231, 0.5)',
  },
  harvestingStatus: {
    backgroundColor: 'rgba(255, 237, 213, 0.5)',
  },
  newStatus: {
    backgroundColor: 'rgba(219, 234, 254, 0.5)',
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
    marginLeft: 4,
  },
  emptyCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyCardContent: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  insightsCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  insightsContent: {
    padding: 16,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
});

export default Home;
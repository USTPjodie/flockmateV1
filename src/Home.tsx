import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
// @ts-ignore - react-native-chart-kit has type compatibility issues with React 19
import { BarChart } from 'react-native-chart-kit';
import { Card, CardContent } from './components/ui/card';
import { Package, Users, TrendingUp, Bell, Scale, Activity, Award, Zap, WifiOff } from 'lucide-react-native';
import { Bird } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import * as DataService from './services/dataService';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeProvider';
import { useNotifications } from './contexts/NotificationContext';
import NotificationService from './services/notificationService';
import OfflineService from './services/offlineService';

const Home = () => {
  const navigation = useNavigation();
  const { user, role, isOfflineMode } = useAuth();
  const { theme } = useTheme();
  const { unreadCount, addNotification } = useNotifications();
  const [stats, setStats] = useState({
    assignedCycles: 0,
    totalChicks: 0,
    avgPerformance: 0,
    upcomingTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  // Update pending sync count
  useEffect(() => {
    const updateSyncCount = () => {
      setPendingSyncCount(OfflineService.getSyncQueueCount());
    };
    
    updateSyncCount();
    const interval = setInterval(updateSyncCount, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Listen for network status changes
  useEffect(() => {
    const removeListener = OfflineService.addNetworkListener((online) => {
      setIsOnline(online);
      if (online && !loading) {
        // Reload data when coming back online
        loadDashboardData();
      }
    });

    return () => removeListener();
  }, [loading]);

  // Initialize notification service
  useEffect(() => {
    NotificationService.setAddNotificationCallback(addNotification);
  }, [addNotification]);

  // Demo: Simulate notifications for testing
  useEffect(() => {
    if (role === 'grower') {
      // Simulate a notification after 3 seconds
      const timer = setTimeout(() => {
        NotificationService.notifyCycleStarted('Cycle 2024-001', 'Your Farm');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [role]);

  useEffect(() => {
    loadDashboardData();
  }, [user, role]);

  // Debug logging
  useEffect(() => {
    console.log('🔍 Dashboard Debug:');
    console.log('  - Role:', role);
    console.log('  - Loading:', loading);
    console.log('  - Avg Performance:', stats.avgPerformance);
    console.log('  - Should show graph:', role === 'grower' && !loading);
  }, [role, loading, stats]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      if (role === 'grower' && user?.email) {
        // For growers, load their specific data
        const growerData: any = await DataService.getGrowerByEmail(user.email);
        if (growerData) {
          const cycles: any = await DataService.getCyclesByGrowerId(growerData.id);
          
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
        }
      } else {
        // For technicians, load the existing data
        const growers: any = await DataService.getAllGrowers();
        const totalFarmers = growers?.length || 0;
        
        const cycles: any = await DataService.getAllCycles();
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
    if (user?.user_metadata?.full_name) {
      return `Welcome back, ${user.user_metadata.full_name}!`;
    }
    return role === 'technician' 
      ? 'Welcome back, Technician!' 
      : 'Welcome back, Grower!';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Fixed Header with Notification Bell and Offline Indicator */}
      <View style={[styles.panelHeader, { backgroundColor: theme.primary, borderRadius: 16, padding: 12 }]}>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.title, { color: theme.white }]}>Dashboard</Text>
          <View style={styles.subtitleRow}>
            <Text style={[styles.subtitle, { color: theme.white + 'CC' }]}>{getWelcomeMessage()}</Text>
            {(isOfflineMode || !isOnline) && (
              <View style={styles.offlineBadge}>
                <WifiOff size={12} color="#FFFFFF" />
                <Text style={styles.offlineText}>Offline</Text>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.notificationButton, { backgroundColor: theme.white + '20' }]}
          onPress={handleNotificationPress}
          activeOpacity={0.7}
        >
          <Bell size={20} color={theme.white} />
          {unreadCount > 0 && (
            <View style={[styles.notificationBadge, { backgroundColor: theme.highlight }]}>
              <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >

        {/* Sync Status Banner */}
        {pendingSyncCount > 0 && (
          <View style={[styles.syncBanner, { backgroundColor: '#FEF3C7' }]}>
            <Activity size={16} color="#92400E" />
            <Text style={styles.syncBannerText}>
              {isOnline 
                ? `Syncing ${pendingSyncCount} pending change${pendingSyncCount > 1 ? 's' : ''}...`
                : `${pendingSyncCount} change${pendingSyncCount > 1 ? 's' : ''} waiting to sync`
              }
            </Text>
          </View>
        )}

        {/* Stats Cards - Horizontal 3-column layout like reference */}
        <View style={styles.statsContainer}>
          {role === 'grower' ? (
            // Grower-specific stats - 3 columns
            <>
              <View style={styles.statCard}>
                <Card style={[styles.card, { backgroundColor: theme.cardBackground }]}>
                  <CardContent style={styles.cardContent}>
                    <View style={[styles.iconCircle, { backgroundColor: theme.primary + '15' }]}>
                      <Package size={16} color={theme.primary} strokeWidth={2.5} />
                    </View>
                    <View style={styles.cardTextContent}>
                      <Text style={[styles.statValue, { color: theme.text }]}>
                        {loading ? '--' : stats.assignedCycles}
                      </Text>
                      <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>Cycles</Text>
                    </View>
                  </CardContent>
                </Card>
              </View>

              <View style={styles.statCard}>
                <Card style={[styles.card, { backgroundColor: theme.cardBackground }]}>
                  <CardContent style={styles.cardContent}>
                    <View style={[styles.iconCircle, { backgroundColor: theme.primary + '15' }]}>
                      <Bird size={16} color={theme.primary} strokeWidth={2.5} />
                    </View>
                    <View style={styles.cardTextContent}>
                      <Text style={[styles.statValue, { color: theme.text }]}>
                        {loading ? '--' : stats.totalChicks.toLocaleString()}
                      </Text>
                      <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>Birds</Text>
                    </View>
                  </CardContent>
                </Card>
              </View>

              <View style={styles.statCard}>
                <Card style={[styles.card, { backgroundColor: theme.cardBackground }]}>
                  <CardContent style={styles.cardContent}>
                    <View style={[styles.iconCircle, { backgroundColor: theme.primary + '15' }]}>
                      <TrendingUp size={16} color={theme.primary} strokeWidth={2.5} />
                    </View>
                    <View style={styles.cardTextContent}>
                      <Text style={[styles.statValue, { color: theme.text }]}>
                        {loading ? '--' : `${stats.avgPerformance}%`}
                      </Text>
                      <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>Performance</Text>
                    </View>
                  </CardContent>
                </Card>
              </View>
            </>
          ) : (
            // Technician-specific stats - 3 columns
            <>
              <View style={styles.statCard}>
                <Card style={[styles.card, { backgroundColor: theme.cardBackground }]}>
                  <CardContent style={styles.cardContent}>
                    <View style={[styles.iconCircle, { backgroundColor: theme.primary + '15' }]}>
                      <Users size={16} color={theme.primary} strokeWidth={2.5} />
                    </View>
                    <View style={styles.cardTextContent}>
                      <Text style={[styles.statValue, { color: theme.text }]}>
                        {loading ? '--' : stats.assignedCycles}
                      </Text>
                      <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>Farmers</Text>
                    </View>
                  </CardContent>
                </Card>
              </View>

              <View style={styles.statCard}>
                <Card style={[styles.card, { backgroundColor: theme.cardBackground }]}>
                  <CardContent style={styles.cardContent}>
                    <View style={[styles.iconCircle, { backgroundColor: theme.primary + '15' }]}>
                      <Package size={16} color={theme.primary} strokeWidth={2.5} />
                    </View>
                    <View style={styles.cardTextContent}>
                      <Text style={[styles.statValue, { color: theme.text }]}>
                        {loading ? '--' : stats.assignedCycles}
                      </Text>
                      <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>Cycles</Text>
                    </View>
                  </CardContent>
                </Card>
              </View>

              <View style={styles.statCard}>
                <Card style={[styles.card, { backgroundColor: theme.cardBackground }]}>
                  <CardContent style={styles.cardContent}>
                    <View style={[styles.iconCircle, { backgroundColor: theme.primary + '15' }]}>
                      <Bird size={16} color={theme.primary} strokeWidth={2.5} />
                    </View>
                    <View style={styles.cardTextContent}>
                      <Text style={[styles.statValue, { color: theme.text }]}>
                        {loading ? '--' : stats.totalChicks.toLocaleString()}
                      </Text>
                      <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>Birds</Text>
                    </View>
                  </CardContent>
                </Card>
              </View>
            </>
          )}
        </View>

        {/* Performance Graph - Only for Growers */}
        {role === 'grower' && !loading && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Performance Trend</Text>
            <Card style={[styles.graphCard, { backgroundColor: theme.cardBackground }]}>
              <CardContent style={styles.graphContent}>
                <View style={styles.chartContainer}>
                  {/* Bar Chart */}
                  {/* @ts-ignore - Type compatibility issue with React 19 */}
                  <BarChart
                    data={{
                      labels: ['C1', 'C2', 'C3', 'C4', 'C5'],
                      datasets: [
                        {
                          data: [
                            Math.max(stats.avgPerformance - 10, 70),
                            Math.max(stats.avgPerformance - 5, 75),
                            Math.max(stats.avgPerformance - 2, 80),
                            Math.max(stats.avgPerformance + 3, 85),
                            Math.max(stats.avgPerformance, 88)
                          ]
                        }
                      ]
                    }}
                    width={Dimensions.get('window').width - 80}
                    height={180}
                    yAxisSuffix="%"
                    fromZero={true}
                    chartConfig={{
                      backgroundColor: theme.cardBackground,
                      backgroundGradientFrom: theme.cardBackground,
                      backgroundGradientTo: theme.cardBackground,
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(0, 98, 58, ${opacity * 0.8})`,
                      labelColor: (opacity = 1) => theme.textSecondary,
                      barPercentage: 0.5,
                      fillShadowGradient: theme.primary,
                      fillShadowGradientOpacity: 1,
                      style: {
                        borderRadius: 16
                      },
                      propsForBackgroundLines: {
                        strokeDasharray: '',
                        stroke: theme.textSecondary,
                        strokeOpacity: 0.1,
                        strokeWidth: 1
                      }
                    }}
                    style={{
                      marginVertical: 8,
                      borderRadius: 16
                    }}
                  />
                  
                  {/* Touchable overlay for bar interaction */}
                  <View style={styles.barsOverlay}>
                    {['C1', 'C2', 'C3', 'C4', 'C5'].map((label, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.barTouchArea}
                        onPress={() => {
                          setSelectedBarIndex(index);
                          setTimeout(() => setSelectedBarIndex(null), 2000);
                        }}
                      >
                        {selectedBarIndex === index && (
                          <View style={[styles.valueTooltip, { backgroundColor: theme.primary }]}>
                            <Text style={styles.tooltipText}>
                              {[
                                Math.max(stats.avgPerformance - 10, 70),
                                Math.max(stats.avgPerformance - 5, 75),
                                Math.max(stats.avgPerformance - 2, 80),
                                Math.max(stats.avgPerformance + 3, 85),
                                Math.max(stats.avgPerformance, 88)
                              ][index].toFixed(0)}%
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <Text style={[styles.graphCaption, { color: theme.textSecondary }]}>Performance (%) across your last 5 cycles</Text>
              </CardContent>
            </Card>
          </View>
        )}

        {/* Debug: Show why graph might not be showing */}
        {role !== 'grower' && (
          <Card style={[styles.graphCard, { backgroundColor: theme.cardBackground }]}>
            <CardContent style={styles.graphContent}>
              <Text style={[styles.graphCaption, { color: theme.textSecondary }]}>Graph only shows for growers (you are: {role})</Text>
            </CardContent>
          </Card>
        )}
        {role === 'grower' && loading && (
          <Card style={[styles.graphCard, { backgroundColor: theme.cardBackground }]}>
            <CardContent style={styles.graphContent}>
              <Text style={[styles.graphCaption, { color: theme.textSecondary }]}>Loading data...</Text>
            </CardContent>
          </Card>
        )}

        {/* AI Insights Section - Only for Growers */}
        {role === 'grower' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>AI Insights</Text>
              <TouchableOpacity style={[styles.refreshButton, { backgroundColor: theme.primary }]}>
                <Zap size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <Card style={[styles.insightsCard, { backgroundColor: theme.cardBackground }]}>
              <CardContent style={styles.insightsContent}>
                <View style={styles.insightRow}>
                  <Award size={20} color={theme.highlight} />
                  <View style={styles.insightTextContainer}>
                    <Text style={[styles.insightTitle, { color: theme.text }]}>Optimal Conditions Detected</Text>
                    <Text style={[styles.insightDescription, { color: theme.textSecondary }]}>
                      Current environment supports 5% better growth rate than average
                    </Text>
                  </View>
                </View>
                
                <View style={styles.insightRow}>
                  <TrendingUp size={20} color={theme.success} />
                  <View style={styles.insightTextContainer}>
                    <Text style={[styles.insightTitle, { color: theme.text }]}>Growth Prediction</Text>
                    <Text style={[styles.insightDescription, { color: theme.textSecondary }]}>
                      Projected harvest weight: 2.4kg per bird (above target)
                    </Text>
                  </View>
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
    paddingTop: 16,
    paddingBottom: 100,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 48,
    marginBottom: 0,
    paddingHorizontal: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  offlineText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  syncBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  syncBannerText: {
    fontSize: 13,
    color: '#92400E',
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
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
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    minHeight: 80,
    maxHeight: 80,
    backgroundColor: 'transparent',
  },
  card: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    height: '100%',
    overflow: 'hidden',
  },
  cardContent: {
    padding: 10,
    paddingVertical: 8,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardTextContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  cardTitle: {
    fontSize: 9,
    fontWeight: '400',
    textAlign: 'center',
    letterSpacing: 0.2,
    marginBottom: 0,
    opacity: 0.7,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphCard: {
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  graphContent: {
    padding: 12,
    paddingVertical: 16,
  },
  graphCaption: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  chartContainer: {
    paddingVertical: 8,
    alignItems: 'center',
    position: 'relative',
  },
  barsOverlay: {
    position: 'absolute',
    bottom: 48,
    left: 64,
    right: 16,
    flexDirection: 'row',
    height: 120,
    alignItems: 'flex-end',
  },
  barTouchArea: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  valueTooltip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginTop: -10,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
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
  status: {
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
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
    fontSize: 13,
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
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  insightsContent: {
    padding: 12,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  insightTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 13,
  },
});

export default Home;
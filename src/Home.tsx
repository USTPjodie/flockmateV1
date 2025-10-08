import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, CardContent } from './components/ui/card';
import { Package, Users, TrendingUp } from 'lucide-react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { Bird } from 'lucide-react-native';

const Home = () => {
  // Sample data - in a real app this would come from your Supabase backend
  const stats = {
    totalFarmers: 24,
    activeCycles: 18,
    totalChicks: 45000,
    avgPerformance: 92.5,
  };

  const recentActivity = [
    { id: 1, farmer: 'John Smith', action: 'Started new cycle', time: '2 hours ago' },
    { id: 2, farmer: 'Mary Johnson', action: 'Submitted harvest report', time: '5 hours ago' },
    { id: 3, farmer: 'Robert Davis', action: 'Recorded DOC loading', time: '1 day ago' },
    { id: 4, farmer: 'Sarah Wilson', action: 'Requested supply delivery', time: '1 day ago' },
    { id: 5, farmer: 'Michael Brown', action: 'Completed post-harvest checklist', time: '2 days ago' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Welcome back, Technician!</Text>
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
                <Text style={styles.statValue}>{stats.totalFarmers}</Text>
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
                <Text style={styles.statValue}>{stats.activeCycles}</Text>
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
                <Text style={styles.statValue}>{stats.totalChicks.toLocaleString()}</Text>
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
                <Text style={styles.statValue}>{stats.avgPerformance}%</Text>
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
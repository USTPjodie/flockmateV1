import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Card, CardContent } from './ui/card';
import { Thermometer, Droplets, Wind, Moon, Zap, Award, TrendingUp } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeProvider';

const EnvironmentMonitoring = () => {
  const { theme } = useTheme();
  const [environmentData, setEnvironmentData] = useState({
    temperature: 24.5,
    humidity: 65,
  });
  
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'Temperature slightly above optimal range', time: '2 hours ago' },
    { id: 2, type: 'info', message: 'Humidity levels stable', time: '4 hours ago' },
  ]);
  
  const [animation] = useState(new Animated.Value(0));
  
  useEffect(() => {
    // Animate the monitoring cards when component mounts
    Animated.stagger(200, [
      Animated.spring(animation, { toValue: 1, useNativeDriver: true, delay: 100 }),
      Animated.spring(animation, { toValue: 1, useNativeDriver: true, delay: 200 }),
    ]).start();
    
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setEnvironmentData(prev => ({
        temperature: parseFloat((Math.random() * 5 + 22).toFixed(1)),
        humidity: Math.floor(Math.random() * 10 + 60),
      }));
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Get status color based on value
  const getStatusColor = (value: number, optimalRange: [number, number], warningRange?: [number, number]) => {
    if (warningRange && (value < warningRange[0] || value > warningRange[1])) {
      return theme.error;
    }
    if (value >= optimalRange[0] && value <= optimalRange[1]) {
      return theme.success;
    }
    return theme.warning;
  };
  
  // Get status text based on value
  const getStatusText = (value: number, optimalRange: [number, number], warningRange?: [number, number]) => {
    if (warningRange && (value < warningRange[0] || value > warningRange[1])) {
      return 'Critical';
    }
    if (value >= optimalRange[0] && value <= optimalRange[1]) {
      return 'Optimal';
    }
    return 'Suboptimal';
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.primary, borderRadius: 12, padding: 16, marginBottom: 24 }]}>
          <Text style={[styles.title, { color: theme.white }]}>Environment Monitoring</Text>
          <Text style={[styles.subtitle, { color: theme.white + 'CC' }]}>Real-time flock conditions</Text>
        </View>
        
        {/* Environment Cards */}
        <View style={styles.grid}>
          {/* Temperature Card */}
          <View style={styles.cardContainer}>
            <Card style={[styles.metricCard, { backgroundColor: theme.cardBackground }]}>
              <CardContent style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Thermometer size={24} color={getStatusColor(environmentData.temperature, [20, 26], [18, 30])} />
                  <Text style={[styles.cardTitle, { color: theme.textTertiary }]}>Temperature</Text>
                </View>
                <Text style={[styles.metricValue, { color: theme.text }]}>{environmentData.temperature}°C</Text>
                <Text style={[styles.statusText, { color: getStatusColor(environmentData.temperature, [20, 26], [18, 30]) }]}>
                  {getStatusText(environmentData.temperature, [20, 26], [18, 30])}
                </Text>
                <Text style={[styles.rangeText, { color: theme.textSecondary }]}>Optimal: 20-26°C</Text>
              </CardContent>
            </Card>
          </View>
          
          {/* Humidity Card */}
          <View style={styles.cardContainer}>
            <Card style={[styles.metricCard, { backgroundColor: theme.cardBackground }]}>
              <CardContent style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Droplets size={24} color={getStatusColor(environmentData.humidity, [60, 70], [50, 80])} />
                  <Text style={[styles.cardTitle, { color: theme.textTertiary }]}>Humidity</Text>
                </View>
                <Text style={[styles.metricValue, { color: theme.text }]}>{environmentData.humidity}%</Text>
                <Text style={[styles.statusText, { color: getStatusColor(environmentData.humidity, [60, 70], [50, 80]) }]}>
                  {getStatusText(environmentData.humidity, [60, 70], [50, 80])}
                </Text>
                <Text style={[styles.rangeText, { color: theme.textSecondary }]}>Optimal: 60-70%</Text>
              </CardContent>
            </Card>
          </View>
        </View>
        
        {/* AI Insights Section */}
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
        
        {/* Alerts Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Alerts</Text>
          
          {alerts.map((alert) => (
            <Card key={alert.id} style={[styles.alertCard, { backgroundColor: theme.cardBackground }]}>
              <CardContent style={styles.alertContent}>
                <View style={styles.alertHeader}>
                  <View style={[
                    styles.alertIcon, 
                    { 
                      backgroundColor: alert.type === 'warning' 
                        ? 'rgba(245, 158, 11, 0.1)' 
                        : 'rgba(59, 130, 246, 0.1)' 
                    }
                  ]}>
                    {alert.type === 'warning' ? (
                      <Moon size={16} color={theme.warning} />
                    ) : (
                      <Wind size={16} color={theme.info} />
                    )}
                  </View>
                  <View style={styles.alertTextContainer}>
                    <Text style={[styles.alertMessage, { color: theme.text }]}>{alert.message}</Text>
                    <Text style={[styles.alertTime, { color: theme.textSecondary }]}>{alert.time}</Text>
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
    marginTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  cardContainer: {
    width: '48%',
    marginBottom: 16,
  },
  metricCard: {
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
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  rangeText: {
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
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
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightsCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  insightsContent: {
    padding: 16,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  insightTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
  },
  alertCard: {
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  alertContent: {
    padding: 16,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  alertIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  alertMessage: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 14,
  },
});

export default EnvironmentMonitoring;
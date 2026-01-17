import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { Card, CardContent } from './ui/card';
import { Thermometer, Droplets, Wind, Gauge, Eye, CloudRain, Sunrise, MapPin, Cloud } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeProvider';
import WeatherService, { WeatherData } from '../services/weatherService';
import * as Location from 'expo-location';

const EnvironmentMonitoring = () => {
  const { theme } = useTheme();
  const [environmentData, setEnvironmentData] = useState({
    temperature: 24.5,
    humidity: 65,
  });
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  const [animation] = useState(new Animated.Value(0));
  
  useEffect(() => {
    // Animate the monitoring cards when component mounts
    Animated.stagger(200, [
      Animated.spring(animation, { toValue: 1, useNativeDriver: true, delay: 100 }),
      Animated.spring(animation, { toValue: 1, useNativeDriver: true, delay: 200 }),
    ]).start();
    
    // Request location permission and get location
    requestLocationPermission();
    
    // Simulate real-time environment data updates
    const interval = setInterval(() => {
      setEnvironmentData(prev => ({
        temperature: parseFloat((Math.random() * 5 + 22).toFixed(1)),
        humidity: Math.floor(Math.random() * 10 + 60),
      }));
    }, 10000);
    
    // Refresh weather data every 10 minutes
    const weatherInterval = setInterval(() => {
      if (location) {
        loadWeatherData();
      }
    }, 600000);
    
    return () => {
      clearInterval(interval);
      clearInterval(weatherInterval);
    };
  }, [location]);

  const requestLocationPermission = async () => {
    try {
      console.log('📍 Requesting location permission...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setLocationError('Location permission denied');
        console.log('❌ Location permission denied');
        // Use default location as fallback
        setLocation({ latitude: 14.5995, longitude: 120.9842 }); // Manila coordinates
        loadWeatherData();
        return;
      }

      console.log('✅ Location permission granted, getting current position...');
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const { latitude, longitude } = currentLocation.coords;
      console.log(`🌍 Location obtained: ${latitude}, ${longitude}`);
      
      setLocation({ latitude, longitude });
      setLocationError(null);
      
      // Load weather data with actual location
      loadWeatherData(latitude, longitude);
    } catch (error) {
      console.error('❌ Error getting location:', error);
      setLocationError('Failed to get location');
      // Use default location as fallback
      setLocation({ latitude: 14.5995, longitude: 120.9842 });
      loadWeatherData(14.5995, 120.9842);
    }
  };

  const loadWeatherData = async (lat?: number, lon?: number) => {
    try {
      setLoadingWeather(true);
      
      const latitude = lat || location?.latitude || 14.5995;
      const longitude = lon || location?.longitude || 120.9842;
      
      console.log(`🌦️ Fetching weather for: ${latitude}, ${longitude}`);
      
      // Try to get actual weather by coordinates
      let weather = await WeatherService.getWeatherByCoords(latitude, longitude);
      
      // If API fails, use mock data
      if (!weather) {
        console.log('⚠️ Weather API failed, using mock data');
        weather = WeatherService.getMockWeatherData(`Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`);
      }
      
      setWeatherData(weather);
    } catch (error) {
      console.error('❌ Error loading weather data:', error);
      // Use mock data as fallback
      const latitude = lat || location?.latitude || 14.5995;
      const longitude = lon || location?.longitude || 120.9842;
      setWeatherData(WeatherService.getMockWeatherData(`Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`));
    } finally {
      setLoadingWeather(false);
    }
  };
  
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
        <View style={[styles.header, { backgroundColor: theme.primary, borderRadius: 16, padding: 12, marginBottom: 12 }]}>
          <Text style={[styles.title, { color: theme.white }]}>Environment Monitoring</Text>
          <Text style={[styles.subtitle, { color: theme.white + 'CC' }]}>Real-time flock conditions</Text>
        </View>
        
        {/* Unified Weather & Environment Card */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Environmental Data</Text>
            <TouchableOpacity 
              style={[styles.refreshButton, { backgroundColor: theme.primary }]}
              onPress={() => loadWeatherData()}
            >
              <Wind size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          {loadingWeather ? (
            <Card style={[styles.unifiedCard, { backgroundColor: theme.cardBackground }]}>
              <CardContent style={styles.unifiedContent}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading data...</Text>
              </CardContent>
            </Card>
          ) : weatherData ? (
            <>
              {/* Outdoor Weather Card */}
              <Card style={[styles.weatherCard, { backgroundColor: theme.cardBackground }]}>
                <CardContent style={styles.cardContentPadded}>
                  {/* Top: Location and Date */}
                  <View style={styles.weatherTopSection}>
                    <View style={styles.locationRow}>
                      <MapPin size={14} color={locationError ? '#EF4444' : theme.primary} />
                      <Text style={[styles.locationTextSmall, { color: theme.textSecondary }]}>
                        {weatherData.location}
                      </Text>
                      {locationError && (
                        <Text style={[styles.locationErrorText, { color: '#EF4444' }]}> (Default)</Text>
                      )}
                    </View>
                    <Text style={[styles.dateText, { color: theme.textTertiary }]}>Today</Text>
                  </View>
                  
                  {/* Center: Large Weather Icon and Temperature */}
                  <View style={styles.weatherMainDisplay}>
                    {/* Large Weather Icon */}
                    <View style={styles.weatherIconContainer}>
                      <View style={[styles.weatherIconCircle, { backgroundColor: '#E3F2FD' }]}>
                        {weatherData.cloudiness > 70 ? (
                          <CloudRain size={80} color="#64B5F6" strokeWidth={1.5} />
                        ) : weatherData.cloudiness > 30 ? (
                          <Cloud size={80} color="#81C784" strokeWidth={1.5} />
                        ) : (
                          <Cloud size={80} color="#FFD54F" strokeWidth={1.5} />
                        )}
                      </View>
                    </View>
                    
                    {/* Temperature Display */}
                    <View style={styles.temperatureDisplay}>
                      <Text style={[styles.mainTemperature, { color: theme.text }]}>{Math.round(weatherData.temperature)}°</Text>
                      <Text style={[styles.feelsLikeTemp, { color: theme.textSecondary }]}>/{Math.round(weatherData.feelsLike)}°</Text>
                    </View>
                  </View>
                  
                  {/* Weather Description */}
                  <Text style={[styles.weatherDescriptionCenter, { color: theme.text }]}>
                    {weatherData.description.charAt(0).toUpperCase() + weatherData.description.slice(1)}
                  </Text>
                  
                  {/* Bottom: Horizontal Metrics */}
                  <View style={styles.weatherMetricsRow}>
                    {/* Precipitation/Humidity */}
                    <View style={styles.metricItem}>
                      <Droplets size={24} color={theme.primary} strokeWidth={2} />
                      <Text style={[styles.metricValue, { color: theme.text }]}>{weatherData.humidity}%</Text>
                      <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Humidity</Text>
                    </View>
                    
                    {/* Pressure */}
                    <View style={styles.metricItem}>
                      <Gauge size={24} color={theme.primary} strokeWidth={2} />
                      <Text style={[styles.metricValue, { color: theme.text }]}>{weatherData.pressure}</Text>
                      <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Pressure</Text>
                    </View>
                    
                    {/* Wind Speed */}
                    <View style={styles.metricItem}>
                      <Wind size={24} color={theme.primary} strokeWidth={2} />
                      <Text style={[styles.metricValue, { color: theme.text }]}>{weatherData.windSpeed} m/s</Text>
                      <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Wind speed</Text>
                    </View>
                  </View>
                  
                  {/* Additional Info Row */}
                  <View style={styles.additionalInfoRow}>
                    <View style={styles.infoItem}>
                      <Eye size={16} color={theme.textTertiary} />
                      <Text style={[styles.infoText, { color: theme.textSecondary }]}>{weatherData.visibility} km</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <CloudRain size={16} color={theme.textTertiary} />
                      <Text style={[styles.infoText, { color: theme.textSecondary }]}>{weatherData.cloudiness}% clouds</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Sunrise size={16} color={theme.textTertiary} />
                      <Text style={[styles.infoText, { color: theme.textSecondary }]}>{WeatherService.formatTime(weatherData.sunrise * 1000)}</Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
              
              {/* Indoor Environment Card */}
              <Card style={[styles.indoorCard, { backgroundColor: theme.cardBackground }]}>
                <CardContent style={styles.cardContentPadded}>
                  {/* Indoor Section Title */}
                  <View style={styles.cardHeader}>
                    <View style={styles.sectionTitleRow}>
                      <Thermometer size={20} color={theme.primary} />
                      <Text style={[styles.cardSectionTitle, { color: theme.text }]}>Indoor Environment</Text>
                    </View>
                  </View>
                  
                  <View style={styles.indoorGrid}>
                    {/* Indoor Temperature */}
                    <View style={styles.indoorItem}>
                      <View style={[styles.iconWrapper3d, { backgroundColor: '#FF9A8B' }]}>
                        <Thermometer size={28} color="#FFFFFF" strokeWidth={2.5} />
                      </View>
                      <Text style={[styles.indoorValue, { color: theme.text }]}>{environmentData.temperature}°C</Text>
                      <Text style={[styles.indoorLabel, { color: theme.textSecondary }]}>Temperature</Text>
                      <Text style={[styles.statusBadge, { 
                        color: getStatusColor(environmentData.temperature, [20, 26], [18, 30]),
                        backgroundColor: getStatusColor(environmentData.temperature, [20, 26], [18, 30]) + '20'
                      }]}>
                        {getStatusText(environmentData.temperature, [20, 26], [18, 30])}
                      </Text>
                      <Text style={[styles.rangeTextSmall, { color: theme.textTertiary }]}>Target: 20-26°C</Text>
                    </View>
                    
                    {/* Indoor Humidity */}
                    <View style={styles.indoorItem}>
                      <View style={[styles.iconWrapper3d, { backgroundColor: '#4ECDC4' }]}>
                        <Droplets size={28} color="#FFFFFF" strokeWidth={2.5} />
                      </View>
                      <Text style={[styles.indoorValue, { color: theme.text }]}>{environmentData.humidity}%</Text>
                      <Text style={[styles.indoorLabel, { color: theme.textSecondary }]}>Humidity</Text>
                      <Text style={[styles.statusBadge, { 
                        color: getStatusColor(environmentData.humidity, [60, 70], [50, 80]),
                        backgroundColor: getStatusColor(environmentData.humidity, [60, 70], [50, 80]) + '20'
                      }]}>
                        {getStatusText(environmentData.humidity, [60, 70], [50, 80])}
                      </Text>
                      <Text style={[styles.rangeTextSmall, { color: theme.textTertiary }]}>Target: 60-70%</Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
            </>
          ) : null}
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
  header: {
    marginBottom: 12,
    marginTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
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
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardContent: {
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  rangeText: {
    fontSize: 11,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Unified Card Styles
  unifiedCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  unifiedContent: {
    padding: 20,
  },
  subsectionHeader: {
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationTextSmall: {
    fontSize: 14,
  },
  locationErrorText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  mainTempSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
    paddingVertical: 12,
  },
  iconWrapper3dLarge: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  tempInfo: {
    flex: 1,
  },
  mainTempLarge: {
    fontSize: 42,
    fontWeight: 'bold',
    lineHeight: 48,
  },
  weatherDesc: {
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 2,
  },
  feelsLikeLarge: {
    fontSize: 14,
    marginTop: 4,
  },
  weatherDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailItem: {
    width: '31%',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconWrapper3d: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  detailLabel: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },
  indoorGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  indoorItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  indoorValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  indoorLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  statusBadge: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rangeTextSmall: {
    fontSize: 10,
    marginTop: 4,
  },
  // Weather styles
  weatherCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  indoorCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardContentPadded: {
    padding: 16,
  },
  cardSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  // New Weather Layout Styles
  weatherTopSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
  },
  weatherMainDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 8,
    gap: 24,
  },
  weatherIconContainer: {
    alignItems: 'center',
  },
  weatherIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
  },
  temperatureDisplay: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  mainTemperature: {
    fontSize: 56,
    fontWeight: 'bold',
    lineHeight: 56,
  },
  feelsLikeTemp: {
    fontSize: 28,
    fontWeight: '600',
    marginTop: 4,
  },
  weatherDescriptionCenter: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },
  weatherMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 8,
    marginBottom: 8,
    marginHorizontal: -16,
  },
  metricItem: {
    alignItems: 'center',
    gap: 8,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  metricLabel: {
    fontSize: 12,
  },
  additionalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 4,
    paddingBottom: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 12,
  },
  weatherContent: {
    padding: 16,
  },
  loadingText: {
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  weatherHeader: {
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  weatherDescription: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  mainWeatherInfo: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  mainTemp: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  feelsLike: {
    fontSize: 14,
    marginTop: 4,
  },
  weatherGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  weatherCardContainer: {
    width: '48%',
    marginBottom: 12,
  },
  weatherDetailCard: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  weatherDetailContent: {
    padding: 12,
    alignItems: 'center',
  },
  weatherDetailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  weatherDetailLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  weatherDetailExtra: {
    fontSize: 11,
    marginTop: 2,
  },
  sunCard: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 16,
  },
  sunContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  sunItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sunDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  sunTextContainer: {
    marginLeft: 12,
  },
  sunLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  sunTime: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EnvironmentMonitoring;
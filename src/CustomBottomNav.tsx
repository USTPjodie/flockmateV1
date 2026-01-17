import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Platform,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Package, User, Users, Thermometer } from 'lucide-react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from './contexts/ThemeProvider';

const { width } = Dimensions.get('window');

const CustomBottomNav = ({ 
  state, 
  descriptors, 
  navigation,
  ...props
}: BottomTabBarProps & { userType?: 'grower' | 'technician' }) => {
  const userType = props.userType || 'grower';
  const insets = useSafeAreaInsets();
  const position = useRef(new Animated.Value(state.index)).current;
  const { theme } = useTheme();

  // Update position animation when index changes
  useEffect(() => {
    Animated.spring(position, {
      toValue: state.index,
      useNativeDriver: true,
      friction: 10,
      tension: 100,
    }).start();
  }, [state.index]);

  // Handle tab press with animation
  const handleTabPress = (index: number) => {
    // Check if route exists before navigating
    if (state.routes[index]) {
      navigation.navigate(state.routes[index].name);
    }
  };

  // Get icon for each route based on the route name and user type
  const getIconForRoute = (routeName: string) => {
    switch (routeName) {
      case 'Home':
        return Home;
      case 'Cycles':
        return Package;
      case 'Monitoring':
        return Thermometer;
      case 'Account':
        return User;
      case 'Growers':
        return Users;
      default:
        return Home;
    }
  };

  // Get label for each route based on the route name and user type
  const getLabelForRoute = (routeName: string) => {
    switch (routeName) {
      case 'Home':
        return 'Home';
      case 'Cycles':
        return 'Cycles';
      case 'Monitoring':
        return 'Monitoring';
      case 'Account':
        return 'Account';
      case 'Growers':
        return 'Growers';
      default:
        return routeName;
    }
  };

  // Filter routes based on user type
  const getFilteredRoutes = () => {
    if (userType === 'technician') {
      // Technicians see Home, Cycles, Growers, Account (no Monitoring)
      return state.routes.filter(route => route.name !== 'Monitoring');
    } else {
      // Growers see Home, Cycles, Monitoring, Account (no Growers)
      return state.routes.filter(route => route.name !== 'Growers');
    }
  };

  const filteredRoutes = getFilteredRoutes();
  const tabWidth = width / filteredRoutes.length;

  return (
    <View 
      style={[
        styles.container, 
        { 
          paddingBottom: insets.bottom,
        }
      ]}
    >
      {/* Animated indicator */}
      <Animated.View 
        style={[
          styles.indicator, 
          {
            width: tabWidth,
            transform: [{
              translateX: position.interpolate({
                inputRange: filteredRoutes.map((_, i) => i),
                outputRange: filteredRoutes.map((_, i) => i * tabWidth),
              })
            }]
          }
        ]} 
      />
      
      {/* Navigation bar */}
      <View style={styles.navBar}>
        {filteredRoutes.map((route, index) => {
          // Adjust index to match the original state for focused check
          const originalIndex = state.routes.findIndex(r => r.key === route.key);
          const isFocused = state.index === originalIndex;
          const IconComponent = getIconForRoute(route.name);
          
          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabButton}
              onPress={() => handleTabPress(originalIndex)}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                <IconComponent 
                  size={24} 
                  color={isFocused ? theme.primary : '#94A3B8'} 
                  style={styles.icon}
                />
                <Text style={[
                  styles.label, 
                  { color: isFocused ? theme.primary : '#94A3B8' }
                ]}>
                  {getLabelForRoute(route.name)}
                </Text>
                {isFocused && (
                  <View style={[styles.activeDot, { backgroundColor: theme.primary }]} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  indicator: {
    position: 'absolute',
    top: 0,
    height: 3,
    backgroundColor: '#00623a',
    borderRadius: 3,
    zIndex: 10,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  tabButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  activeDot: {
    position: 'absolute',
    bottom: -10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00623a',
  },
});

export default CustomBottomNav;
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
import { Home, RotateCw, User } from 'lucide-react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const { width } = Dimensions.get('window');

const CustomBottomNav: React.FC<BottomTabBarProps> = ({ 
  state, 
  descriptors, 
  navigation 
}) => {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fade in animation on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Handle tab press with animation
  const handleTabPress = (index: number) => {
    // Check if route exists before navigating
    if (state.routes[index]) {
      navigation.navigate(state.routes[index].name);
    }
  };

  // Get icon for each route based on the route name
  const getIconForRoute = (routeName: string) => {
    switch (routeName) {
      case 'Home':
        return Home;
      case 'Cycles':
        return RotateCw;
      case 'Account':
        return User;
      default:
        return Home;
    }
  };

  // Get label for each route based on the route name
  const getLabelForRoute = (routeName: string) => {
    switch (routeName) {
      case 'Home':
        return 'Home';
      case 'Cycles':
        return 'Cycles';
      case 'Account':
        return 'Account';
      default:
        return routeName;
    }
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          paddingBottom: insets.bottom,
          opacity: fadeAnim
        }
      ]}
    >
      {/* Top divider line */}
      <View style={styles.divider} />
      
      {/* Navigation bar */}
      <View style={styles.navBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const IconComponent = getIconForRoute(route.name);
          
          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabButton}
              onPress={() => handleTabPress(index)}
              activeOpacity={0.7}
            >
              <IconComponent 
                size={21} 
                color={isFocused ? '#059669' : '#94A3B8'} 
                style={styles.icon}
              />
              <Text style={[
                styles.label, 
                { color: isFocused ? '#059669' : '#94A3B8' }
              ]}>
                {getLabelForRoute(route.name)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  divider: {
    height: 0.8,
    backgroundColor: '#E2E8F0',
    width: '100%',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    minWidth: width / 3 - 20, // 3 tabs: Home, Cycles, Account
  },
  icon: {
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
});

export default CustomBottomNav;
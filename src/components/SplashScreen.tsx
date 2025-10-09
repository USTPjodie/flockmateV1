import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
  interpolate,
  Extrapolate,
  runOnJS
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(50);
  const textOpacity = useSharedValue(0);
  const containerOpacity = useSharedValue(1);
  
  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
      opacity: logoOpacity.value,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: textTranslateY.value }],
      opacity: textOpacity.value,
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: containerOpacity.value,
    };
  });

  useEffect(() => {
    // Logo animation sequence
    logoScale.value = withDelay(200, withSpring(1, { damping: 10, stiffness: 100 }));
    logoOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
    
    // Text animation sequence
    textOpacity.value = withDelay(800, withTiming(1, { duration: 600 }));
    textTranslateY.value = withDelay(800, withTiming(0, { 
      duration: 800,
      easing: Easing.out(Easing.exp)
    }));
    
    // Hide splash screen after animations complete
    setTimeout(() => {
      containerOpacity.value = withTiming(0, { duration: 400 }, () => {
        runOnJS(onFinish)();
      });
    }, 3000);
  }, []);

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <View style={styles.content}>
        <Animated.View style={animatedLogoStyle}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        
        <Animated.View style={[styles.textContainer, animatedTextStyle]}>
          <Text style={styles.title}>Flockmate</Text>
          <Text style={styles.subtitle}>Poultry Monitoring System</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default SplashScreen;
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomBottomNav from './CustomBottomNav';

// Placeholder screens
const HomeScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Home Screen</Text>
    <Text>This is the home screen content</Text>
  </View>
);

const CyclesScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Cycles Screen</Text>
    <Text>This is the cycles screen content</Text>
  </View>
);

const GrowersScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Growers Screen</Text>
    <Text>This is the growers screen content</Text>
  </View>
);

const AccountScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Account Screen</Text>
    <Text>This is the account screen content</Text>
  </View>
);

const AddScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Add Screen</Text>
    <Text>This is the add screen content</Text>
  </View>
);

// Create bottom tab navigator
const Tab = createBottomTabNavigator();

const CustomBottomNavDemo = () => {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Tab.Navigator
          id={undefined}
          initialRouteName="Home"
          tabBar={(props) => <CustomBottomNav {...props} />}
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: 'none' },
          }}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Cycles" component={CyclesScreen} />
          <Tab.Screen name="Add" component={AddScreen} />
          <Tab.Screen name="Growers" component={GrowersScreen} />
          <Tab.Screen name="Account" component={AccountScreen} />
        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#059669',
  },
});

export default CustomBottomNavDemo;
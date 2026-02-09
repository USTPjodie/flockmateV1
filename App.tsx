import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeProvider';
import { NotificationProvider, useNotifications } from './src/contexts/NotificationContext';
import NotificationService from './src/services/notificationService';
import { queryClient } from './src/lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import Login from './src/components/Login';
import { Toaster } from './src/components/ui/toaster';
import Home from './src/Home';
import Account from './src/Account';
import Cycles from './src/Cycles';
import CycleManagement from './src/CycleManagement';
import DocLoading from './src/DocLoading';
import StartNewCycle from './src/StartNewCycle';
import SupplyDelivery from './src/SupplyDelivery';
import ResubmitSupply from './src/ResubmitSupply';
import MakeHarvest from './src/MakeHarvest';
import ResubmitHarvest from './src/ResubmitHarvest';
import Reconciliation from './src/Reconciliation';
import PostHarvest from './src/PostHarvest';
import GrowersManagement from './src/GrowersManagement';
import CustomBottomNav from './src/CustomBottomNav';
import NotificationsPage from './src/components/NotificationsPage';
import ChangePassword from './src/components/ChangePassword';
import SplashScreen from './src/components/SplashScreen';
import TestGrowers from './src/testGrowers';
import { Home as HomeIcon, Package, User, Users, CalendarDays, Activity } from 'lucide-react-native';
import EnvironmentMonitoring from './src/components/EnvironmentMonitoring';
import CalendarView from './src/components/CalendarView';
import { Thermometer, Trophy } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const RootStack = createStackNavigator();

// Technician-specific navigation
function TechnicianCyclesStack() {
  return (
    <Stack.Navigator id={undefined}>
      <Stack.Screen 
        name="CyclesList" 
        component={Cycles}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CycleManagement" 
        component={CycleManagement}
        options={{ 
          headerShown: true,
          title: 'Cycle Management'
        }}
      />
      <Stack.Screen 
        name="DocLoading" 
        component={DocLoading}
        options={{ 
          headerShown: true,
          title: 'DOC Loading'
        }}
      />
      <Stack.Screen 
        name="StartNewCycle" 
        component={StartNewCycle}
        options={{ 
          headerShown: true,
          title: 'Start New Cycle'
        }}
      />
      <Stack.Screen 
        name="SupplyDelivery" 
        component={SupplyDelivery}
        options={{ 
          headerShown: true,
          title: 'Supply Delivery'
        }}
      />
      <Stack.Screen 
        name="ResubmitSupply" 
        component={ResubmitSupply}
        options={{ 
          headerShown: true,
          title: 'Resubmit Supply Delivery'
        }}
      />
      <Stack.Screen 
        name="MakeHarvest" 
        component={MakeHarvest}
        options={{ 
          headerShown: true,
          title: 'Make Harvest'
        }}
      />
      <Stack.Screen 
        name="ResubmitHarvest" 
        component={ResubmitHarvest}
        options={{ 
          headerShown: true,
          title: 'Resubmit Harvest'
        }}
      />
      <Stack.Screen 
        name="Reconciliation" 
        component={Reconciliation}
        options={{ 
          headerShown: true,
          title: 'Reconciliation of Performance'
        }}
      />
      <Stack.Screen 
        name="PostHarvest" 
        component={PostHarvest}
        options={{ 
          headerShown: true,
          title: 'Post-harvest'
        }}
      />
    </Stack.Navigator>
  );
}

// Grower-specific navigation
function GrowerCyclesStack() {
  return (
    <Stack.Navigator id={undefined}>
      <Stack.Screen 
        name="CyclesList" 
        component={Cycles}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CycleManagement" 
        component={CycleManagement}
        options={{ 
          headerShown: true,
          title: 'Cycle Management'
        }}
      />
      <Stack.Screen 
        name="DocLoading" 
        component={DocLoading}
        options={{ 
          headerShown: true,
          title: 'DOC Loading'
        }}
      />
      <Stack.Screen 
        name="SupplyDelivery" 
        component={SupplyDelivery}
        options={{ 
          headerShown: true,
          title: 'Supply Delivery'
        }}
      />
      <Stack.Screen 
        name="MakeHarvest" 
        component={MakeHarvest}
        options={{ 
          headerShown: true,
          title: 'Make Harvest'
        }}
      />
      <Stack.Screen 
        name="Reconciliation" 
        component={Reconciliation}
        options={{ 
          headerShown: true,
          title: 'Reconciliation of Performance'
        }}
      />
      <Stack.Screen 
        name="PostHarvest" 
        component={PostHarvest}
        options={{ 
          headerShown: true,
          title: 'Post-harvest'
        }}
      />
    </Stack.Navigator>
  );
}

function TechnicianAccountStack() {
  return (
    <Stack.Navigator id={undefined}>
      <Stack.Screen 
        name="AccountMain" 
        component={Account}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ChangePassword" 
        component={ChangePassword}
        options={{ 
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function TechnicianGrowersStack() {
  return (
    <Stack.Navigator id={undefined}>
      <Stack.Screen 
        name="GrowersMain" 
        component={GrowersManagement}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="TestGrowers" 
        component={TestGrowers}
        options={{ 
          headerShown: true,
          title: 'Test Growers'
        }}
      />
    </Stack.Navigator>
  );
}

function GrowerAccountStack() {
  return (
    <Stack.Navigator id={undefined}>
      <Stack.Screen 
        name="AccountMain" 
        component={Account}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ChangePassword" 
        component={ChangePassword}
        options={{ 
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function NotificationsStack() {
  return (
    <Stack.Navigator id={undefined}>
      <Stack.Screen 
        name="NotificationsMain" 
        component={NotificationsPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function MonitoringStack() {
  return (
    <Stack.Navigator id={undefined}>
      <Stack.Screen 
        name="EnvironmentMonitoring" 
        component={EnvironmentMonitoring}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function TechnicianTabs() {
  return (
    <Tab.Navigator
      id={undefined}
      tabBar={(props) => <CustomBottomNav {...props} userType="technician" />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Cycles" 
        component={TechnicianCyclesStack}
        options={{
          tabBarLabel: 'Cycles',
          tabBarIcon: ({ color, size }) => (
            <Package color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Growers" 
        component={TechnicianGrowersStack}
        options={{
          tabBarLabel: 'Growers',
          tabBarIcon: ({ color, size }) => (
            <Users color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={CalendarView}
        options={{
          tabBarLabel: 'Calendar',
          tabBarIcon: ({ color, size }) => (
            <CalendarDays color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Account" 
        component={TechnicianAccountStack}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function GrowerTabs() {
  return (
    <Tab.Navigator
      id={undefined}
      tabBar={(props) => <CustomBottomNav {...props} userType="grower" />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Cycles" 
        component={GrowerCyclesStack}
        options={{
          tabBarLabel: 'Cycles',
          tabBarIcon: ({ color, size }) => (
            <Package color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Monitoring" 
        component={MonitoringStack}
        options={{
          tabBarLabel: 'Monitoring',
          tabBarIcon: ({ color, size }) => (
            <Activity color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={CalendarView}
        options={{
          tabBarLabel: 'Calendar',
          tabBarIcon: ({ color, size }) => (
            <CalendarDays color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Account" 
        component={GrowerAccountStack}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MainAppNavigator() {
  const { user, role } = useAuth();
  
  return (
    <RootStack.Navigator id={undefined}>
      {user ? (
        <>
          <RootStack.Screen 
            name="MainTabs" 
            component={role === 'technician' ? TechnicianTabs : GrowerTabs}
            options={{ headerShown: false }}
          />
          <RootStack.Screen 
            name="Notifications" 
            component={NotificationsStack}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <RootStack.Screen 
          name="Login" 
          component={Login}
          options={{ headerShown: false }}
        />
      )}
    </RootStack.Navigator>
  );
}

function AppContent() {
  const { loading } = useAuth();
  const { theme, themeMode } = useTheme();
  const { addNotification } = useNotifications();
  const [showSplash, setShowSplash] = useState(true);

  // Initialize notification service with callback
  useEffect(() => {
    NotificationService.setAddNotificationCallback(addNotification);
  }, [addNotification]);

  // Hide splash screen after app is ready
  useEffect(() => {
    if (!showSplash) return;
    
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showSplash]);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <HomeIcon size={32} color="#2d7a4f" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={themeMode === 'dark' ? ['#0C3B2E', '#1A4D3D'] : ['#F8FAFC', '#E6F4EB']}
      style={styles.gradientContainer}
    >
      <NavigationContainer>
        <MainAppNavigator />
        <Toaster />
        <StatusBar style="auto" />
      </NavigationContainer>
    </LinearGradient>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
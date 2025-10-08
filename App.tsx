import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
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
import { Home as HomeIcon, Package, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function CyclesStack() {
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

function AccountStack() {
  return (
    <Stack.Navigator id={undefined}>
      <Stack.Screen 
        name="AccountMain" 
        component={Account}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="GrowersManagement" 
        component={GrowersManagement}
        options={{ 
          headerShown: true,
          title: 'Growers Management'
        }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      id={undefined}
      tabBar={(props) => <CustomBottomNav {...props} />}
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
        component={CyclesStack}
        options={{
          tabBarLabel: 'Cycles',
          tabBarIcon: ({ color, size }) => (
            <Package color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Account" 
        component={AccountStack}
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

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <HomeIcon size={32} color="#2d7a4f" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <Login />}
      <Toaster />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
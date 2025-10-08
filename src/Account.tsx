import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from './contexts/AuthContext';
import { Card, CardContent } from './components/ui/card';
import { User, Mail, LogOut, Bell, Key } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

const Account = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      await signOut();
      Toast.show({
        type: 'success',
        text1: 'Signed Out',
        text2: 'You have been successfully signed out',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Sign Out Failed',
        text2: 'An error occurred while signing out',
      });
    }
  };

  const handleNotificationPress = () => {
    // @ts-ignore - Navigation typing will be handled by React Navigation
    navigation.navigate('Notifications');
  };

  const handleChangePasswordPress = () => {
    // @ts-ignore - Navigation typing will be handled by React Navigation
    navigation.navigate('ChangePassword');
  };

  return (
    <View style={styles.container}>
      {/* Panel Header with Notification Bell */}
      <View style={styles.panelHeader}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Account</Text>
          <Text style={styles.subtitle}>Manage your profile and settings</Text>
        </View>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={handleNotificationPress}
          activeOpacity={0.7}
        >
          <Bell size={24} color="#0f172a" />
          {/* Notification badge (optional) */}
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* User Profile Card */}
      <Card style={styles.profileCard}>
        <CardContent style={styles.profileContent}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <User size={32} color="#059669" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.user_metadata?.full_name || 'User'}</Text>
              <View style={styles.emailContainer}>
                <Mail size={16} color="#94A3B8" />
                <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
              </View>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* Account Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        
        <TouchableOpacity onPress={handleChangePasswordPress}>
          <Card style={styles.optionCard}>
            <CardContent style={styles.optionContent}>
              <View style={styles.optionHeader}>
                <View style={styles.optionIcon}>
                  <Key size={20} color="#059669" />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>Change Password</Text>
                  <Text style={styles.optionDescription}>Update your password</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </TouchableOpacity>
      </View>

      {/* Sign Out Button */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut size={20} color="#FFFFFF" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16, // Add spacing at the top
    paddingHorizontal: 8, // Add horizontal padding
  },
  headerTextContainer: {
    flex: 1,
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
  notificationButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
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
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  profileContent: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileEmail: {
    fontSize: 16,
    color: '#64748b',
    marginLeft: 4,
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
  optionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  optionContent: {
    padding: 16,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    color: '#94a3b8',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default Account;
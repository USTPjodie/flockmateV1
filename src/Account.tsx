import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from './contexts/AuthContext';
import { Card, CardContent } from './components/ui/card';
import { User, Mail, LogOut, Key } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from './contexts/ThemeProvider';

const Account = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation();
  const { theme } = useTheme();

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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Panel Header */}
      <View style={[styles.panelHeader, { backgroundColor: theme.primary, borderRadius: 16, padding: 12 }]}>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.title, { color: theme.white }]}>Account</Text>
          <Text style={[styles.subtitle, { color: theme.white + 'CC' }]}>Manage your profile and settings</Text>
        </View>
      </View>

      {/* User Profile Card */}
      <Card style={[styles.profileCard, { backgroundColor: theme.cardBackground }]}>
        <CardContent style={styles.profileContent}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatar, { backgroundColor: theme.primary + '20' }]}>
              <User size={32} color={theme.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.text }]}>{user?.user_metadata?.full_name || user?.email || 'User'}</Text>
              <View style={styles.emailContainer}>
                <Mail size={16} color={theme.textSecondary} />
                <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>{user?.email || 'user@example.com'}</Text>
              </View>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* Account Options */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Account Settings</Text>
        
        <TouchableOpacity onPress={handleChangePasswordPress}>
          <Card style={[styles.optionCard, { backgroundColor: theme.cardBackground }]}>
            <CardContent style={styles.optionContent}>
              <View style={styles.optionHeader}>
                <View style={[styles.optionIcon, { backgroundColor: theme.primary + '20' }]}>
                  <Key size={20} color={theme.primary} />
                </View>
                <View style={styles.optionText}>
                  <Text style={[styles.optionTitle, { color: theme.text }]}>Change Password</Text>
                  <Text style={[styles.optionDescription, { color: theme.textSecondary }]}>Update your password</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </TouchableOpacity>
      </View>

      {/* Sign Out Button */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={[styles.signOutButton, { backgroundColor: theme.textSecondary }]} 
          onPress={handleSignOut}
        >
          <LogOut size={18} color="#FFFFFF" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 48,
    paddingBottom: 100,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
  },
  profileCard: {
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  profileContent: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileEmail: {
    fontSize: 14,
    marginLeft: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  optionCard: {
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  optionContent: {
    padding: 12,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
  },
  signOutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default Account;
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from './ui/card';
import { Loader2, Key } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from '../database/sqlite';

// Simple password hashing function (in production, use a proper library)
const hashPassword = (password: string): string => {
  // This is a simple hash for demonstration - use a proper library like bcrypt in production
  return btoa(password).split('').reverse().join('');
};

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigation = useNavigation();

  const handleChangePassword = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please fill in all fields',
      });
      return;
    }

    if (newPassword.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Password Too Short',
        text2: 'New password must be at least 6 characters',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Password Mismatch',
        text2: 'New password and confirmation do not match',
      });
      return;
    }

    if (currentPassword === newPassword) {
      Toast.show({
        type: 'error',
        text1: 'Same Password',
        text2: 'New password must be different from current password',
      });
      return;
    }

    setLoading(true);

    try {
      // First, re-authenticate the user with their current password
      if (!user) {
        throw new Error('User not authenticated');
      }

      const hashedCurrentPassword = hashPassword(currentPassword);
      
      // Check if current password is correct
      if (user.password_hash !== hashedCurrentPassword) {
        Toast.show({
          type: 'error',
          text1: 'Authentication Failed',
          text2: 'Current password is incorrect',
        });
        setLoading(false);
        return;
      }

      // Hash the new password
      const hashedNewPassword = hashPassword(newPassword);
      
      // Update the password in the database
      if (user.id) {
        await SQLite.updateUserPassword(user.id, hashedNewPassword);
      }

      Toast.show({
        type: 'success',
        text1: 'Password Updated',
        text2: 'Your password has been successfully changed',
      });

      // Clear form fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Navigate back to account page
      navigation.goBack();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error.message || 'Failed to update password',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Change Password</Text>
          <View style={styles.placeholder} />
        </View>

        <Card style={styles.card}>
          <CardContent style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Key size={32} color="#059669" />
            </View>
            <Text style={styles.description}>
              Enter your current password and a new password to update your account security.
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Current Password</Text>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                placeholder="Enter current password"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholder="Enter new password"
              />
              <Text style={styles.helperText}>
                Must be at least 6 characters long
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Confirm new password"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleChangePassword}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.buttonContent}>
                  <Loader2 size={16} color="#fff" />
                  <Text style={styles.buttonText}>Updating Password...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Change Password</Text>
              )}
            </TouchableOpacity>
          </CardContent>
        </Card>

        <View style={styles.securityTips}>
          <Text style={styles.tipsTitle}>Password Security Tips</Text>
          <View style={styles.tip}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Use at least 8 characters</Text>
          </View>
          <View style={styles.tip}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Include uppercase and lowercase letters</Text>
          </View>
          <View style={styles.tip}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Add numbers and special characters</Text>
          </View>
          <View style={styles.tip}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Avoid common words or personal information</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 48,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#059669',
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  placeholder: {
    width: 60, // To balance the header layout
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
  },
  cardContent: {
    padding: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  helperText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#059669',
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  securityTips: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  tip: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 16,
    color: '#059669',
    marginRight: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
});

export default ChangePassword;
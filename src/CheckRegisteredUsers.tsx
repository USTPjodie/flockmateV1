import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import * as SQLite from './database/sqlite';

const CheckRegisteredUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRegisteredUsers();
  }, []);

  const loadRegisteredUsers = async () => {
    try {
      setLoading(true);
      const usersData: any = await SQLite.getAllUsers();
      setUsers(usersData || []);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Error', 'Failed to load users: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Registered Users</Text>
        
        <View style={styles.controls}>
          <TouchableOpacity style={styles.refreshButton} onPress={loadRegisteredUsers}>
            <Text style={styles.buttonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
        
        {loading ? (
          <Text style={styles.loadingText}>Loading registered users...</Text>
        ) : users.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No users registered yet</Text>
            <Text style={styles.emptyStateSubtext}>Users will appear here after they sign up</Text>
          </View>
        ) : (
          <View style={styles.content}>
            <Text style={styles.summary}>Total registered users: {users.length}</Text>
            {users.map((user, index) => (
              <View key={user.id} style={styles.userCard}>
                <View style={styles.userHeader}>
                  <Text style={styles.userIndex}>#{index + 1}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.detailText}>Name: {user.full_name || 'Not provided'}</Text>
                  <Text style={styles.detailText}>Role: {user.role || 'Not specified'}</Text>
                  <Text style={styles.detailText}>Registered: {formatDate(user.created_at)}</Text>
                  <Text style={styles.userId}>User ID: {user.id}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
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
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 24,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 24,
  },
  refreshButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#64748b',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#64748b',
  },
  content: {
    gap: 16,
  },
  summary: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userIndex: {
    fontSize: 14,
    color: '#94a3b8',
  },
  userEmail: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    flex: 1,
    marginLeft: 8,
  },
  userDetails: {
    gap: 6,
  },
  detailText: {
    fontSize: 16,
    color: '#64748b',
  },
  userId: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginTop: 8,
  },
});

export default CheckRegisteredUsers;
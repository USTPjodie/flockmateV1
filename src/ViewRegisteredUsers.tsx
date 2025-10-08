import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as SQLite from './database/sqlite';

const ViewRegisteredUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData: any = await SQLite.getAllUsers();
      setUsers(usersData || []);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users: ' + (err as Error).message);
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
        
        {loading ? (
          <Text style={styles.loadingText}>Loading users...</Text>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadUsers}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : users.length === 0 ? (
          <Text style={styles.noUsersText}>No registered users found.</Text>
        ) : (
          <View style={styles.usersContainer}>
            <Text style={styles.summaryText}>Total users: {users.length}</Text>
            {users.map((user, index) => (
              <View key={user.id} style={styles.userCard}>
                <Text style={styles.userIndex}>#{index + 1}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userDetail}>Name: {user.full_name || 'Not provided'}</Text>
                <Text style={styles.userDetail}>Role: {user.role || 'Not specified'}</Text>
                <Text style={styles.userDetail}>Registered: {formatDate(user.created_at)}</Text>
                <Text style={styles.userId}>ID: {user.id}</Text>
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
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 24,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#64748b',
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  noUsersText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#64748b',
  },
  usersContainer: {
    gap: 16,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
    textAlign: 'center',
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
  userIndex: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  userDetail: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 4,
  },
  userId: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default ViewRegisteredUsers;
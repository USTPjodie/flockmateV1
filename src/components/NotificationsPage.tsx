import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, CardContent } from './ui/card';
import { Bell, X, CheckCircle, AlertTriangle, Info } from 'lucide-react-native';
import { useNotifications } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeProvider';

const NotificationsPage = ({ navigation }) => {
  const { notificationCount, resetNotifications } = useNotifications();
  const { theme } = useTheme();
  
  // Sample notifications data
  const notifications = [
    {
      id: '1',
      title: 'New Cycle Started',
      message: 'Cycle #2023-001 has been started by John Smith Farm',
      time: '2 hours ago',
      type: 'success',
      read: false,
    },
    {
      id: '2',
      title: 'Supply Delivery Due',
      message: 'Feed delivery is scheduled for tomorrow at Robert Davis Coop',
      time: '5 hours ago',
      type: 'warning',
      read: false,
    },
    {
      id: '3',
      title: 'Harvest Report Submitted',
      message: 'Mary Johnson Poultry has submitted their harvest report',
      time: '1 day ago',
      type: 'info',
      read: true,
    },
    {
      id: '4',
      title: 'DOC Loading Complete',
      message: 'DOC loading has been completed for Cycle #2023-002',
      time: '1 day ago',
      type: 'success',
      read: true,
    },
    {
      id: '5',
      title: 'Performance Alert',
      message: 'Mortality rate is above threshold for Cycle #2023-001',
      time: '2 days ago',
      type: 'error',
      read: true,
    },
  ];

  const getIconForType = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} color="#10B981" />;
      case 'warning':
        return <AlertTriangle size={20} color="#F59E0B" />;
      case 'error':
        return <AlertTriangle size={20} color="#EF4444" />;
      default:
        return <Info size={20} color="#3B82F6" />;
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'success':
        return '#10B981';
      case 'warning':
        return '#F59E0B';
      case 'error':
        return '#EF4444';
      default:
        return '#3B82F6';
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const markAsRead = (id: string) => {
    // In a real app, this would update the notification status in the database
    console.log('Marking notification as read:', id);
  };

  const markAllAsRead = () => {
    // In a real app, this would update all notifications status in the database
    console.log('Marking all notifications as read');
    resetNotifications();
  };

  const deleteNotification = (id: string) => {
    // In a real app, this would delete the notification from the database
    console.log('Deleting notification:', id);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <X size={24} color={theme.white} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.white }]}>Notifications</Text>
        <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
          <Text style={[styles.markAllText, { color: theme.white + 'CC' }]}>Mark All Read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell size={48} color="#94A3B8" />
            <Text style={styles.emptyStateTitle}>No Notifications</Text>
            <Text style={styles.emptyStateText}>You're all caught up! Check back later for new notifications.</Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <Card 
              key={notification.id} 
              style={[
                styles.notificationCard, 
                !notification.read && styles.unreadCard
              ]}
            >
              <CardContent style={styles.cardContent}>
                <View style={styles.notificationHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: `${getColorForType(notification.type)}10` }]}>
                    {getIconForType(notification.type)}
                  </View>
                  <View style={styles.notificationInfo}>
                    <Text style={[styles.notificationTitle, !notification.read && styles.unreadTitle]}>
                      {notification.title}
                    </Text>
                    <Text style={styles.notificationMessage}>{notification.message}</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => deleteNotification(notification.id)}
                    style={styles.deleteButton}
                  >
                    <X size={16} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.notificationFooter}>
                  <Text style={styles.notificationTime}>{notification.time}</Text>
                  {!notification.read && (
                    <TouchableOpacity 
                      onPress={() => markAsRead(notification.id)}
                      style={styles.markReadButton}
                    >
                      <Text style={styles.markReadText}>Mark as Read</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </CardContent>
            </Card>
          ))
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#6D9773',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  markAllButton: {
    padding: 8,
  },
  markAllText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 64,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  notificationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
  },
  cardContent: {
    padding: 16,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#64748b',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
  markReadButton: {
    padding: 6,
  },
  markReadText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
});

export default NotificationsPage;
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, CardContent } from './ui/card';
import { Bell, X, CheckCircle, AlertTriangle, Info, Package, Droplets, TrendingUp, Activity } from 'lucide-react-native';
import { useNotifications } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeProvider';

const NotificationsPage = ({ navigation }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const { theme } = useTheme();

  const getIconForType = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} color={theme.success} />;
      case 'warning':
        return <AlertTriangle size={20} color={theme.warning} />;
      case 'error':
        return <AlertTriangle size={20} color={theme.error} />;
      default:
        return <Info size={20} color={theme.info} />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cycle':
        return <Package size={16} color={theme.textSecondary} />;
      case 'supply':
        return <Droplets size={16} color={theme.textSecondary} />;
      case 'harvest':
        return <Activity size={16} color={theme.textSecondary} />;
      case 'performance':
        return <TrendingUp size={16} color={theme.textSecondary} />;
      default:
        return <Bell size={16} color={theme.textSecondary} />;
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'success':
        return theme.success;
      case 'warning':
        return theme.warning;
      case 'error':
        return theme.error;
      default:
        return theme.info;
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleNotificationPress = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    // Handle navigation based on notification data
    if (notification.data?.screen) {
      navigation.navigate(notification.data.screen, notification.data.params);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <X size={24} color={theme.white} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: theme.white }]}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={[styles.badge, { backgroundColor: theme.highlight }]}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
            <Text style={[styles.markAllText, { color: theme.white + 'CC' }]}>Mark All</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell size={48} color={theme.textSecondary} />
            <Text style={[styles.emptyStateTitle, { color: theme.text }]}>No Notifications</Text>
            <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
              You're all caught up! Check back later for new notifications.
            </Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              onPress={() => handleNotificationPress(notification)}
              activeOpacity={0.7}
            >
              <Card 
                style={[
                  styles.notificationCard,
                  { backgroundColor: theme.cardBackground },
                  !notification.read && [styles.unreadCard, { borderLeftColor: theme.primary }]
                ]}
              >
                <CardContent style={styles.cardContent}>
                  <View style={styles.notificationHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: `${getColorForType(notification.type)}15` }]}>
                      {getIconForType(notification.type)}
                    </View>
                    <View style={styles.notificationInfo}>
                      <View style={styles.titleRow}>
                        <Text style={[
                          styles.notificationTitle,
                          { color: theme.text },
                          !notification.read && styles.unreadTitle
                        ]}>
                          {notification.title}
                        </Text>
                        {getCategoryIcon(notification.category)}
                      </View>
                      <Text style={[styles.notificationMessage, { color: theme.textSecondary }]}>
                        {notification.message}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      onPress={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      style={styles.deleteButton}
                    >
                      <X size={16} color={theme.textSecondary} />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.notificationFooter}>
                    <Text style={[styles.notificationTime, { color: theme.textSecondary }]}>
                      {formatTime(notification.timestamp)}
                    </Text>
                    {!notification.read && (
                      <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />
                    )}
                  </View>
                </CardContent>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderBottomWidth: 0,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  badge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  markAllButton: {
    padding: 4,
  },
  markAllText: {
    fontSize: 13,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 100,
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
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  notificationCard: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  unreadCard: {
    borderLeftWidth: 3,
  },
  cardContent: {
    padding: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: 13,
    lineHeight: 18,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  notificationTime: {
    fontSize: 11,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default NotificationsPage;
// Notification service for managing app notifications
import { useNotifications } from '../contexts/NotificationContext';

class NotificationService {
  private static instance: NotificationService;
  private notificationContext: any = null;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Set the notification context (should be called once in the app)
  setNotificationContext(context: any) {
    this.notificationContext = context;
  }

  // Get current notification count
  getNotificationCount(): number {
    return this.notificationContext?.notificationCount || 0;
  }

  // Add a new notification
  addNotification() {
    this.notificationContext?.incrementNotification();
  }

  // Remove a notification
  removeNotification() {
    this.notificationContext?.decrementNotification();
  }

  // Reset all notifications
  resetNotifications() {
    this.notificationContext?.resetNotifications();
  }

  // Simulate receiving a notification from an external source
  simulateNotification() {
    // This would typically be called from:
    // - Push notification handler
    // - WebSocket message handler
    // - API polling callback
    this.addNotification();
  }
}

export default NotificationService.getInstance();
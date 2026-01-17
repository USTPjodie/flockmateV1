// Notification service for managing app notifications
import { Notification } from '../contexts/NotificationContext';

type NotificationCallback = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;

class NotificationService {
  private static instance: NotificationService;
  private addNotificationCallback: NotificationCallback | null = null;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Set the add notification callback
  setAddNotificationCallback(callback: NotificationCallback) {
    this.addNotificationCallback = callback;
  }

  // Create notification helpers for different scenarios
  
  // Cycle notifications
  notifyCycleStarted(cycleName: string, growerName: string) {
    this.addNotificationCallback?.({
      title: 'Cycle Started',
      message: `${cycleName} has been started for ${growerName}`,
      type: 'success',
      category: 'cycle',
      data: { screen: 'Cycles' }
    });
  }

  notifyCycleEnding(cycleName: string, daysLeft: number) {
    this.addNotificationCallback?.({
      title: 'Cycle Ending Soon',
      message: `${cycleName} will end in ${daysLeft} days. Prepare for harvest.`,
      type: 'warning',
      category: 'cycle',
      data: { screen: 'Cycles' }
    });
  }

  // Supply notifications
  notifySupplyDeliveryDue(growerName: string, deliveryDate: string) {
    this.addNotificationCallback?.({
      title: 'Supply Delivery Due',
      message: `Feed delivery scheduled for ${deliveryDate} at ${growerName}`,
      type: 'warning',
      category: 'supply',
    });
  }

  notifySupplyDelivered(growerName: string, amount: string) {
    this.addNotificationCallback?.({
      title: 'Supply Delivered',
      message: `${amount} of feed delivered to ${growerName}`,
      type: 'success',
      category: 'supply',
    });
  }

  notifyLowSupply(growerName: string, itemName: string) {
    this.addNotificationCallback?.({
      title: 'Low Supply Alert',
      message: `${itemName} running low at ${growerName}. Order soon.`,
      type: 'error',
      category: 'supply',
    });
  }

  // Harvest notifications
  notifyHarvestReportSubmitted(growerName: string) {
    this.addNotificationCallback?.({
      title: 'Harvest Report Submitted',
      message: `${growerName} has submitted their harvest report`,
      type: 'info',
      category: 'harvest',
    });
  }

  notifyHarvestScheduled(cycleName: string, harvestDate: string) {
    this.addNotificationCallback?.({
      title: 'Harvest Scheduled',
      message: `Harvest for ${cycleName} scheduled on ${harvestDate}`,
      type: 'info',
      category: 'harvest',
    });
  }

  // Performance notifications
  notifyHighMortality(cycleName: string, rate: number) {
    this.addNotificationCallback?.({
      title: 'High Mortality Alert',
      message: `Mortality rate ${rate.toFixed(1)}% exceeds threshold for ${cycleName}`,
      type: 'error',
      category: 'performance',
      data: { screen: 'Cycles' }
    });
  }

  notifyPoorPerformance(cycleName: string, metric: string) {
    this.addNotificationCallback?.({
      title: 'Performance Alert',
      message: `${metric} below expected levels for ${cycleName}`,
      type: 'warning',
      category: 'performance',
    });
  }

  notifyExcellentPerformance(cycleName: string) {
    this.addNotificationCallback?.({
      title: 'Excellent Performance',
      message: `${cycleName} is performing above target! Keep it up!`,
      type: 'success',
      category: 'performance',
    });
  }

  // Environment notifications
  notifyTemperatureAlert(location: string, temp: number) {
    this.addNotificationCallback?.({
      title: 'Temperature Alert',
      message: `Temperature ${temp}°C is outside optimal range at ${location}`,
      type: 'warning',
      category: 'environment',
    });
  }

  notifyHumidityAlert(location: string, humidity: number) {
    this.addNotificationCallback?.({
      title: 'Humidity Alert',
      message: `Humidity ${humidity}% is outside optimal range at ${location}`,
      type: 'warning',
      category: 'environment',
    });
  }

  // System notifications
  notifyDocLoadingComplete(cycleName: string) {
    this.addNotificationCallback?.({
      title: 'DOC Loading Complete',
      message: `Day-old chicks loading completed for ${cycleName}`,
      type: 'success',
      category: 'system',
    });
  }

  notifyDataSyncIssue() {
    this.addNotificationCallback?.({
      title: 'Sync Issue',
      message: 'Some data failed to sync. Please check your connection.',
      type: 'error',
      category: 'system',
    });
  }

  // Generic notification
  notify(
    title: string,
    message: string,
    type: 'success' | 'warning' | 'error' | 'info',
    category: 'cycle' | 'supply' | 'harvest' | 'environment' | 'system' | 'performance',
    data?: any
  ) {
    this.addNotificationCallback?.({
      title,
      message,
      type,
      category,
      data
    });
  }
}

export default NotificationService.getInstance();
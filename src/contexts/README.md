# Notification System

## Overview
The notification system in Flockmate provides a consistent way to display notification counts across all pages of the application. It uses React Context to manage the notification state globally.

## Components

### NotificationContext
The main context that manages the notification count state:
- `notificationCount`: Current number of unread notifications
- `incrementNotification()`: Increases the notification count by 1
- `decrementNotification()`: Decreases the notification count by 1 (minimum 0)
- `resetNotifications()`: Resets the notification count to 0

### NotificationProvider
The provider component that should wrap the entire application to make the notification context available to all components.

### useNotifications
A custom hook that provides easy access to the notification context from any component.

## Usage

### Setting up the Provider
The [NotificationProvider](file:///c:/Users/JODIE/Desktop/React/FlockmateV4/EnviroTrack/temp-expo-app/src/contexts/NotificationContext.tsx#L7-L34) should be added to your app's root component:

```tsx
import { NotificationProvider } from './src/contexts/NotificationContext';

export default function App() {
  return (
    <NotificationProvider>
      {/* Rest of your app */}
    </NotificationProvider>
  );
}
```

### Using in Components
To access the notification count in any component:

```tsx
import { useNotifications } from './src/contexts/NotificationContext';

const MyComponent = () => {
  const { notificationCount } = useNotifications();
  
  return (
    <View>
      {notificationCount > 0 && (
        <Text>You have {notificationCount} unread notifications</Text>
      )}
    </View>
  );
};
```

### Updating Notification Count
To modify the notification count:

```tsx
import { useNotifications } from './src/contexts/NotificationContext';

const MyComponent = () => {
  const { incrementNotification, decrementNotification, resetNotifications } = useNotifications();
  
  const handleNewNotification = () => {
    incrementNotification(); // Add a new notification
  };
  
  const handleReadNotification = () => {
    decrementNotification(); // Mark a notification as read
  };
  
  const handleClearAll = () => {
    resetNotifications(); // Clear all notifications
  };
};
```

## Notification Service
For more advanced usage, a [NotificationService](file:///c:/Users/JODIE/Desktop/React/FlockmateV4/EnviroTrack/temp-expo-app/src/services/notificationService.ts#L5-L53) class is available that provides a singleton interface to the notification system. This is useful for triggering notifications from utility functions or services.

## Consistency
All notification badges across the application now use the same notification count, ensuring consistency:
- Home screen
- Cycles screen
- Account screen
- Growers Management screen

When a notification is marked as read in the Notifications page, the count is reset to 0 across all screens.
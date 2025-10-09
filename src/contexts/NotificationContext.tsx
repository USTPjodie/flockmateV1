import React, { createContext, useContext, useState, useEffect } from 'react';

interface NotificationContextType {
  notificationCount: number;
  incrementNotification: () => void;
  decrementNotification: () => void;
  resetNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Load notification count from storage or API if needed
    // For now, we'll start with 0
  }, []);

  const incrementNotification = () => {
    setNotificationCount(prev => prev + 1);
  };

  const decrementNotification = () => {
    setNotificationCount(prev => Math.max(0, prev - 1));
  };

  const resetNotifications = () => {
    setNotificationCount(0);
  };

  return (
    <NotificationContext.Provider value={{
      notificationCount,
      incrementNotification,
      decrementNotification,
      resetNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
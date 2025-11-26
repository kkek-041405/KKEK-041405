
"use client";

import { useState, useEffect } from 'react';
import { rtdb } from '@/lib/firebase';
import { ref, onValue, off, query, orderByChild, limitToLast } from 'firebase/database';

export interface Notification {
  id: string;
  packageName: string;
  title: string;
  text: string;
  timestamp: number;
}

type DataEvent = {
  type: 'success' | 'error' | 'empty';
  message?: string;
};

type DataEventCallback = (event: DataEvent) => void;

export function useNotifications(onDataEvent?: DataEventCallback) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const notificationsRef = ref(rtdb, 'notifications');
    const notificationsQuery = query(notificationsRef, orderByChild('timestamp'), limitToLast(50));

    const handleValueChange = (snapshot: any) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const notificationsList: Notification[] = Object.keys(data)
          .map(key => ({
            id: key,
            ...data[key]
          }))
          .sort((a, b) => b.timestamp - a.timestamp); // Sort descending by timestamp

        setNotifications(notificationsList);
        onDataEvent?.({ type: 'success' });
      } else {
        // This is a valid state, it just means there are no notifications yet.
        setNotifications([]);
        onDataEvent?.({ type: 'empty' });
      }
      setIsLoading(false);
      setError(null);
    };

    const handleError = (error: Error) => {
      console.error("Error fetching notifications from RTDB:", error);
      const errorMessage = "Failed to connect to the notifications service. Please check your connection and configuration.";
      setError(errorMessage);
      onDataEvent?.({ type: 'error', message: errorMessage });
      setIsLoading(false);
    };

    const unsubscribe = onValue(notificationsQuery, handleValueChange, handleError);

    // Cleanup subscription on component unmount
    return () => {
      off(notificationsRef, 'value', unsubscribe);
    };
  }, [onDataEvent]);

  return { notifications, isLoading, error };
}


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
    console.log('[useNotifications] Initializing connection to Realtime Database...');
    const notificationsRef = ref(rtdb, 'notifications');
    const notificationsQuery = query(notificationsRef, orderByChild('timestamp'), limitToLast(50));

    const handleValueChange = (snapshot: any) => {
      if (snapshot.exists()) {
        console.log('[useNotifications] Data received from Realtime Database.');
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
        console.log('[useNotifications] Connection successful, but no notifications found.');
        // This is a valid state, it just means there are no notifications yet.
        setNotifications([]);
        onDataEvent?.({ type: 'empty' });
      }
      setIsLoading(false);
      setError(null);
    };

    const handleError = (error: Error) => {
      console.error("[useNotifications] Error fetching notifications from RTDB:", error);
      const errorMessage = "Failed to connect to the notifications service. Please check your connection and configuration.";
      setError(errorMessage);
      onDataEvent?.({ type: 'error', message: errorMessage });
      setIsLoading(false);
    };
    
    console.log('[useNotifications] Attaching onValue listener...');
    const unsubscribe = onValue(notificationsQuery, handleValueChange, handleError);

    // Cleanup subscription on component unmount
    return () => {
      console.log('[useNotifications] Cleaning up and detaching onValue listener.');
      off(notificationsRef, 'value', unsubscribe);
    };
  }, [onDataEvent]);

  return { notifications, isLoading, error };
}

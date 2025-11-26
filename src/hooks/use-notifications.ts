
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

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reference to the 'notifications' path in RTDB
    const notificationsRef = ref(rtdb, 'notifications');
    // Query to get the last 50 notifications, ordered by timestamp
    const notificationsQuery = query(notificationsRef, orderByChild('timestamp'), limitToLast(50));

    const unsubscribe = onValue(notificationsQuery, 
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Convert the object of notifications into a sorted array
          const notificationsList: Notification[] = Object.keys(data)
            .map(key => ({
              id: key,
              ...data[key]
            }))
            .sort((a, b) => b.timestamp - a.timestamp); // Sort descending by timestamp

          setNotifications(notificationsList);
        } else {
          setNotifications([]); // No notifications found
        }
        setIsLoading(false);
      }, 
      (error) => {
        console.error("Error fetching notifications from RTDB:", error);
        setError("Failed to connect to the notifications service. Please check your connection and configuration.");
        setIsLoading(false);
      }
    );

    // Cleanup subscription on component unmount
    return () => {
      off(notificationsRef, 'value', unsubscribe);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return { notifications, isLoading, error };
}

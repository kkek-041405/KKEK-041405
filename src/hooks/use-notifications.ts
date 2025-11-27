
"use client";

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, type DocumentData, type QuerySnapshot, doc, deleteDoc } from 'firebase/firestore';
import type { FirebaseNotification as Notification } from '@/lib/types';

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
    console.log('[useNotifications] Initializing connection to Firestore...');
    const notificationsColRef = collection(db, 'notifications');
    const notificationsQuery = query(notificationsColRef, orderBy('timestamp', 'desc'));

    const handleSnapshot = (snapshot: QuerySnapshot<DocumentData>) => {
      if (!snapshot.empty) {
        console.log(`[useNotifications] Data snapshot received from Firestore with ${snapshot.size} documents.`);
        const notificationsList: Notification[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Notification));
        
        setNotifications(notificationsList);
        onDataEvent?.({ type: 'success' });
      } else {
        console.log('[useNotifications] Connection successful, but no notifications found in Firestore.');
        setNotifications([]);
        onDataEvent?.({ type: 'empty' });
      }
      setIsLoading(false);
      setError(null);
    };

    const handleError = (error: Error) => {
      console.error("[useNotifications] Error fetching notifications from Firestore:", error);
      const errorMessage = "Failed to connect to the notifications service. Please check your connection and configuration.";
      setError(errorMessage);
      onDataEvent?.({ type: 'error', message: errorMessage });
      setIsLoading(false);
    };
    
    console.log('[useNotifications] Attaching onSnapshot listener to Firestore...');
    const unsubscribe = onSnapshot(notificationsQuery, handleSnapshot, handleError);

    // Cleanup subscription on component unmount
    return () => {
      console.log('[useNotifications] Cleaning up and detaching Firestore onSnapshot listener.');
      unsubscribe();
    };
  }, [onDataEvent]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await deleteDoc(notificationRef);
      // The onSnapshot listener will automatically update the local state
    } catch (err) {
      console.error("Error deleting notification:", err);
      // Optionally, you can re-throw the error or handle it by setting an error state
      throw new Error("Failed to delete notification.");
    }
  }, []);

  return { notifications, isLoading, error, deleteNotification };
}

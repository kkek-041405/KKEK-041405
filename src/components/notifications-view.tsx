
"use client";

import { useState } from 'react';
import { useNotifications, type Notification } from "@/hooks/use-notifications";
import { Loader2, FileText, Notebook } from "lucide-react";
import NotificationList from './notification-list';
import NotificationView from './notification-view';

export default function NotificationsView() {
  const { notifications, isLoading, error } = useNotifications();
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Connecting to Real-time Notifications...</p>
      </main>
    );
  }
  
  if (error) {
     return (
        <main className="flex-1 flex items-center justify-center text-center text-destructive p-4">
            <p>{error}</p>
        </main>
     )
  }

  const selectedNotification = notifications.find(n => n.id === selectedNotificationId) || null;

  return (
    <main className="flex-1 flex flex-col md:flex-row overflow-hidden h-[calc(100vh-65px)]">
      <section
        aria-labelledby="notifications-list-heading"
        className="md:w-80 flex flex-col border-r"
      >
        <h2 id="notifications-list-heading" className="sr-only">Notifications</h2>
        <NotificationList
          notifications={notifications}
          selectedNotificationId={selectedNotificationId}
          onSelectNotification={setSelectedNotificationId}
        />
      </section>

      <div className="flex-1 flex flex-col">
        {selectedNotification ? (
          <section
            aria-labelledby="view-notification-heading"
            className="flex-1 flex flex-col min-w-0"
          >
            <h2 id="view-notification-heading" className="sr-only">Selected Notification: {selectedNotification.title}</h2>
            <NotificationView notification={selectedNotification} />
          </section>
        ) : (
          !isLoading && notifications.length > 0 && (
            <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-card text-card-foreground p-8 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground">No Notification Selected</h3>
              <p className="text-muted-foreground">Select a notification from the list to view its details.</p>
            </div>
          )
        )}
        { !selectedNotification && !isLoading && notifications.length === 0 && (
            <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-card text-card-foreground p-8 text-center">
              <Notebook className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground">No Notifications Yet</h3>
              <p className="text-muted-foreground">Waiting for incoming notifications from your devices.</p>
            </div>
          )
        }
      </div>
    </main>
  );
}

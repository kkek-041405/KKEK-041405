
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Loader2, ServerCrash, Smartphone } from "lucide-react";
import { useNotifications, type Notification } from "@/hooks/use-notifications";
import { ScrollArea } from "./ui/scroll-area";
import { formatDistanceToNow } from 'date-fns';
import { Badge } from "./ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

function NotificationItem({ notification }: { notification: Notification }) {
  // Use a map or a function to get an icon based on packageName if desired
  const AppIcon = Smartphone; 

  return (
    <div className="flex items-start gap-4 p-4 border-b">
      <div className="bg-muted p-2 rounded-full">
        <AppIcon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">{notification.title}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">{notification.text}</p>
        <Badge variant="outline" className="text-xs">{notification.packageName}</Badge>
      </div>
    </div>
  );
}


export default function NotificationsView() {
  const { toast } = useToast();

  const handleDataEvent = (event: { type: 'success' | 'error' | 'empty', message?: string }) => {
    if (event.type === 'success') {
      toast({
        title: "Connected",
        description: "Live notifications are active.",
      });
    } else if (event.type === 'empty') {
      toast({
        title: "Connected",
        description: "No notifications yet. Waiting for new data.",
      });
    }
  };

  const { notifications, isLoading, error } = useNotifications(handleDataEvent);


  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Loader2 className="h-10 w-10 mb-4 animate-spin" />
          <p>Connecting to Realtime Database...</p>
        </div>
      );
    }
    
    if (error) {
       return (
        <div className="flex flex-col items-center justify-center h-64 text-destructive">
          <ServerCrash className="h-10 w-10 mb-4" />
          <p className="font-semibold">Connection Error</p>
          <p className="text-sm text-center">{error}</p>
        </div>
      );
    }
    
    if (notifications.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Bell className="h-10 w-10 mb-4" />
          <p>No notifications yet.</p>
          <p className="text-sm text-center">New notifications from your devices will appear here in real-time.</p>
        </div>
      );
    }

    return (
      <ScrollArea className="h-[500px]">
        {notifications.map((notif) => (
          <NotificationItem key={notif.id} notification={notif} />
        ))}
      </ScrollArea>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
            <Bell className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl md:text-3xl">Real-time Notifications</CardTitle>
          <CardDescription className="text-md">
            Live stream of notifications from your connected devices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </main>
  );
}

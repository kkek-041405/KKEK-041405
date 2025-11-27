
"use client";

import type { FirebaseNotification as Notification } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Bell, Package, Calendar, MessageSquare, Gamepad2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NotificationViewProps {
  notification: Notification;
}

export default function NotificationView({ notification }: NotificationViewProps) {

  return (
    <div className="bg-card text-card-foreground shadow-lg rounded-lg border flex flex-col flex-1 h-full">
      <div className="flex flex-col space-y-1.5 p-6 border-b">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-semibold leading-none tracking-tight break-words">
            {notification.title}
          </h2>
          <Badge variant="secondary" className="ml-2 whitespace-nowrap">
            <Bell className="mr-1 h-4 w-4" />
            Notification
          </Badge>
        </div>
         <p className="text-sm text-muted-foreground flex items-center gap-2 pt-1">
          <Calendar className="h-4 w-4" />
          Received: {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
        </p>
      </div>
      <div className="p-6 pt-4 flex-1 overflow-y-auto space-y-6">
        
        <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Package className="h-4 w-4" /> From App</h3>
            <p className="text-base text-foreground break-words bg-muted/50 p-3 rounded-md">{notification.appName}</p>
        </div>

        <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Content</h3>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap break-words text-base text-foreground">
                {notification.text}
            </div>
        </div>

        {notification.actions && notification.actions.length > 0 && (
          <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Gamepad2 className="h-4 w-4" /> Available Actions</h3>
              <div className="flex flex-wrap gap-2">
                  {notification.actions.map((action, index) => (
                      <Badge key={index} variant="outline">{action}</Badge>
                  ))}
              </div>
          </div>
        )}
      </div>
    </div>
  );
}

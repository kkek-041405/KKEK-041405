
"use client";

import type { FirebaseNotification as Notification } from "@/lib/types";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "./ui/button";

interface NotificationListItemProps {
  notification: Notification;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

function NotificationListItem({ notification, isSelected, onSelect, onDelete }: NotificationListItemProps) {
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selection when deleting
    onDelete();
  };
  
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      className={cn(
        "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 group",
        isSelected ? "bg-primary/10 border border-primary" : "border border-transparent"
      )}
    >
      <div className="flex items-center space-x-3 overflow-hidden">
        <Bell className={cn("h-5 w-5 shrink-0", isSelected ? "text-primary" : "text-muted-foreground")} />
        <div className="overflow-hidden">
            <p className={cn("font-medium truncate", isSelected ? "text-primary" : "text-foreground")}>{notification.title}</p>
        </div>
      </div>
       <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleDelete}
        aria-label={`Delete notification titled ${notification.title}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}


interface NotificationListProps {
  notifications: Notification[];
  selectedNotificationId: string | null;
  onSelectNotification: (id: string) => void;
  onDeleteNotification: (id: string) => void;
}

export default function NotificationList({ 
  notifications, 
  selectedNotificationId, 
  onSelectNotification,
  onDeleteNotification
}: NotificationListProps) {

  return (
    <div className="bg-card text-card-foreground flex flex-col flex-1 h-full">
      <div className="p-4 border-b flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
            <Bell className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-xl font-semibold text-foreground truncate">
                Inbox
            </h3>
        </div>
      </div>
      
      {notifications.length === 0 ? (
        <div className="p-6 flex-1 flex flex-col justify-center items-center text-center">
          <p className="text-muted-foreground py-4">No notifications received yet. New notifications will appear here in real-time.</p>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-3"> 
            {notifications.map((notification) => (
              <NotificationListItem
                key={notification.id}
                notification={notification}
                isSelected={notification.id === selectedNotificationId}
                onSelect={() => onSelectNotification(notification.id)}
                onDelete={() => onDeleteNotification(notification.id)}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

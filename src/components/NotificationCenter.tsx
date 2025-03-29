
import React, { useState } from "react";
import { useNotification } from "@/context/NotificationContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Notification } from "@/types";

export function NotificationCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotification();
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      // Mark notifications as read when opening the popover
      markAllAsRead();
    }
    setOpen(newOpen);
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Success</Badge>;
      case "warning":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Warning</Badge>;
      case "error":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Error</Badge>;
      case "info":
      default:
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Info</Badge>;
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] flex items-center justify-center text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="px-0 py-0">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Notifications</CardTitle>
              {notifications.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  Clear All
                </Button>
              )}
            </div>
            <CardDescription>
              {notifications.length > 0
                ? `You have ${notifications.length} notification${
                    notifications.length !== 1 ? "s" : ""
                  }`
                : "No new notifications"}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 max-h-[300px] overflow-y-auto space-y-2 my-2">
            {notifications.length === 0 ? (
              <div className="text-center p-4 text-muted-foreground">
                No notifications to display
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-3 hover:bg-accent rounded-md transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {getNotificationIcon(notification.type)}
                      <span>{notification.message}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {format(new Date(notification.createdAt), "PPp")}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

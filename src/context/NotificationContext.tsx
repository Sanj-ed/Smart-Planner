
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Notification } from "@/types";
import { useAuth } from "./AuthContext";

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "userId" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  unreadCount: number;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage when component mounts or user changes
  useEffect(() => {
    if (user) {
      const storedNotifications = localStorage.getItem(`notifications_${user.id}`);
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    } else {
      setNotifications([]);
    }
  }, [user]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  const addNotification = (notification: Omit<Notification, "id" | "createdAt" | "userId" | "read">) => {
    if (!user) return;

    const newNotification: Notification = {
      ...notification,
      id: "notification_" + Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
      userId: user.id,
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};


export type Priority = 'high' | 'medium' | 'low';

export type User = {
  id: string;
  email: string;
  name: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: Date | string;
  completed: boolean;
  priority: Priority;
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type Notification = {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date | string;
  userId: string;
};

export type TaskStats = {
  completed: number;
  pending: number;
  overdue: number;
  totalTasks: number;
  completionRate: number;
  highPriorityCount: number;
  mediumPriorityCount: number;
  lowPriorityCount: number;
};


import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Task, Priority, TaskStats } from "@/types";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";
import { format, isBefore, isToday, addMonths } from "date-fns";

type TaskContextType = {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">) => void;
  updateTask: (taskId: string, updatedTask: Partial<Omit<Task, "id" | "userId">>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
  getTasksByDate: (date: Date) => Task[];
  getTasksByPriority: (priority: Priority) => Task[];
  getTaskStats: (month?: Date) => TaskStats;
  loading: boolean;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tasks from localStorage when component mounts or user changes
  useEffect(() => {
    if (user) {
      const storedTasks = localStorage.getItem(`tasks_${user.id}`);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      } else {
        // Initialize with some sample tasks if none exist
        const sampleTasks = [
          {
            id: "task1",
            title: "Complete project proposal",
            description: "Finalize the project proposal for the client meeting",
            dueDate: addMonths(new Date(), 1).toISOString(),
            completed: false,
            priority: "high" as Priority,
            userId: user.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "task2",
            title: "Weekly team meeting",
            description: "Discuss project progress and assign tasks for the next sprint",
            dueDate: new Date().toISOString(),
            completed: false,
            priority: "medium" as Priority,
            userId: user.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "task3",
            title: "Update documentation",
            description: "Update the project documentation with recent changes",
            dueDate: addMonths(new Date(), 1).toISOString(),
            completed: true,
            priority: "low" as Priority,
            userId: user.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        setTasks(sampleTasks);
        localStorage.setItem(`tasks_${user.id}`, JSON.stringify(sampleTasks));
      }
    } else {
      setTasks([]);
    }
    setLoading(false);
  }, [user]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`tasks_${user.id}`, JSON.stringify(tasks));
    }
  }, [tasks, user]);

  const addTask = (task: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (!user) return;
    
    const newTask: Task = {
      ...task,
      id: "task_" + Math.random().toString(36).substring(2, 11),
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setTasks((prev) => [...prev, newTask]);
    
    toast({
      title: "Task added",
      description: `"${task.title}" has been added to your tasks.`,
    });
  };

  const updateTask = (taskId: string, updatedTask: Partial<Omit<Task, "id" | "userId">>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, ...updatedTask, updatedAt: new Date().toISOString() }
          : task
      )
    );
    
    toast({
      title: "Task updated",
      description: `Task has been updated successfully.`,
    });
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    
    toast({
      title: "Task deleted",
      description: `Task has been deleted successfully.`,
    });
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
    
    const task = tasks.find((t) => t.id === taskId);
    const statusText = task && !task.completed ? "completed" : "marked as incomplete";
    
    toast({
      title: `Task ${statusText}`,
      description: `Task has been ${statusText}.`,
    });
  };

  const getTasksByDate = (date: Date) => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getTasksByPriority = (priority: Priority) => {
    return tasks.filter((task) => task.priority === priority);
  };

  const getTaskStats = (month: Date = new Date()): TaskStats => {
    const filteredTasks = tasks.filter((task) => {
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getMonth() === month.getMonth() &&
        taskDate.getFullYear() === month.getFullYear()
      );
    });

    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter((task) => task.completed).length;
    const pendingTasks = filteredTasks.filter((task) => !task.completed).length;
    const overdueTasks = filteredTasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      return !task.completed && isBefore(dueDate, new Date()) && !isToday(dueDate);
    }).length;
    
    const highPriorityCount = filteredTasks.filter((task) => task.priority === "high").length;
    const mediumPriorityCount = filteredTasks.filter((task) => task.priority === "medium").length;
    const lowPriorityCount = filteredTasks.filter((task) => task.priority === "low").length;

    return {
      completed: completedTasks,
      pending: pendingTasks,
      overdue: overdueTasks,
      totalTasks,
      completionRate: totalTasks ? (completedTasks / totalTasks) * 100 : 0,
      highPriorityCount,
      mediumPriorityCount,
      lowPriorityCount,
    };
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        getTasksByDate,
        getTasksByPriority,
        getTaskStats,
        loading,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};

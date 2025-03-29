
import React, { useState } from "react";
import { useTask } from "@/context/TaskContext";
import { useNotification } from "@/context/NotificationContext";
import { Task, Priority } from "@/types";
import { TaskForm } from "./TaskForm";
import { format, isBefore, isToday } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, Clock, Edit, MoreVertical, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type TaskListProps = {
  tasks: Task[];
  title?: string;
  emptyMessage?: string;
};

export function TaskList({ tasks, title = "Tasks", emptyMessage = "No tasks found" }: TaskListProps) {
  const { toggleTaskCompletion, deleteTask } = useTask();
  const { addNotification } = useNotification();
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
      case "high":
        return "text-taskPriority-high";
      case "medium":
        return "text-taskPriority-medium";
      case "low":
        return "text-taskPriority-low";
      default:
        return "";
    }
  };

  const getPriorityBadge = (priority: Priority) => {
    let variant: "default" | "destructive" | "outline" | "secondary" | null = null;
    
    switch (priority) {
      case "high":
        variant = "destructive";
        break;
      case "medium":
        variant = "default";
        break;
      case "low":
        variant = "secondary";
        break;
    }
    
    return (
      <Badge variant={variant} className="ml-2">
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getDateStatus = (dueDate: Date | string) => {
    const date = new Date(dueDate);
    const isOverdue = isBefore(date, new Date()) && !isToday(date);
    const isDueToday = isToday(date);
    
    if (isOverdue) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    
    if (isDueToday) {
      return <Badge variant="outline">Today</Badge>;
    }
    
    return null;
  };

  const handleToggleComplete = (task: Task) => {
    toggleTaskCompletion(task.id);
    
    const status = task.completed ? "marked as incomplete" : "completed";
    addNotification({
      message: `Task "${task.title}" has been ${status}.`,
      type: task.completed ? "info" : "success",
    });
  };

  const handleEditClick = (task: Task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      addNotification({
        message: `Task "${taskToDelete.title}" has been deleted.`,
        type: "warning",
      });
      setTaskToDelete(null);
    }
  };

  return (
    <div className="w-full">
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      
      {tasks.length === 0 ? (
        <div className="text-center p-8 text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className={`w-full transition-all hover:shadow-md ${
                task.completed ? "opacity-75" : ""
              } task-priority-${task.priority}`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-2">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleToggleComplete(task)}
                      className="mt-1"
                    />
                    <div>
                      <CardTitle
                        className={`${
                          task.completed ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {task.title}
                      </CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(task.dueDate), "PPP")}
                        {getDateStatus(task.dueDate)}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {getPriorityBadge(task.priority)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(task)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(task)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              {task.description && (
                <CardContent className="py-2">
                  <p className={task.completed ? "text-muted-foreground" : ""}>
                    {task.description}
                  </p>
                </CardContent>
              )}
              <CardFooter className="pt-1 text-xs text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                Last updated: {format(new Date(task.updatedAt), "PPp")}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {isFormOpen && (
        <TaskForm
          open={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setTaskToEdit(null);
          }}
          editTask={taskToEdit || undefined}
        />
      )}

      <AlertDialog open={!!taskToDelete} onOpenChange={() => setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the task "{taskToDelete?.title}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

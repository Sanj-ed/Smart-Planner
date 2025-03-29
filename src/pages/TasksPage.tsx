
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useTask } from "@/context/TaskContext";
import { TaskList } from "@/components/TaskList";
import { TaskForm } from "@/components/TaskForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Task, Priority } from "@/types";

export default function TasksPage() {
  const { tasks } = useTask();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredTasks = tasks.filter((task) => {
    // Search by title or description
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by priority
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    // Filter by status
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && task.completed) ||
      (statusFilter === "active" && !task.completed);

    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Sort tasks by priority (high, medium, low) and then by due date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const priorityA = priorityOrder[a.priority as Priority];
    const priorityB = priorityOrder[b.priority as Priority];
    
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Tasks</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Task
        </Button>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={priorityFilter}
            onValueChange={(value) => setPriorityFilter(value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <TaskList
        tasks={sortedTasks}
        emptyMessage={
          searchQuery || priorityFilter !== "all" || statusFilter !== "all"
            ? "No tasks match your filters"
            : "No tasks yet. Create your first task!"
        }
      />

      {isFormOpen && (
        <TaskForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </MainLayout>
  );
}

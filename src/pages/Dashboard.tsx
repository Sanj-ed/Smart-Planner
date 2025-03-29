
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useTask } from "@/context/TaskContext";
import { TaskList } from "@/components/TaskList";
import { TaskForm } from "@/components/TaskForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { isToday, isTomorrow, isPast, isFuture, isThisWeek, isAfter } from "date-fns";

export default function Dashboard() {
  const { tasks } = useTask();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const todayTasks = tasks.filter((task) => isToday(new Date(task.dueDate)));
  const tomorrowTasks = tasks.filter((task) => isTomorrow(new Date(task.dueDate)));
  const overdueTasks = tasks.filter(
    (task) => !task.completed && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
  );
  const upcomingTasks = tasks.filter(
    (task) => 
      !task.completed && 
      isFuture(new Date(task.dueDate)) && 
      !isToday(new Date(task.dueDate)) && 
      !isTomorrow(new Date(task.dueDate)) &&
      isThisWeek(new Date(task.dueDate))
  );
  
  const highPriorityTasks = tasks.filter(
    (task) => !task.completed && task.priority === "high"
  );
  
  // Sort tasks by priority and then by due date
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const priorityA = priorityOrder[a.priority];
    const priorityB = priorityOrder[b.priority];
    
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const recentTasks = sortedTasks
    .filter((task) => !task.completed)
    .slice(0, 5);

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Today</CardTitle>
            <CardDescription>Tasks due today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{todayTasks.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tomorrow</CardTitle>
            <CardDescription>Tasks due tomorrow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tomorrowTasks.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Overdue</CardTitle>
            <CardDescription>Past due date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{overdueTasks.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">High Priority</CardTitle>
            <CardDescription>Tasks that need attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">{highPriorityTasks.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="today" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            </TabsList>
            <TabsContent value="today">
              <TaskList
                tasks={todayTasks}
                title="Today's Tasks"
                emptyMessage="No tasks scheduled for today"
              />
            </TabsContent>
            <TabsContent value="tomorrow">
              <TaskList
                tasks={tomorrowTasks}
                title="Tomorrow's Tasks"
                emptyMessage="No tasks scheduled for tomorrow"
              />
            </TabsContent>
            <TabsContent value="overdue">
              <TaskList
                tasks={overdueTasks}
                title="Overdue Tasks"
                emptyMessage="No overdue tasks"
              />
            </TabsContent>
            <TabsContent value="upcoming">
              <TaskList
                tasks={upcomingTasks}
                title="Upcoming Tasks"
                emptyMessage="No upcoming tasks"
              />
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>Recently added tasks</CardDescription>
            </CardHeader>
            <CardContent>
              {recentTasks.length > 0 ? (
                <ul className="space-y-2">
                  {recentTasks.map((task) => (
                    <li key={task.id} className={`p-3 border rounded-md task-priority-${task.priority}`}>
                      <h3 className="font-medium truncate">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  No tasks available
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {isFormOpen && (
        <TaskForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </MainLayout>
  );
}

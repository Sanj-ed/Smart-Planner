
import React, { useState } from "react";
import { useTask } from "@/context/TaskContext";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TaskList } from "./TaskList";
import { TaskForm } from "./TaskForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { format } from "date-fns";

export function TaskCalendar() {
  const { getTasksByDate } = useTask();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const tasksOnSelectedDate = getTasksByDate(selectedDate);
  
  // Function to determine if a day has tasks
  const isDayWithTasks = (day: Date) => {
    return getTasksByDate(day).length > 0;
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>
            Select a date to view or add tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
            modifiers={{
              withTask: (date) => isDayWithTasks(date),
            }}
            modifiersClassNames={{
              withTask: "calendar-day-with-task",
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Tasks for {format(selectedDate, "PPP")}</CardTitle>
            <CardDescription>
              {tasksOnSelectedDate.length} tasks scheduled
            </CardDescription>
          </div>
          <Button size="sm" onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-1 h-4 w-4" /> Add
          </Button>
        </CardHeader>
        <CardContent>
          <TaskList
            tasks={tasksOnSelectedDate}
            title=""
            emptyMessage="No tasks scheduled for this date"
          />
        </CardContent>
      </Card>

      {isFormOpen && (
        <TaskForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          editTask={undefined}
        />
      )}
    </div>
  );
}

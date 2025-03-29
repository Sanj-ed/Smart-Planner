
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { TaskCalendar } from "@/components/TaskCalendar";

export default function CalendarPage() {
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">Manage your tasks by date</p>
      </div>
      
      <TaskCalendar />
    </MainLayout>
  );
}

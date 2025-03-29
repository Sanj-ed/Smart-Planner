
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { TaskAnalytics } from "@/components/TaskAnalytics";

export default function AnalyticsPage() {
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">View your task performance</p>
      </div>
      
      <TaskAnalytics />
    </MainLayout>
  );
}

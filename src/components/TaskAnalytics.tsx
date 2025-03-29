
import React, { useState } from "react";
import { useTask } from "@/context/TaskContext";
import { format, subMonths } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export function TaskAnalytics() {
  const { getTaskStats, tasks } = useTask();
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  
  const monthOptions = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return {
      value: date.toISOString(),
      label: format(date, "MMMM yyyy"),
    };
  });

  const stats = getTaskStats(selectedMonth);
  
  const completionData = [
    { name: "Completed", value: stats.completed },
    { name: "Pending", value: stats.pending },
    { name: "Overdue", value: stats.overdue },
  ];
  
  const priorityData = [
    { name: "High", value: stats.highPriorityCount },
    { name: "Medium", value: stats.mediumPriorityCount },
    { name: "Low", value: stats.lowPriorityCount },
  ];

  const COLORS = ["#8b5cf6", "#6366f1", "#f43f5e"];
  const PRIORITY_COLORS = ["#f43f5e", "#f59e0b", "#3b82f6"];

  const getCompletionRateText = () => {
    const rate = stats.completionRate;
    if (rate >= 80) return "Excellent! Keep up the good work.";
    if (rate >= 60) return "Good progress, but there's room for improvement.";
    if (rate >= 40) return "You're making progress, but try to complete more tasks.";
    if (rate > 0) return "You should focus on completing more tasks.";
    return "No tasks completed this month.";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Task Analytics</h2>
        <Select
          value={selectedMonth.toISOString()}
          onValueChange={(value) => setSelectedMonth(new Date(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Tasks</CardTitle>
            <CardDescription>For {format(selectedMonth, "MMMM yyyy")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalTasks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completed</CardTitle>
            <CardDescription>Tasks finished</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{stats.completed}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending</CardTitle>
            <CardDescription>Tasks in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">{stats.pending}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Overdue</CardTitle>
            <CardDescription>Past due date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{stats.overdue}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Completion Rate</CardTitle>
          <CardDescription>{getCompletionRateText()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completion: {stats.completionRate.toFixed(1)}%</span>
              <span>
                {stats.completed} of {stats.totalTasks} tasks
              </span>
            </div>
            <Progress value={stats.completionRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
            <CardDescription>Breakdown of task completion status</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => 
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {completionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Priority Distribution</CardTitle>
            <CardDescription>Breakdown by priority level</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={priorityData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" name="Tasks">
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { Task } from "@/types/tasks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { format, startOfWeek, addDays, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { CheckCircle, AlertCircle, ListTodo } from "lucide-react";

interface TaskAnalyticsProps {
  tasks: Task[];
}

export default function TaskAnalytics({ tasks }: TaskAnalyticsProps) {
  // Compute analytics data
  const analytics = useMemo(() => {
    // Basic counters
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Priority distribution
    const priorityCounts = {
      high: tasks.filter(task => task.priority === 'high').length,
      medium: tasks.filter(task => task.priority === 'medium').length,
      low: tasks.filter(task => task.priority === 'low').length,
    };

    // Status by priority
    const statusByPriority = [
      {
        name: 'High',
        Completed: tasks.filter(task => task.priority === 'high' && task.completed).length,
        Pending: tasks.filter(task => task.priority === 'high' && !task.completed).length,
      },
      {
        name: 'Medium',
        Completed: tasks.filter(task => task.priority === 'medium' && task.completed).length,
        Pending: tasks.filter(task => task.priority === 'medium' && !task.completed).length,
      },
      {
        name: 'Low',
        Completed: tasks.filter(task => task.priority === 'low' && task.completed).length,
        Pending: tasks.filter(task => task.priority === 'low' && !task.completed).length,
      },
    ];

    // Get tasks with due dates
    const tasksWithDueDates = tasks.filter(task => 
      task.dueDate || task.due_date
    ).map(task => ({
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate) : 
              (task.due_date ? new Date(task.due_date) : null)
    }));

    // Weekly task distribution for the current and next week
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today);
    const weeklyDistribution = [];
    
    // Generate data for each day of current week
    for (let i = 0; i < 7; i++) {
      const day = addDays(startOfCurrentWeek, i);
      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);
      
      const tasksForDay = tasksWithDueDates.filter(task => 
        task.dueDate && isWithinInterval(task.dueDate, { start: dayStart, end: dayEnd })
      );
      
      weeklyDistribution.push({
        name: format(day, 'EEE'),
        date: format(day, 'MMM d'),
        Tasks: tasksForDay.length,
        Completed: tasksForDay.filter(task => task.completed).length,
        isToday: format(today, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      });
    }

    // Completion status data for pie chart
    const statusData = [
      { name: 'Completed', value: completedTasks, color: '#22c55e' },
      { name: 'Pending', value: totalTasks - completedTasks, color: '#3b82f6' },
    ];

    return {
      totalTasks,
      completedTasks,
      completionRate,
      priorityCounts,
      statusByPriority,
      weeklyDistribution,
      statusData
    };
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Task Analytics</CardTitle>
          <CardDescription>Add some tasks to see your analytics</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <ListTodo className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500 dark:text-gray-400">No data available yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-100 dark:border-gray-700">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg text-gray-800 dark:text-gray-200">Total Tasks</CardTitle>
              <ListTodo className="h-5 w-5 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{analytics.totalTasks}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {analytics.completedTasks} completed ({analytics.completionRate}%)
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-100 dark:border-gray-700">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg text-gray-800 dark:text-gray-200">By Priority</CardTitle>
              <AlertCircle className="h-5 w-5 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-center">
                <span className="block text-sm text-red-500 font-medium">High</span>
                <span className="text-xl font-bold">{analytics.priorityCounts.high}</span>
              </div>
              <div className="text-center">
                <span className="block text-sm text-amber-500 font-medium">Medium</span>
                <span className="text-xl font-bold">{analytics.priorityCounts.medium}</span>
              </div>
              <div className="text-center">
                <span className="block text-sm text-green-500 font-medium">Low</span>
                <span className="text-xl font-bold">{analytics.priorityCounts.low}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-100 dark:border-gray-700">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg text-gray-800 dark:text-gray-200">Completion</CardTitle>
              <CheckCircle className="h-5 w-5 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full border-4 border-indigo-100 dark:border-indigo-900 flex items-center justify-center">
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{analytics.completionRate}%</span>
              </div>
              <div className="ml-4">
                <div className="flex items-center gap-1 text-sm">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-gray-600 dark:text-gray-300">Completed: {analytics.completedTasks}</span>
                </div>
                <div className="flex items-center gap-1 text-sm mt-1">
                  <span className="inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
                  <span className="text-gray-600 dark:text-gray-300">Pending: {analytics.totalTasks - analytics.completedTasks}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status by priority bar chart */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-100 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Tasks by Priority</CardTitle>
            <CardDescription>Completion status grouped by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.statusByPriority}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  barGap={10}
                  barSize={30}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                      borderColor: 'rgba(210, 210, 210, 0.8)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="Completed" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Pending" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly distribution bar chart */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-100 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Weekly Distribution</CardTitle>
            <CardDescription>Task distribution for the current week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.weeklyDistribution}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  barGap={3}
                  barSize={20}
                >
                  <XAxis 
                    dataKey="name" 
                    tickFormatter={(value, index) => {
                      const item = analytics.weeklyDistribution[index];
                      return item.isToday ? `${value} (Today)` : value;
                    }}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [value, '']}
                    labelFormatter={(label, payload) => {
                      if (payload.length > 0) {
                        return payload[0].payload.date;
                      }
                      return label;
                    }}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                      borderColor: 'rgba(210, 210, 210, 0.8)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    name="Total Tasks" 
                    dataKey="Tasks" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Bar 
                    name="Completed" 
                    dataKey="Completed" 
                    fill="#22c55e" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

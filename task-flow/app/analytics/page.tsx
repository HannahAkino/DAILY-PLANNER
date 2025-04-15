"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TaskAnalytics from "@/components/analytics/TaskAnalytics";
import { Task } from "@/types/tasks";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AnalyticsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, getAuthToken } = useAuth();

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get fresh token from auth context
      const token = await getAuthToken();
      
      if (!token) {
        console.error("No auth token available from context");
        toast.error("Please log in again to access your tasks");
        setLoading(false);
        return;
      }
      
      // Fetch all tasks for analytics
      const response = await fetch(`/api/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error("Failed to load tasks for analytics:", responseData.error);
        
        if (response.status === 401) {
          toast.error("Your session has expired. Please log in again.");
        } else {
          throw new Error(responseData.error || "Failed to load tasks");
        }
      } else {
        console.log("Tasks loaded successfully for analytics:", responseData.tasks?.length || 0, "tasks");
        setTasks(responseData.tasks || []);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load tasks";
      console.error("Error loading tasks for analytics:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [getAuthToken]);

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user, loadTasks]);

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your productivity and task management metrics</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading analytics data...</p>
            </div>
          </div>
        ) : (
          <TaskAnalytics tasks={tasks} />
        )}
      </div>
    </DashboardLayout>
  );
}

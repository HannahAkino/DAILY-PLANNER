// app/tasks/page.tsx
"use client";

import { useEffect } from "react";
import TasksView from "@/components/tasks/TasksView";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function TasksPage() {
  const { user, loading, sessionChecked } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated after session is checked
    if (sessionChecked && !loading && !user) {
      console.log("Tasks: Not authenticated, redirecting to home page");
      router.push('/?auth=required');
    }
  }, [user, loading, sessionChecked, router]);

  // Show loading state while checking authentication
  if (loading || !sessionChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <TasksView />
    </DashboardLayout>
  );
}
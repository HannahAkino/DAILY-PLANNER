// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskStats from "./TaskStats";
import TaskList from "./TaskList";
import UserGreeting from "./UserGreeting";
import TaskAnalytics from "@/components/analytics/TaskAnalytics";
import {
    ListTodo,
    CalendarDays,
    CalendarRange,
    CheckCircle,
    AlertCircle,
    Plus,
    LogIn,
    LogOut,
    BarChart
} from "lucide-react";
import { Task } from "@/types/tasks";
import AuthDialog from "@/components/dialogs/AuthDialog";
import TaskDialog from "@/components/dialogs/TaskDialog";
import ConfirmationDialog from "@/components/dialogs/ConfirmationDialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";
import { initNotifications, scheduleTaskNotification, onReminderDialogClosed } from "@/lib/notifications";
import ReminderAlert from "@/components/dialogs/ReminderAlert";

// Helper function to normalize task from snake_case to camelCase
const normalizeTask = (task: any) => {
    return {
        id: task.id,
        userId: task.user_id,
        title: task.title,
        description: task.description || '',
        dueDate: task.due_date,
        priority: task.priority || 'medium',
        reminder: task.reminder,
        completed: task.completed,
        createdAt: task.created_at,
        updatedAt: task.updated_at
    };
};

export default function TasksView() {
    const { user, profile, loading: authLoading, signOut, getAuthToken } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("all");
    const [loading, setLoading] = useState(false);
    
    // State for reminder alert
    const [reminderAlert, setReminderAlert] = useState({
        isOpen: false,
        taskId: "",
        title: "",
        dueDate: "",
        dueTime: ""
    });

    const loadTasks = useCallback(async () => {
        try {
            console.log("Loading tasks, filter:", activeTab);
            setLoading(true);
            
            // Get fresh token from auth context
            const token = await getAuthToken();
            
            // Show a user-friendly message if there's no auth token
            if (!token) {
                console.error("No auth token available from context");
                toast.error("Please log in again to access your tasks");
                setLoading(false);
                // Auto logout if no token available
                await signOut();
                window.location.href = '/';
                return;
            }
            
            console.log("Got token for task loading:", token.substring(0, 10) + "...");
            
            // Use API filtering with a fallback to client-side filtering
            let filter = "";
            if (activeTab !== "all") {
                filter = `?filter=${activeTab}`;
            }
            
            const response = await fetch(`/api/tasks${filter}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }

            const data = await response.json();
            setTasks(data.tasks || []);
            
            // Schedule notifications for tasks with reminders
            if (data.tasks && Array.isArray(data.tasks)) {
                data.tasks.forEach(task => {
                    if (task.reminder && !task.completed && task.due_date) {
                        scheduleTaskNotification(
                            task.id,
                            task.title,
                            task.due_date,
                            task.due_time || '00:00:00',
                            task.reminder
                        );
                    }
                });
            }
            
        } catch (error) {
            console.error("Error loading tasks:", error);
            toast.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    }, [activeTab, getAuthToken, signOut]);

    useEffect(() => {
        if (user) {
            loadTasks();
        }
    }, [user, loadTasks]);

    useEffect(() => {
        // Request notification permissions
        if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
                Notification.requestPermission();
            }
            
            // Initialize the notifications system
            initNotifications();
            
            // Listen for custom reminder alert events
            const handleReminderAlert = (event: CustomEvent) => {
                const { id, title, dueDate, dueTime } = event.detail;
                setReminderAlert({
                    isOpen: true,
                    taskId: id,
                    title,
                    dueDate,
                    dueTime
                });
            };
            
            // Add event listener
            window.addEventListener('show-reminder-alert', handleReminderAlert as EventListener);
            
            // Cleanup
            return () => {
                window.removeEventListener('show-reminder-alert', handleReminderAlert as EventListener);
            };
        }
    }, []);

    const openTaskModal = (task: Task | null = null) => {
        if (!user) {
            setIsAuthDialogOpen(true);
            return;
        }

        setEditingTask(task);
        setIsTaskDialogOpen(true);
    };

    const saveTask = async (taskData: Partial<Task>) => {
        try {
            console.log("Saving task data:", taskData);
            setLoading(true);
            
            // Get fresh token from auth context
            const token = await getAuthToken();
            if (!token) {
                console.error("No auth token available during task save");
                toast.error("Please log in again to save your task");
                return;
            }
            
            // For editing, we need to use PATCH on /api/tasks with the ID in the body
            // For new tasks, we use POST on /api/tasks
            if (editingTask) {
                console.log(`Updating task with ID: ${editingTask.id}`);
                
                const response = await fetch('/api/tasks', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        id: editingTask.id,
                        ...taskData
                    })
                });
                
                const responseData = await response.json();
                
                if (!response.ok) {
                    console.error("Failed to update task:", responseData.error);
                    
                    // Handle session expiration
                    if (response.status === 401) {
                        toast.error("Your session has expired. Please log in again.");
                        await signOut();
                        window.location.href = '/';
                    } else {
                        throw new Error(responseData.error || "Failed to update task");
                    }
                } else {
                    console.log("Task updated successfully:", responseData.task?.id);
                    
                    // Schedule notification if task has reminder and isn't completed
                    if (responseData.task && responseData.task.reminder && 
                        !responseData.task.completed && responseData.task.due_date) {
                        scheduleTaskNotification(
                            responseData.task.id,
                            responseData.task.title,
                            responseData.task.due_date,
                            responseData.task.due_time || '00:00:00',
                            responseData.task.reminder
                        );
                    }
                    
                    await loadTasks();
                    toast.success("Task updated successfully!");
                }
            } else {
                // Create new task using POST
                console.log("Creating new task");
                
                const response = await fetch('/api/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(taskData)
                });
                
                const responseData = await response.json();
                
                if (!response.ok) {
                    console.error("Failed to create task:", responseData.error);
                    
                    // Handle session expiration
                    if (response.status === 401) {
                        toast.error("Your session has expired. Please log in again.");
                        await signOut();
                        window.location.href = '/';
                    } else {
                        throw new Error(responseData.error || "Failed to create task");
                    }
                } else {
                    console.log("Task created successfully:", responseData.task?.id);
                    
                    // Schedule notification if task has reminder and isn't completed
                    if (responseData.task && responseData.task.reminder && 
                        !responseData.task.completed && responseData.task.due_date) {
                        scheduleTaskNotification(
                            responseData.task.id,
                            responseData.task.title,
                            responseData.task.due_date,
                            responseData.task.due_time || '00:00:00',
                            responseData.task.reminder
                        );
                    }
                    
                    await loadTasks();
                    toast.success("Task created successfully!");
                }
            }
            
            setIsTaskDialogOpen(false);
            setEditingTask(null);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to save task";
            console.error("Error saving task:", errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const toggleTaskComplete = async (taskId: string) => {
        try {
            const taskToUpdate = tasks.find(t => t.id === taskId);
            if (!taskToUpdate) return;
            
            // Get fresh token from auth context
            const token = await getAuthToken();
            
            // Show a user-friendly message if there's no auth token
            if (!token) {
                console.error("No auth token available from context");
                toast.error("Please log in again to access your tasks");
                // Auto logout if no token available
                await signOut();
                window.location.href = '/';
                return;
            }
            
            console.log(`Toggling task completion for ${taskId} from ${taskToUpdate.completed} to ${!taskToUpdate.completed}`);
            
            const response = await fetch('/api/tasks', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: taskId,
                    completed: !taskToUpdate.completed,
                })
            });
            
            const responseData = await response.json();
            
            if (!response.ok) {
                console.error("Failed to update task:", responseData.error);
                
                // Handle session expiration
                if (response.status === 401 || responseData.error?.includes("Invalid or expired token")) {
                    toast.error("Your session has expired. Please log in again.");
                    // Log user out when session expires
                    await signOut();
                    window.location.href = '/';
                } else {
                    throw new Error(responseData.error || "Failed to update task");
                }
            } else {
                console.log("Task updated successfully:", responseData.task);
                
                // Normalize the returned task
                const normalizedTask = normalizeTask(responseData.task);
                
                // Update local state
                setTasks(tasks.map(t => t.id === taskId ? normalizedTask : t));
                
                toast.success(`Task marked as ${responseData.task.completed ? 'completed' : 'incomplete'}`);
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An error occurred";
            console.error("Error toggling task completion:", errorMessage);
            toast.error(errorMessage);
        }
    };

    const confirmDeleteTask = (taskId: string) => {
        setDeletingTaskId(taskId);
        setIsDeleteDialogOpen(true);
    };

    const deleteTask = async () => {
        if (!deletingTaskId) return;
        
        try {
            setLoading(true);
            
            // Get fresh token from auth context
            const token = await getAuthToken();
            
            // Show a user-friendly message if there's no auth token
            if (!token) {
                console.error("No auth token available from context");
                toast.error("Please log in again to access your tasks");
                setLoading(false);
                // Auto logout if no token available
                await signOut();
                window.location.href = '/';
                return;
            }
            
            console.log("Deleting task with ID:", deletingTaskId);
            const response = await fetch(`/api/tasks?id=${deletingTaskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                console.error("Failed to delete task:", response.status);
                
                // Handle session expiration
                if (response.status === 401 || response.statusText?.includes("Invalid or expired token")) {
                    toast.error("Your session has expired. Please log in again.");
                    // Log user out when session expires
                    await signOut();
                    window.location.href = '/';
                } else {
                    throw new Error("Failed to delete task");
                }
            } else {
                console.log("Task deleted successfully");
                
                // Update local state
                setTasks(tasks.filter(t => t.id !== deletingTaskId));
                
                setIsDeleteDialogOpen(false);
                setDeletingTaskId(null);
                
                toast.success("Task deleted successfully");
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An error occurred";
            console.error("Error deleting task:", errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleAuthSuccess = () => {
        // This will trigger our auth context to update
        toast.success("You've been successfully signed in");
    };

    const handleSignOut = async () => {
        try {
            console.log("Sign out initiated via AuthContext");
            
            // Use the signOut function from the context
            const { error } = await signOut();

            if (error) {
                toast.error(error.message || "Failed to sign out");
            } else {
                toast.success("Signed out successfully");
                // Navigation is handled by the context
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            console.error("Error during sign out call:", error);
            toast.error(errorMessage);
        }
    };

    const getFilteredTasks = () => {
        // Local filtering to provide a fallback if API filtering doesn't work as expected
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // First check if we need to apply additional filtering (in case API filtering isn't working)
        let shouldApplyLocalFilter = true;
        
        // For completed and priority, the API filtering should work well
        if (activeTab === 'all' || activeTab === 'completed' || activeTab === 'priority') {
            shouldApplyLocalFilter = false;
        }
        
        let filtered = tasks;
        
        if (shouldApplyLocalFilter) {
            filtered = tasks.filter(task => {
                // If no due date, it can't be today or upcoming
                if (!task.dueDate && (activeTab === 'today' || activeTab === 'upcoming')) {
                    return false;
                }
                
                // Parse the due date in YYYY-MM-DD format
                const dueDate = task.dueDate ? new Date(task.dueDate) : null;
                
                // Set to midnight for comparison
                if (dueDate) {
                    dueDate.setHours(0, 0, 0, 0);
                }
                
                switch(activeTab) {
                    case 'today': {
                        // Compare year, month, and day with today
                        const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
                        const dueDateStr = dueDate?.toISOString().split('T')[0]; // YYYY-MM-DD
                        return dueDateStr === todayStr;
                    }
                    case 'upcoming': {
                        // All future dates starting from tomorrow
                        const tomorrowStr = tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD
                        const dueDateStr = dueDate?.toISOString().split('T')[0]; // YYYY-MM-DD
                        return dueDateStr >= tomorrowStr;
                    }
                    default:
                        return true;
                }
            });
            
            console.log(`Applied local filtering for '${activeTab}': ${filtered.length} of ${tasks.length} tasks`);
        }
        
        const completedCount = tasks.filter(task => task.completed).length;
        
        return {
            tasks: filtered,
            completedCount: completedCount
        };
    };

    const { tasks: filteredTasks, completedCount } = getFilteredTasks();

    const handleCloseReminderAlert = () => {
        setReminderAlert(prev => ({ ...prev, isOpen: false }));
        onReminderDialogClosed();
    };

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-grow">
                <header className="border-b bg-card dark:bg-gray-900/80">
                    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                        <h1 className="text-xl font-bold text-primary dark:text-indigo-400">Your Tasks</h1>
                        <div>
                            {!authLoading && (
                                user ? (
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm hidden sm:inline text-gray-600 dark:text-gray-300">
                                            {profile?.name || user.email}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8 transition-all">
                                                <AvatarFallback className="bg-indigo-600 text-white">
                                                    {profile?.name 
                                                        ? profile.name.split(' ')
                                                            .map(n => n[0])
                                                            .join('')
                                                            .toUpperCase()
                                                            .substring(0, 2)
                                                        : user.email?.substring(0, 2).toUpperCase() || 'U'
                                                    }
                                                </AvatarFallback>
                                                {profile?.avatar_url && (
                                                    <AvatarImage src={profile.avatar_url} alt={profile?.name || 'User'} />
                                                )}
                                            </Avatar>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => { 
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleSignOut();
                                                }}
                                                className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500"
                                                title="Sign Out"
                                            >
                                                <LogOut className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsAuthDialogOpen(true)}
                                        className="flex items-center gap-1"
                                    >
                                        <LogIn className="h-4 w-4" />
                                        <span>Sign In</span>
                                    </Button>
                                )
                            )}
                        </div>
                        
                    </div>
                </header>

                <main className="container mx-auto p-4 pb-24 md:pb-4">
                    <UserGreeting 
                        userName={profile?.name || (user?.email ? user.email.split('@')[0] : 'there')} 
                        isAuthenticated={!!user}
                        onLogin={() => setIsAuthDialogOpen(true)}
                    />

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
                        <div className="flex justify-between items-center mb-4">
                            <TabsList className="border-b border-gray-200 dark:border-gray-700 w-full justify-start bg-transparent p-0 overflow-x-auto hide-scrollbar">
                                <TabsTrigger 
                                    value="all" 
                                    className="py-4 px-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 rounded-none"
                                >
                                    <ListTodo className="h-4 w-4 mr-2" />
                                    <span className="hidden sm:inline">All Tasks</span>
                                    <span className="sm:hidden">All</span>
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="today" 
                                    className="py-4 px-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 rounded-none"
                                >
                                    <CalendarDays className="h-4 w-4 mr-2" />
                                    Today
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="upcoming" 
                                    className="py-4 px-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 rounded-none"
                                >
                                    <CalendarRange className="h-4 w-4 mr-2" />
                                    <span className="hidden sm:inline">Upcoming</span>
                                    <span className="sm:hidden">Next</span>
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="completed" 
                                    className="py-4 px-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 rounded-none"
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    <span className="hidden sm:inline">Completed</span>
                                    <span className="sm:hidden">Done</span>
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="priority" 
                                    className="py-4 px-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 rounded-none"
                                >
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                    <span className="hidden sm:inline">Priority</span>
                                    <span className="sm:hidden">High</span>
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="analytics" 
                                    className="py-4 px-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 rounded-none"
                                >
                                    <BarChart className="h-4 w-4 mr-2" />
                                    <span className="hidden sm:inline">Analytics</span>
                                    <span className="sm:hidden">Stats</span>
                                </TabsTrigger>
                            </TabsList>
                            
                            <Button
                                size="sm"
                                onClick={() => openTaskModal(null)}
                                className="flex gap-1 items-center bg-blue-600 hover:bg-blue-700 text-white ml-4 whitespace-nowrap"
                            >
                                <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Add Task</span><span className="sm:hidden">Add</span>
                            </Button>
                        </div>

                        <TaskStats
                            total={tasks.length}
                            completed={completedCount}
                            pending={tasks.length - completedCount}
                        />

                        <TabsContent value={activeTab} className="mt-2">
                            <div className="bg-gray-50 dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-800">
                                <div className="tasks-container h-[calc(100vh-320px)] md:h-[calc(100vh-290px)] overflow-y-auto custom-scrollbar pb-16 md:pb-4">
                                    {activeTab === "analytics" ? (
                                        <TaskAnalytics tasks={filteredTasks} />
                                    ) : (
                                        <TaskList
                                            tasks={filteredTasks}
                                            loading={loading}
                                            onToggleComplete={toggleTaskComplete}
                                            onEdit={openTaskModal}
                                            onDelete={confirmDeleteTask}
                                            onAddTask={() => openTaskModal(null)}
                                        />
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg">
                <div className="flex justify-around">
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab("all")}
                        className={`flex flex-col items-center justify-center py-3 px-4 ${activeTab === "all" ? "text-primary" : "text-muted-foreground"}`}
                    >
                        <ListTodo className="h-5 w-5" />
                        <span className="text-xs mt-1">All</span>
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab("today")}
                        className={`flex flex-col items-center justify-center py-3 px-4 ${activeTab === "today" ? "text-primary" : "text-muted-foreground"}`}
                    >
                        <CalendarDays className="h-5 w-5" />
                        <span className="text-xs mt-1">Today</span>
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab("upcoming")}
                        className={`flex flex-col items-center justify-center py-3 px-4 ${activeTab === "upcoming" ? "text-primary" : "text-muted-foreground"}`}
                    >
                        <CalendarRange className="h-5 w-5" />
                        <span className="text-xs mt-1">Upcoming</span>
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab("completed")}
                        className={`flex flex-col items-center justify-center py-3 px-4 ${activeTab === "completed" ? "text-primary" : "text-muted-foreground"}`}
                    >
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-xs mt-1">Done</span>
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab("priority")}
                        className={`flex flex-col items-center justify-center py-3 px-4 ${activeTab === "priority" ? "text-primary" : "text-muted-foreground"}`}
                    >
                        <AlertCircle className="h-5 w-5" />
                        <span className="text-xs mt-1">Priority</span>
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab("analytics")}
                        className={`flex flex-col items-center justify-center py-3 px-4 ${activeTab === "analytics" ? "text-primary" : "text-muted-foreground"}`}
                    >
                        <BarChart className="h-5 w-5" />
                        <span className="text-xs mt-1">Analytics</span>
                    </Button>
                </div>
            </div>

            <AuthDialog
                isOpen={isAuthDialogOpen}
                onClose={() => setIsAuthDialogOpen(false)}
                onAuthSuccess={handleAuthSuccess}
            />

            <TaskDialog
                isOpen={isTaskDialogOpen}
                onClose={() => {
                    setIsTaskDialogOpen(false);
                    setEditingTask(null);
                }}
                onSave={saveTask}
                task={editingTask}
            />

            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={deleteTask}
                title="Delete Task"
                description="Are you sure you want to delete this task? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="danger"
            />
            
            <ReminderAlert
                isOpen={reminderAlert.isOpen}
                onClose={handleCloseReminderAlert}
                title={reminderAlert.title}
                dueDate={reminderAlert.dueDate}
                dueTime={reminderAlert.dueTime}
            />
        </div>
    );
}
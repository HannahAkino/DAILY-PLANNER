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
                return;
            }
            
            console.log("Got token for task loading:", token.substring(0, 10) + "...");
            
            let filter = "";
            if (activeTab !== "all") {
                filter = `?filter=${activeTab}`;
            }
            
            // Use the token in the request header
            const response = await fetch(`/api/tasks${filter}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const responseData = await response.json();
            
            if (!response.ok) {
                console.error("Failed to load tasks:", responseData.error);
                
                // Handle session expiration
                if (response.status === 401) {
                    toast.error("Your session has expired. Please log in again.");
                } else {
                    throw new Error(responseData.error || "Failed to load tasks");
                }
            } else {
                console.log("Tasks loaded successfully:", responseData.tasks?.length || 0, "tasks");
                setTasks(responseData.tasks || []);
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to load tasks";
            console.error("Error loading tasks:", errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [activeTab, getAuthToken]);

    useEffect(() => {
        if (user) {
            loadTasks();
        }
    }, [user, loadTasks]);

    const openTaskModal = (task: Task | null = null) => {
        if (!user) {
            setIsAuthDialogOpen(true);
            return;
        }

        setEditingTask(task);
        setIsTaskDialogOpen(true);
    };

    const saveTask = async (taskData: Partial<Task>) => {
        if (!user) return;

        try {
            setLoading(true);
            
            // Get fresh token from auth context
            const token = await getAuthToken();
            
            // Show a user-friendly message if there's no auth token
            if (!token) {
                console.error("No auth token available from context");
                toast.error("Please log in again to save tasks");
                setLoading(false);
                return;
            }
            
            console.log("Got token for task creation:", token.substring(0, 10) + "...");
            
            if (editingTask) {
                // Update existing task
                console.log("Updating task:", editingTask.id, taskData);
                const response = await fetch('/api/tasks', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        id: editingTask.id,
                        ...taskData,
                    })
                });
                
                const responseData = await response.json();
                
                if (!response.ok) {
                    console.error("Failed to update task:", responseData.error);
                    
                    // Handle session expiration
                    if (response.status === 401) {
                        toast.error("Your session has expired. Please log in again.");
                    } else {
                        throw new Error(responseData.error || "Failed to update task");
                    }
                } else {
                    console.log("Task updated successfully:", responseData.task);
                    setTasks(tasks.map(t => t.id === editingTask.id ? responseData.task : t));
                    toast.success("Task updated successfully");
                }
            } else {
                // Create new task
                console.log("Creating new task:", taskData);
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
                    } else {
                        throw new Error(responseData.error || "Failed to create task");
                    }
                } else {
                    console.log("Task created successfully:", responseData.task);
                    setTasks([...tasks, responseData.task]);
                    toast.success("Task created successfully");
                }
            }
            
            setIsTaskDialogOpen(false);
            setEditingTask(null);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An error occurred";
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
                if (response.status === 401) {
                    toast.error("Your session has expired. Please log in again.");
                } else {
                    throw new Error(responseData.error || "Failed to update task");
                }
            } else {
                console.log("Task updated successfully:", responseData.task);
                
                // Update local state
                setTasks(tasks.map(t => t.id === taskId ? responseData.task : t));
                
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
                return;
            }
            
            console.log("Deleting task with ID:", deletingTaskId);
            const response = await fetch(`/api/tasks?id=${deletingTaskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const responseData = await response.json();
            
            if (!response.ok) {
                console.error("Failed to delete task:", responseData.error);
                
                // Handle session expiration
                if (response.status === 401) {
                    toast.error("Your session has expired. Please log in again.");
                } else {
                    throw new Error(responseData.error || "Failed to delete task");
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
            await signOut();
            toast.success("You've been successfully signed out");
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to sign out";
            toast.error(errorMessage);
        }
    };

    const getFilteredTasks = () => {
        // Local filtering to ensure it works correctly
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const filtered = tasks.filter(task => {
            const dueDate = task.dueDate ? new Date(task.dueDate) : null;
            
            switch(activeTab) {
                case 'today':
                    return dueDate && 
                        dueDate.getFullYear() === today.getFullYear() && 
                        dueDate.getMonth() === today.getMonth() && 
                        dueDate.getDate() === today.getDate();
                case 'upcoming':
                    return dueDate && dueDate > today;
                case 'completed':
                    return task.completed;
                case 'priority':
                    return task.priority === 'high';
                default:
                    return true; // 'all' tab or fallback
            }
        });
        
        const completedCount = tasks.filter(task => task.completed).length;
        
        return {
            tasks: filtered,
            completedCount: completedCount
        };
    };

    const { tasks: filteredTasks, completedCount } = getFilteredTasks();

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
                                                onClick={handleSignOut}
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

                <main className="container mx-auto p-4">
                    <UserGreeting 
                        userName={profile?.name || (user ? 'there' : 'there')} 
                        isAuthenticated={!!user}
                        onLogin={() => setIsAuthDialogOpen(true)}
                    />

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
                        <div className="flex justify-between items-center mb-4">
                            <TabsList className="border-b border-gray-200 dark:border-gray-700 w-full justify-start bg-transparent p-0 overflow-x-auto no-scrollbar">
                                <TabsTrigger 
                                    value="all" 
                                    className="py-4 px-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 rounded-none"
                                >
                                    <ListTodo className="h-4 w-4 mr-2" />
                                    All Tasks
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
                                    Upcoming
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="completed" 
                                    className="py-4 px-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 rounded-none"
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Completed
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="priority" 
                                    className="py-4 px-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 rounded-none"
                                >
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                    Priority
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="analytics" 
                                    className="py-4 px-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 rounded-none"
                                >
                                    <BarChart className="h-4 w-4 mr-2" />
                                    Analytics
                                </TabsTrigger>
                            </TabsList>
                            
                            <Button
                                size="sm"
                                onClick={() => openTaskModal(null)}
                                className="flex gap-1 items-center bg-blue-600 hover:bg-blue-700 text-white ml-4"
                            >
                                <Plus className="h-4 w-4" /> Add Task
                            </Button>
                        </div>

                        <TaskStats
                            total={tasks.length}
                            completed={completedCount}
                            pending={tasks.length - completedCount}
                        />

                        <TabsContent value={activeTab} className="mt-2">
                            <div className="bg-gray-50 dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-800">
                                <div className="tasks-container h-[calc(100vh-320px)] md:h-[calc(100vh-290px)] overflow-y-auto custom-scrollbar">
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
        </div>
    );
}
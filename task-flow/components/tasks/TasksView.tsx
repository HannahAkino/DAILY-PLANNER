// components/tasks/TasksView.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskStats from "./TaskStats";
import TaskList from "./TaskList";
import UserGreeting from "./UserGreeting";
import {
    ListTodo,
    CalendarDays,
    CalendarRange,
    CheckCircle,
    AlertCircle,
    Plus,
    LogIn,
    LogOut,
} from "lucide-react";
import { Task } from "@/types/tasks";
import AuthDialog from "@/components/dialogs/AuthDialog";
import TaskDialog from "@/components/dialogs/TaskDialog";
import ConfirmationDialog from "@/components/dialogs/ConfirmationDialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function TasksView() {
    const { user, profile, loading: authLoading, signOut } = useAuth();
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
            setLoading(true);
            
            let filter = "";
            if (activeTab !== "all") {
                filter = `?filter=${activeTab}`;
            }
            
            const response = await fetch(`/api/tasks${filter}`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || "Failed to load tasks");
            }
            
            setTasks(data.tasks || []);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to load tasks";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

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
            
            if (editingTask) {
                // Update existing task
                const response = await fetch('/api/tasks', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: editingTask.id,
                        ...taskData,
                    }),
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || "Failed to update task");
                }
                
                setTasks(tasks.map(t => t.id === editingTask.id ? data.task : t));
                toast.success("Task updated successfully");
            } else {
                // Create new task
                const response = await fetch('/api/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(taskData),
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || "Failed to create task");
                }
                
                setTasks([...tasks, data.task]);
                toast.success("Task created successfully");
            }
            
            setIsTaskDialogOpen(false);
            setEditingTask(null);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An error occurred";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const toggleTaskComplete = async (taskId: string) => {
        try {
            const taskToUpdate = tasks.find(t => t.id === taskId);
            if (!taskToUpdate) return;
            
            const response = await fetch('/api/tasks', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: taskId,
                    completed: !taskToUpdate.completed,
                }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || "Failed to update task");
            }
            
            setTasks(tasks.map(t => t.id === taskId ? data.task : t));
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to update task";
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
            
            const response = await fetch(`/api/tasks?id=${deletingTaskId}`, {
                method: 'DELETE',
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || "Failed to delete task");
            }
            
            setTasks(tasks.filter(t => t.id !== deletingTaskId));
            toast.success("Task deleted successfully");
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to delete task";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
            setDeletingTaskId(null);
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
        // Local filtering is handled by the API, but we need this for stats
        const completedCount = tasks.filter(task => task.completed).length;
        
        return {
            tasks: tasks,
            completedCount: completedCount
        };
    };

    const { tasks: filteredTasks, completedCount } = getFilteredTasks();

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-grow">
                <header className="border-b bg-card">
                    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-primary">TaskFlow</h1>
                        <div>
                            {!authLoading && (
                                user ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm hidden sm:inline">
                                            {profile?.name || user.email}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleSignOut}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <LogOut className="h-5 w-5" />
                                        </Button>
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

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
                        <div className="flex justify-between items-center mb-4">
                            <TabsList>
                                <TabsTrigger value="all" className="flex gap-1 items-center">
                                    <ListTodo className="h-4 w-4" /> All
                                </TabsTrigger>
                                <TabsTrigger value="today" className="flex gap-1 items-center">
                                    <CalendarDays className="h-4 w-4" /> Today
                                </TabsTrigger>
                                <TabsTrigger value="upcoming" className="flex gap-1 items-center">
                                    <CalendarRange className="h-4 w-4" /> Upcoming
                                </TabsTrigger>
                                <TabsTrigger value="completed" className="flex gap-1 items-center">
                                    <CheckCircle className="h-4 w-4" /> Completed
                                </TabsTrigger>
                                <TabsTrigger value="priority" className="flex gap-1 items-center">
                                    <AlertCircle className="h-4 w-4" /> Priority
                                </TabsTrigger>
                            </TabsList>
                            
                            <Button
                                size="sm"
                                onClick={() => openTaskModal(null)}
                                className="flex gap-1 items-center"
                            >
                                <Plus className="h-4 w-4" /> Add Task
                            </Button>
                        </div>

                        <TaskStats
                            total={tasks.length}
                            completed={completedCount}
                            pending={tasks.length - completedCount}
                        />

                        <TabsContent value={activeTab} className="mt-0">
                            <TaskList
                                tasks={filteredTasks}
                                loading={loading}
                                onToggleComplete={toggleTaskComplete}
                                onEdit={openTaskModal}
                                onDelete={confirmDeleteTask}
                                onAddTask={() => openTaskModal(null)}
                            />
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
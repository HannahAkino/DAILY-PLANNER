// components/tasks/TasksView.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskStats from "./TaskStats";
import TaskList from "./TaskList";
import TaskModal from "./TaskModal";
import UserGreeting from "./UserGreeting";
import {
    ListTodo,
    CalendarDays,
    CalendarRange,
    CheckCircle,
    AlertCircle,
    Plus,
    LogIn,
    UserCircle,
} from "lucide-react";
import { Task, User } from "@/types/tasks";
import { AuthModal } from "./AuthModal";

export default function TasksView() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        if (currentUser) {
            loadTasks();
        }
    }, [currentUser]);

    const loadTasks = () => {
        // Simulate loading tasks from a database
        const sampleTasks = [
            {
                id: "1",
                userId: "user1",
                title: "Complete project proposal",
                description: "Finish writing the project proposal document and send to manager",
                dueDate: "2023-06-15",
                priority: "high",
                reminder: 60,
                completed: false,
                createdAt: "2023-06-10T09:00:00Z",
                updatedAt: "2023-06-10T09:00:00Z",
            },
            {
                id: "2",
                userId: "user1",
                title: "Team meeting",
                description: "Weekly team sync to discuss project progress",
                dueDate: "2023-06-12",
                priority: "medium",
                reminder: 15,
                completed: false,
                createdAt: "2023-06-08T14:30:00Z",
                updatedAt: "2023-06-08T14:30:00Z",
            },
            {
                id: "3",
                userId: "user1",
                title: "Buy groceries",
                description: "Milk, eggs, bread, fruits",
                dueDate: "2023-06-11",
                priority: "low",
                reminder: null,
                completed: true,
                createdAt: "2023-06-09T18:00:00Z",
                updatedAt: "2023-06-10T10:00:00Z",
            },
        ];

        setTasks(sampleTasks);
    };

    const handleLogin = (email: string, password: string) => {
        // Simulate authentication
        const user = { id: "user1", name: "John Doe", email: email };
        setCurrentUser(user);
        setIsAuthModalOpen(false);
    };

    const handleRegister = (name: string, email: string, password: string) => {
        // Simulate registration
        const user = { id: "user1", name: name, email: email };
        setCurrentUser(user);
        setIsAuthModalOpen(false);
    };

    const openTaskModal = (task: Task | null = null) => {
        if (!currentUser) {
            setIsAuthModalOpen(true);
            return;
        }

        setEditingTask(task);
        setIsTaskModalOpen(true);
    };

    const saveTask = (taskData: Partial<Task>) => {
        if (!currentUser) return;

        const now = new Date().toISOString();

        if (editingTask) {
            // Update existing task
            setTasks(tasks.map(t =>
                t.id === editingTask.id ? { ...t, ...taskData, updatedAt: now } : t
            ));
        } else {
            // Add new task
            const newTask: Task = {
                id: Date.now().toString(),
                userId: currentUser.id,
                title: taskData.title || "",
                description: taskData.description || "",
                dueDate: taskData.dueDate || "",
                priority: taskData.priority || "medium",
                reminder: taskData.reminder,
                completed: false,
                createdAt: now,
                updatedAt: now,
            };

            setTasks([newTask, ...tasks]);
        }

        setIsTaskModalOpen(false);
        setEditingTask(null);
    };

    const toggleTaskComplete = (taskId: string) => {
        setTasks(tasks.map(task => {
            if (task.id === taskId) {
                return {
                    ...task,
                    completed: !task.completed,
                    updatedAt: new Date().toISOString()
                };
            }
            return task;
        }));
    };

    const deleteTask = (taskId: string) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const getFilteredTasks = () => {
        switch (activeTab) {
            case "today":
                const today = new Date().toISOString().split("T")[0];
                return tasks.filter(task => task.dueDate === today);
            case "upcoming":
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const tomorrowStr = tomorrow.toISOString().split("T")[0];
                return tasks.filter(task => task.dueDate >= tomorrowStr && !task.completed);
            case "completed":
                return tasks.filter(task => task.completed);
            case "priority":
                return tasks.filter(task => task.priority === "high" && !task.completed);
            default:
                return tasks;
        }
    };

    const filteredTasks = getFilteredTasks();
    const completedCount = tasks.filter(t => t.completed).length;

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <header className="py-6 flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
                            <ListTodo className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">TaskFlow</h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        {!currentUser ? (
                            <>
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="hidden md:flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                                >
                                    <UserCircle className="h-5 w-5" />
                                    <span>Sign In</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="md:hidden text-gray-700 hover:text-blue-600"
                                >
                                    <UserCircle className="h-5 w-5" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    className="hidden md:flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                                >
                                    <UserCircle className="h-5 w-5" />
                                    <span>{currentUser.name.split(" ")[0]}</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden text-gray-700 hover:text-blue-600"
                                >
                                    <UserCircle className="h-5 w-5" />
                                </Button>
                            </>
                        )}
                        <Button
                            onClick={() => openTaskModal()}
                            className="flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" />
                            <span className="hidden md:inline">Add Task</span>
                        </Button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="pb-16">
                    {currentUser && (
                        <UserGreeting name={currentUser.name} />
                    )}

                    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
                        <TabsList className="border-b border-gray-200 w-full justify-start mb-6 bg-transparent p-0">
                            <TabsTrigger
                                value="all"
                                className="py-4 px-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 rounded-none"
                            >
                                <ListTodo className="h-4 w-4 mr-2" />
                                All Tasks
                            </TabsTrigger>
                            <TabsTrigger
                                value="today"
                                className="py-4 px-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 rounded-none"
                            >
                                <CalendarDays className="h-4 w-4 mr-2" />
                                Today
                            </TabsTrigger>
                            <TabsTrigger
                                value="upcoming"
                                className="py-4 px-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 rounded-none"
                            >
                                <CalendarRange className="h-4 w-4 mr-2" />
                                Upcoming
                            </TabsTrigger>
                            <TabsTrigger
                                value="completed"
                                className="py-4 px-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 rounded-none"
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Completed
                            </TabsTrigger>
                            <TabsTrigger
                                value="priority"
                                className="py-4 px-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 rounded-none"
                            >
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Priority
                            </TabsTrigger>
                        </TabsList>

                        <TaskStats
                            total={tasks.length}
                            completed={completedCount}
                            pending={tasks.length - completedCount}
                        />

                        <TabsContent value={activeTab} className="mt-0">
                            <TaskList
                                tasks={filteredTasks}
                                onToggleComplete={toggleTaskComplete}
                                onEdit={openTaskModal}
                                onDelete={deleteTask}
                                onAddTask={openTaskModal}
                            />
                        </TabsContent>
                    </Tabs>
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
                <div className="flex justify-around">
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab("all")}
                        className={`flex flex-col items-center justify-center py-3 px-4 ${activeTab === "all" ? "text-blue-600" : "text-gray-500"}`}
                    >
                        <ListTodo className="h-5 w-5" />
                        <span className="text-xs mt-1">All</span>
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab("today")}
                        className={`flex flex-col items-center justify-center py-3 px-4 ${activeTab === "today" ? "text-blue-600" : "text-gray-500"}`}
                    >
                        <CalendarDays className="h-5 w-5" />
                        <span className="text-xs mt-1">Today</span>
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab("upcoming")}
                        className={`flex flex-col items-center justify-center py-3 px-4 ${activeTab === "upcoming" ? "text-blue-600" : "text-gray-500"}`}
                    >
                        <CalendarRange className="h-5 w-5" />
                        <span className="text-xs mt-1">Upcoming</span>
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab("completed")}
                        className={`flex flex-col items-center justify-center py-3 px-4 ${activeTab === "completed" ? "text-blue-600" : "text-gray-500"}`}
                    >
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-xs mt-1">Done</span>
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab("priority")}
                        className={`flex flex-col items-center justify-center py-3 px-4 ${activeTab === "priority" ? "text-blue-600" : "text-gray-500"}`}
                    >
                        <AlertCircle className="h-5 w-5" />
                        <span className="text-xs mt-1">Priority</span>
                    </Button>
                </div>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onLogin={handleLogin}
                onRegister={handleRegister}
            />

            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={() => {
                    setIsTaskModalOpen(false);
                    setEditingTask(null);
                }}
                onSave={saveTask}
                task={editingTask}
            />
        </div>
    );
}
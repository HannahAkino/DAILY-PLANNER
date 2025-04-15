// components/tasks/TaskList.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@/types/tasks";
import { Pencil, Trash, Plus, ListTodo, Circle, CalendarDays, Bell } from "lucide-react";

interface TaskListProps {
    tasks: Task[];
    onToggleComplete: (taskId: string) => void;
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
    onAddTask: () => void;
}

export default function TaskList({
    tasks,
    onToggleComplete,
    onEdit,
    onDelete,
    onAddTask
}: TaskListProps) {
    if (!tasks.length) {
        return (
            <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 text-gray-300 mb-4">
                    <ListTodo className="h-24 w-24 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No tasks yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
                <Button
                    onClick={onAddTask}
                    className="mt-6 inline-flex items-center px-4 py-2"
                >
                    <Plus className="h-4 w-4 mr-2" /> Add Task
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {tasks.map(task => (
                <Card
                    key={task.id}
                    className={`task-item bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden relative ${task.completed ? 'opacity-70' : ''}`}
                >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${getPriorityColorClass(task.priority)}`}></div>
                    <div className="p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1 min-w-0">
                                <Checkbox
                                    checked={task.completed}
                                    onCheckedChange={() => onToggleComplete(task.id)}
                                    className="mt-1"
                                />

                                <div className="flex-1 min-w-0">
                                    <h3 className={`text-md font-medium text-gray-800 ${task.completed ? 'line-through' : ''}`}>
                                        {task.title}
                                    </h3>
                                    {task.description && (
                                        <p className={`text-sm text-gray-600 mt-1 ${task.completed ? 'line-through' : ''}`}>
                                            {task.description}
                                        </p>
                                    )}

                                    <div className="flex items-center mt-2 space-x-4 text-sm">
                                        {task.dueDate && (
                                            <div className="flex items-center text-gray-500">
                                                <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                                                <span>{formatDate(task.dueDate)}</span>
                                            </div>
                                        )}

                                        <div className={`flex items-center ${getPriorityTextColor(task.priority)}`}>
                                            <Circle className="h-2 w-2 mr-1.5 fill-current" />
                                            <span className="capitalize">{task.priority}</span>
                                        </div>

                                        {task.reminder && (
                                            <div className="flex items-center text-gray-500">
                                                <Bell className="h-3.5 w-3.5 mr-1.5" />
                                                <span>{getReminderText(task.reminder)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-2 ml-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit(task)}
                                    className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDelete(task.id)}
                                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}

// Helper functions
function formatDate(dateStr: string) {
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    };
    return new Date(dateStr).toLocaleDateString(undefined, options);
}

function getPriorityColorClass(priority: string) {
    switch (priority) {
        case 'high': return 'bg-red-500';
        case 'medium': return 'bg-yellow-500';
        case 'low': return 'bg-green-500';
        default: return 'bg-gray-500';
    }
}

function getPriorityTextColor(priority: string) {
    switch (priority) {
        case 'high': return 'text-red-500';
        case 'medium': return 'text-yellow-500';
        case 'low': return 'text-green-500';
        default: return 'text-gray-500';
    }
}

function getReminderText(minutes: number | null) {
    if (minutes === 15) return '15 min before';
    if (minutes === 60) return '1 hour before';
    if (minutes === 1440) return '1 day before';
    return '';
}
// components/tasks/TaskList.tsx
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/types/tasks";
import { Pencil, Trash, Plus, ListTodo, Circle, CalendarDays, Clock } from "lucide-react";
import { format, isToday, isTomorrow, isPast } from "date-fns";

interface TaskListProps {
    tasks: Task[];
    loading: boolean;
    onToggleComplete: (taskId: string) => void;
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
    onAddTask: () => void;
}

export default function TaskList({
    tasks,
    loading,
    onToggleComplete,
    onEdit,
    onDelete,
    onAddTask
}: TaskListProps) {
    if (loading) {
        return (
            <div className="w-full py-8 text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading tasks...</p>
            </div>
        );
    }

    if (!tasks.length) {
        return (
            <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 text-gray-300 mb-4">
                    <ListTodo className="h-24 w-24 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No tasks yet</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new task.</p>
                <Button
                    onClick={onAddTask}
                    className="mt-6 inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white"
                >
                    <Plus className="h-4 w-4 mr-2 text-white" /> Add Task
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full">
            <table className="w-full border-collapse table-fixed">
                <thead>
                    <tr className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-t-lg">
                        <th className="w-12 py-3 text-center">#</th>
                        <th className="w-10 py-3 text-center">Done</th>
                        <th className="py-3 text-left pl-2">Task</th>
                        <th className="w-24 py-3 text-center hidden md:table-cell">Priority</th>
                        <th className="w-32 py-3 text-center hidden md:table-cell">Due Date</th>
                        <th className="w-28 py-3 text-center hidden md:table-cell">Due Time</th>
                        <th className="w-32 py-3 text-center hidden lg:table-cell">Reminder</th>
                        <th className="w-20 py-3 text-right pr-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, index) => {
                        // Consistently normalize due date - handle both camelCase and snake_case properties
                        const dueDate = task.dueDate ? new Date(task.dueDate) : 
                                       (task.due_date ? new Date(task.due_date) : null);
                        
                        // Normalize due time consistently
                        const dueTime = task.dueTime || task.due_time || '';
                        
                        // Determine row styling based on task status and due date
                        let rowClass = "border-b border-gray-100 dark:border-gray-800 text-sm";
                        
                        if (task.completed) {
                            rowClass += " bg-gray-50 dark:bg-gray-900/50 opacity-70";
                        } else if (dueDate && isPast(dueDate) && !isToday(dueDate)) {
                            rowClass += " bg-red-50 dark:bg-red-900/10";
                        } else if (dueDate && isToday(dueDate)) {
                            rowClass += " bg-amber-50 dark:bg-amber-900/10";
                        } else if (dueDate && isTomorrow(dueDate)) {
                            rowClass += " bg-blue-50 dark:bg-blue-900/10";
                        } else {
                            rowClass += " hover:bg-gray-50 dark:hover:bg-gray-900/30";
                        }
                        
                        return (
                            <tr key={task.id} className={rowClass}>
                                <td className="py-3 text-center text-xs text-gray-500 dark:text-gray-400">
                                    {index + 1}
                                </td>
                                <td className="py-3 text-center">
                                    <div className="flex justify-center items-center">
                                        <div className={`absolute left-0 h-full w-1 ${getPriorityColorClass(task.priority)}`}></div>
                                        <Checkbox
                                            checked={task.completed}
                                            onCheckedChange={() => onToggleComplete(task.id)}
                                            className={`${task.completed ? 'bg-primary border-primary' : ''}`}
                                        />
                                    </div>
                                </td>
                                <td className="py-3 pl-2">
                                    <div>
                                        <h3 className={`text-sm font-medium text-gray-800 dark:text-gray-200 ${task.completed ? 'line-through' : ''}`}>
                                            {task.title}
                                        </h3>
                                        {task.description && (
                                            <p className={`text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-1 ${task.completed ? 'line-through' : ''}`}>
                                                {task.description}
                                            </p>
                                        )}
                                        
                                        {/* Mobile-only metadata */}
                                        <div className="flex items-center mt-1 flex-wrap gap-2 text-xs md:hidden">
                                            {dueDate && (
                                                <Badge variant="outline" className={getBadgeClass(dueDate)}>
                                                    <CalendarDays className="h-3 w-3 mr-1" />
                                                    <span>{formatDateForDisplay(dueDate)}</span>
                                                </Badge>
                                            )}
                                            <Badge variant="outline" className={getPriorityBadgeClass(task.priority)}>
                                                <Circle className="h-2 w-2 mr-1 fill-current" />
                                                <span className="capitalize">{task.priority}</span>
                                            </Badge>
                                            {task.reminder && (
                                                <Badge variant="outline" className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    <span>{getReminderText(task.reminder)}</span>
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 text-center hidden md:table-cell">
                                    <Badge variant="outline" className={getPriorityBadgeClass(task.priority)}>
                                        <Circle className="h-2 w-2 mr-1 fill-current" />
                                        <span className="capitalize">{task.priority}</span>
                                    </Badge>
                                </td>
                                <td className="py-3 text-center hidden md:table-cell">
                                    {dueDate ? (
                                        <Badge variant="outline" className={getBadgeClass(dueDate)}>
                                            <CalendarDays className="h-3 w-3 mr-1" />
                                            <span>{formatDateForDisplay(dueDate)}</span>
                                        </Badge>
                                    ) : (
                                        <span className="text-gray-400">—</span>
                                    )}
                                </td>
                                <td className="py-3 text-center hidden md:table-cell">
                                    {dueTime ? (
                                        <Badge variant="outline" className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                            <Clock className="h-3 w-3 mr-1" />
                                            <span>{formatTimeForDisplay(dueTime)}</span>
                                        </Badge>
                                    ) : (
                                        <span className="text-gray-400">—</span>
                                    )}
                                </td>
                                <td className="py-3 text-center text-xs hidden lg:table-cell">
                                    {task.reminder ? (
                                        <Badge variant="outline" className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                            <Clock className="h-3 w-3 mr-1" />
                                            <span>{getReminderText(task.reminder)}</span>
                                        </Badge>
                                    ) : (
                                        <span className="text-gray-400">—</span>
                                    )}
                                </td>
                                <td className="py-3 text-right pr-2">
                                    <div className="flex justify-end space-x-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(task)}
                                            className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDelete(task.id)}
                                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                                        >
                                            <Trash className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

// Helper functions
function formatDateForDisplay(date: Date): string {
    if (isToday(date)) {
        return 'Today';
    } else if (isTomorrow(date)) {
        return 'Tomorrow';
    } else if (isPast(date)) {
        return `Overdue: ${format(date, 'MMM d')}`;
    } else {
        return format(date, 'EEE, MMM d');
    }
}

function formatTimeForDisplay(timeStr: string): string {
    if (!timeStr) return '';
    
    try {
        // Handle different time formats
        // If it's just a time like "14:30:00"
        if (timeStr.includes(':')) {
            const [hours, minutes] = timeStr.split(':');
            const hour = parseInt(hours, 10);
            const minute = parseInt(minutes, 10);
            
            // Convert to 12-hour format with AM/PM
            const period = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
            
            return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
        }
        
        return timeStr;
    } catch (e) {
        console.error("Error formatting time:", e);
        return timeStr;
    }
}

function getBadgeClass(date: Date): string {
    if (isPast(date) && !isToday(date)) {
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
    } else if (isToday(date)) {
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
    } else if (isTomorrow(date)) {
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    } else {
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
}

function getPriorityColorClass(priority: string) {
    switch (priority) {
        case 'high': return 'bg-red-500';
        case 'medium': return 'bg-amber-500';
        case 'low': return 'bg-green-500';
        default: return 'bg-gray-500';
    }
}

function getPriorityBadgeClass(priority: string) {
    switch (priority) {
        case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
        case 'medium': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
        case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
        default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
}

function getReminderText(minutes: number | null) {
    if (!minutes) return '';
    if (minutes === 15) return '15 min before';
    if (minutes === 60) return '1 hour before';
    if (minutes === 1440) return '1 day before';
    return `${minutes} min before`;
}
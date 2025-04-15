// types/tasks.ts
export interface User {
    id: string;
    name: string;
    email: string;
}

export interface Task {
    id: string;
    userId: string;
    title: string;
    description: string;
    dueDate: string;
    due_date: string;
    dueTime?: string;
    due_time?: string;
    priority: Priority;
    reminder: number | null | undefined;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

export type Priority = string;
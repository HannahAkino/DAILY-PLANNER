// components/tasks/TaskStats.tsx
import { Card } from "@/components/ui/card";
import { ListTodo, CheckCircle, Clock } from "lucide-react";

interface TaskStatsProps {
    total: number;
    completed: number;
    pending: number;
}

export default function TaskStats({ total, completed, pending }: TaskStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                        <p className="text-2xl font-semibold text-gray-800">{total}</p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                        <ListTodo className="h-5 w-5" />
                    </div>
                </div>
            </Card>

            <Card className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Completed</p>
                        <p className="text-2xl font-semibold text-gray-800">{completed}</p>
                    </div>
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                    </div>
                </div>
            </Card>

            <Card className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Pending</p>
                        <p className="text-2xl font-semibold text-gray-800">{pending}</p>
                    </div>
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                        <Clock className="h-5 w-5" />
                    </div>
                </div>
            </Card>
        </div>
    );
}
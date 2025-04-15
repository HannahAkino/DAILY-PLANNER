// components/tasks/TaskModal.tsx
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Task } from "@/types/tasks";

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (taskData: Partial<Task>) => void;
    task: Task | null;
}

export default function TaskModal({ isOpen, onClose, onSave, task }: TaskModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("medium");
    const [hasReminder, setHasReminder] = useState(false);
    const [reminderTime, setReminderTime] = useState("15");

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || "");
            setDueDate(task.dueDate || "");
            setPriority(task.priority || "medium");
            setHasReminder(task.reminder !== null);
            if (task.reminder) {
                setReminderTime(String(task.reminder));
            }
        } else {
            resetForm();
        }
    }, [task, isOpen]);

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setDueDate("");
        setPriority("medium");
        setHasReminder(false);
        setReminderTime("15");
    };

    const handleSubmit = () => {
        if (!title.trim()) {
            alert("Task title is required");
            return;
        }

        onSave({
            title,
            description,
            dueDate,
            priority,
            reminder: hasReminder ? parseInt(reminderTime) : null,
        });

        resetForm();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">{task ? "Edit Task" : "Add New Task"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Task title"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Task description"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="dueDate">Due Date</Label>
                            <Input
                                id="dueDate"
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select value={priority} onValueChange={setPriority}>
                                <SelectTrigger id="priority">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="reminder"
                            checked={hasReminder}
                            onCheckedChange={(checked) => setHasReminder(!!checked)}
                        />
                        <Label htmlFor="reminder">Set reminder</Label>
                    </div>

                    {hasReminder && (
                        <div className="pl-6 space-y-2">
                            <RadioGroup value={reminderTime} onValueChange={setReminderTime}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="15" id="r15" />
                                    <Label htmlFor="r15">15 minutes before</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="60" id="r60" />
                                    <Label htmlFor="r60">1 hour before</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="1440" id="r1440" />
                                    <Label htmlFor="r1440">1 day before</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        Save Task
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
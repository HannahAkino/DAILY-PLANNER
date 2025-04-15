// components/dialogs/TaskDialog.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Task } from "@/types/tasks";

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<Task>) => void;
  task: Task | null;
}

export default function TaskDialog({ isOpen, onClose, onSave, task }: TaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState("medium");
  const [hasReminder, setHasReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState("15");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
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
    setDueDate(undefined);
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
      dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : undefined,
      priority,
      reminder: hasReminder ? parseInt(reminderTime) : null,
    });

    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground">
        <DialogHeader className="bg-primary/5 p-4 -mx-6 -mt-6 rounded-t-lg border-b">
          <DialogTitle className="text-2xl font-semibold">
            {task ? "Edit Task" : "Add New Task"}
          </DialogTitle>
          <DialogDescription>
            {task 
              ? "Update your task details below" 
              : "Fill in the details to create a new task"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="font-medium">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="border-input focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="font-medium">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              rows={3}
              className="border-input focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="font-medium">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="font-medium">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority" className="border-input focus:ring-2 focus:ring-primary/20">
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

          <div className="flex items-center space-x-2 mt-2">
            <Checkbox
              id="reminder"
              checked={hasReminder}
              onCheckedChange={(checked) => setHasReminder(!!checked)}
              className="rounded-sm data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
            <Label htmlFor="reminder" className="font-medium">Set reminder</Label>
          </div>

          {hasReminder && (
            <div className="pl-6 space-y-2 border-l-2 border-primary/20 ml-1">
              <Label className="text-sm text-muted-foreground mb-2 block">
                Remind me before the due date:
              </Label>
              <RadioGroup value={reminderTime} onValueChange={setReminderTime}>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="15" id="r15" />
                  <Label htmlFor="r15" className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>15 minutes before</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="60" id="r60" />
                  <Label htmlFor="r60" className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>1 hour before</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1440" id="r1440" />
                  <Label htmlFor="r1440" className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>1 day before</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {task ? "Update Task" : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

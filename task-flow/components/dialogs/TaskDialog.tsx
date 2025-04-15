// @ts-nocheck
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
import { CalendarIcon, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Task } from "@/types/tasks";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      
      // Handle date format from database (snake_case to camelCase)
      if (task.due_date) {
        setDueDate(new Date(task.due_date));
      } else if (task.dueDate) {
        setDueDate(new Date(task.dueDate));
      } else {
        setDueDate(undefined);
      }
      
      setPriority(task.priority || "medium");
      setHasReminder(task.reminder !== null && task.reminder !== undefined);
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
    setError(null);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    // Use database field naming convention (snake_case)
    onSave({
      title,
      description,
      due_date: dueDate ? format(dueDate, 'yyyy-MM-dd') : null,
      priority,
      reminder: hasReminder ? parseInt(reminderTime) : null,
    });

    resetForm();
    onClose();
  };

  // Get color class based on priority
  const getPriorityColor = () => {
    switch(priority) {
      case 'high': return 'from-red-500/20 to-red-500/5 border-red-200 dark:border-red-800';
      case 'medium': return 'from-amber-500/20 to-amber-500/5 border-amber-200 dark:border-amber-800';
      case 'low': return 'from-green-500/20 to-green-500/5 border-green-200 dark:border-green-800';
      default: return 'from-blue-500/20 to-blue-500/5 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground shadow-lg border-0">
        <DialogHeader className={`bg-gradient-to-r ${getPriorityColor()} p-6 -mx-6 -mt-6 rounded-t-lg border-b`}>
          <DialogTitle className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {task ? "Edit Task" : "Add New Task"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {task 
              ? "Update your task details below" 
              : "Fill in the details to create a new task"}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mt-2 bg-destructive/10 border-destructive/20 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="font-medium text-foreground">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="border-input bg-background focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="font-medium text-foreground">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              rows={3}
              className="border-input bg-background focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="font-medium text-foreground">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background",
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
                    className="rounded-md border shadow-md"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="font-medium text-foreground">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority" className="border-input bg-background focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="border shadow-md">
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
            <Label htmlFor="reminder" className="font-medium text-foreground">Set reminder</Label>
          </div>

          {hasReminder && (
            <div className="pl-6 space-y-3 border-l-2 border-primary/20 ml-1 py-2">
              <Label className="text-sm text-muted-foreground mb-2 block">
                Remind me before the due date:
              </Label>
              <RadioGroup value={reminderTime} onValueChange={setReminderTime} className="space-y-3">
                <div className="flex items-center space-x-2 mb-2 transition-all hover:bg-muted/20 p-1 rounded-md">
                  <RadioGroupItem value="15" id="r15" className="border-primary/50" />
                  <Label htmlFor="r15" className="flex items-center cursor-pointer">
                    <Clock className="h-3 w-3 mr-1 text-primary/80" />
                    <span>15 minutes before</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-2 transition-all hover:bg-muted/20 p-1 rounded-md">
                  <RadioGroupItem value="60" id="r60" className="border-primary/50" />
                  <Label htmlFor="r60" className="flex items-center cursor-pointer">
                    <Clock className="h-3 w-3 mr-1 text-primary/80" />
                    <span>1 hour before</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 transition-all hover:bg-muted/20 p-1 rounded-md">
                  <RadioGroupItem value="1440" id="r1440" className="border-primary/50" />
                  <Label htmlFor="r1440" className="flex items-center cursor-pointer">
                    <Clock className="h-3 w-3 mr-1 text-primary/80" />
                    <span>1 day before</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-2 pt-2 border-t">
          <Button variant="outline" onClick={onClose} className="bg-background">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {task ? "Update Task" : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Clock, X } from "lucide-react";

export interface ReminderAlertProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  dueDate: string;
  dueTime: string;
}

export default function ReminderAlert({
  isOpen,
  onClose,
  title,
  dueDate,
  dueTime
}: ReminderAlertProps) {
  const [visible, setVisible] = useState(isOpen);
  
  useEffect(() => {
    setVisible(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setVisible(false);
    onClose();
  };

  // Format the date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Format the time for display
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    
    try {
      // Handle "HH:MM:SS" format
      if (timeString.includes(':')) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);
        
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        
        return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
      }
      
      return timeString;
    } catch (e) {
      return timeString;
    }
  };
  
  // Return null if not visible to prevent dialog from rendering at all
  if (!visible) return null;
  
  return (
    <Dialog open={visible} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md border-red-600 dark:border-red-700 border-2 shadow-lg animate-pulse bg-white dark:bg-gray-900">
        <DialogHeader className="bg-red-100 dark:bg-red-900/30 -mx-6 -mt-6 px-6 py-4 rounded-t-lg border-b border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <Bell className="h-5 w-5 animate-ping" />
            <DialogTitle className="text-xl font-bold">Task Reminder</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Calendar className="h-4 w-4 mr-2 text-red-500 dark:text-red-400" />
              <span>{formatDate(dueDate)}</span>
            </div>
            
            {dueTime && (
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <Clock className="h-4 w-4 mr-2 text-red-500 dark:text-red-400" />
                <span>{formatTime(dueTime)}</span>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex justify-end border-t border-red-100 dark:border-red-900/30 pt-3">
          <Button 
            onClick={handleClose}
            className="bg-red-600 text-white hover:bg-red-500 transition-colors"
          >
            <X className="h-4 w-4 mr-2" />
            Dismiss
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

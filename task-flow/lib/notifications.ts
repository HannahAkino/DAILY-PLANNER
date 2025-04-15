// lib/notifications.ts
// Utility for handling task notifications and reminders

// Play a notification sound using system sounds
export const playNotificationSound = () => {
  try {
    // Use a simple beep sound from the browser's Audio context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 800; // Sound frequency in Hz
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Short beep
    gainNode.gain.value = 0.1;
    oscillator.start();
    
    // Stop after a short duration
    setTimeout(() => {
      oscillator.stop();
      // Clean up
      setTimeout(() => {
        gainNode.disconnect();
        oscillator.disconnect();
      }, 100);
    }, 300);
    
    return true;
  } catch (error) {
    console.error('Error playing notification sound:', error);
    return false;
  }
};

// Schedule a browser notification for a task
export const scheduleTaskNotification = (
  taskId: string,
  title: string,
  dueDate: string,
  dueTime: string,
  reminderMinutes: number | null
) => {
  // Only schedule if we have a reminder value
  if (!reminderMinutes) return null;
  
  // Parse the date and time
  const dueDateObj = new Date(`${dueDate}T${dueTime || '00:00:00'}`);
  const now = new Date();
  
  // Calculate when to show the reminder
  const reminderTime = new Date(dueDateObj.getTime() - (reminderMinutes * 60 * 1000));
  
  // If the reminder time is in the past, don't schedule it
  if (reminderTime <= now) return null;
  
  console.log(`Scheduling notification for "${title}" at ${reminderTime.toLocaleString()}`);
  
  // Calculate the delay in milliseconds
  const delay = reminderTime.getTime() - now.getTime();
  
  // Store the timeout ID
  const timeoutId = window.setTimeout(() => {
    // Request permission and show notification
    if (Notification && Notification.permission === "granted") {
      showTaskNotification(title, dueDate, dueTime);
    } else if (Notification && Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          showTaskNotification(title, dueDate, dueTime);
        }
      });
    }
  }, delay);
  
  // Store the timeout ID in localStorage to persist across page reloads
  const storedTimeouts = JSON.parse(localStorage.getItem('taskNotificationTimeouts') || '{}');
  storedTimeouts[taskId] = {
    timeoutId,
    expiresAt: reminderTime.getTime(),
  };
  localStorage.setItem('taskNotificationTimeouts', JSON.stringify(storedTimeouts));
  
  return timeoutId;
};

// Show the actual notification
export const showTaskNotification = (title: string, dueDate: string, dueTime: string) => {
  // Play sound
  playNotificationSound();
  
  // Show a browser notification
  const notification = new Notification("Task Reminder", {
    body: `Your task "${title}" is ${dueTime ? `due at ${dueTime} on ${formatDateForDisplay(dueDate)}` : `due on ${formatDateForDisplay(dueDate)}`}`,
    icon: "/favicon.ico",
  });
  
  // Close the notification after 5 seconds
  setTimeout(() => notification.close(), 5000);
  
  return notification;
};

// Helper to format date for display
function formatDateForDisplay(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short', 
    day: 'numeric'
  });
}

// Initialize notifications system (call this on app start)
export const initNotifications = () => {
  // Request notification permission early
  if (Notification && Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission();
  }
  
  // Check for scheduled notifications and restore them
  const storedTimeouts = JSON.parse(localStorage.getItem('taskNotificationTimeouts') || '{}');
  const now = new Date().getTime();
  
  // Process stored timeouts
  Object.entries(storedTimeouts).forEach(([taskId, data]: [string, any]) => {
    // If the notification is in the future, reschedule it
    if (data.expiresAt > now) {
      // We'd need to get the task details, but for this example we'll just use placeholders
      // In a real implementation, you'd lookup the task from your state or database
      window.setTimeout(() => {
        showTaskNotification("Task Reminder", new Date(data.expiresAt).toISOString().split('T')[0], "");
      }, data.expiresAt - now);
    } else {
      // Remove expired notifications
      delete storedTimeouts[taskId];
    }
  });
  
  // Save the updated timeouts
  localStorage.setItem('taskNotificationTimeouts', JSON.stringify(storedTimeouts));
};

// Cancel a scheduled notification
export const cancelTaskNotification = (taskId: string) => {
  const storedTimeouts = JSON.parse(localStorage.getItem('taskNotificationTimeouts') || '{}');
  
  if (storedTimeouts[taskId]) {
    window.clearTimeout(storedTimeouts[taskId].timeoutId);
    delete storedTimeouts[taskId];
    localStorage.setItem('taskNotificationTimeouts', JSON.stringify(storedTimeouts));
    return true;
  }
  
  return false;
};

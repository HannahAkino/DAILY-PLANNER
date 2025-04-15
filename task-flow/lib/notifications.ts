// lib/notifications.ts
// Utility for handling task notifications and reminders

// Play a notification sound using system sounds
export const playNotificationSound = () => {
  try {
    // First attempt: Use external MP3 file from /public directory
    const audio = new Audio('/NOTIFY.mp3');
    audio.volume = 0.7; // Set volume to 70%
    
    // Play the sound
    const playPromise = audio.play();
    
    // Handle potential promise rejection (in modern browsers)
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error("External audio playback failed:", error);
        // Fallback to embedded audio if external file fails
        playEmbeddedAudio();
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error playing external notification sound:', error);
    // Try fallback approach
    return playEmbeddedAudio();
  }
};

// Second fallback: embedded audio data
function playEmbeddedAudio() {
  try {
    // Approach 2: HTML5 Audio element with embedded data
    const audio = new Audio();
    audio.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PruXMvBh5TltztwpRGCxNEiM/z1rGMFwMRb7X04beAHwALXqDh78upRwgMPoznv+mrfDMHFF+p6r0uMgI0fNDa4qQ6CyRwxO/NdicsJ3306t10IQk1hujMsVYYCS2J5dO3Wx4JL4Pq1cWUTBEUYK/t0b+cRBEcMpnizpd+UiYiJoTmrBkVHFCk4rJKGiMwf+atTB8jPZjcuFohIkCW6MVEliK9VJAAAHic3L+zoJmVlpeZm52TcFNOaJixq4BRR1yZt7KJbWD/UQAGIxIAAHiclKA7NamtuK6nnoASBhhImvNwFACIDHZoWl+Sl5aYm5EpAAgTQIrLtGsVE0B8ubgWGD2T1t10GRAZPpPhej4GH02k+IgVAA1Bo/mBIQURToD2kBoGD0h9/osbBgF7kQmDZE1Me2sgBweSPCcAAIeQfoI2Hj42FgCbpqIWAACLkoRzQS0WHzIsHRAAkaUgAFlcVmljPCcHAJalUQAUHiApMDIzJwMAjqaDAEsVAAKSrBE5luKxPRcJAJOhAABSTVBRRisAAJimFidMW/N5BwCaqB4AVVlHTkU4NgcAl6GK9ndQW11fYGJjZEIDAI60V0UikrKnHAkAlKVkRlFTVVfyVABqc1MAaW08AAACMDk8Pj9AQUINCAAAPUZKsn8TBgiR9YYVChCHznccBQA/S06enJgAAESR0mECAD5P+734vgBM9Uc/QE1vcHFyc3R1km0AADZnwXgSMEw6yrgWADFhyWEAADJFDcOqCQAxboLkuToMAC5grdq1CQAqWPrtuDoIAChU5s2gcBgMACNG9r0QAB1LjOC5OQcAHEOAyLs7BAAbPWed2cbJzM3Ov2UAABc2U1evYQAAFTJOTv3+WAAAABIs8d7g4eLj5OXmuE0AABAY7+usAAARFdI6IkBOjSUAAA8RzXRucHFyc3R1ttS7vb6/wmgAAPnvDA4PENEhISIkJSYJ/VEA//XzF/f6+/z9/v8A1HIdHH7/IiQlJicoKSor5R8A8RgXFBFykQwAAOgC/8ZZmA8A5djDr1+UEgDfz7N9pHcA28WlWa+ZANLR0ry1uJUV0MesJr3OuQB7maZy/d4A0LoaAMgB/7e7vL2+v8DBKaOlpqeoqaqrrK2utA4AuKoDALQA17m8vb6/wMHCw8SsEgCvGBYUEu/QAK2ur7CxsrO0tau3uLm6u7y9vr/AwcLDxK2/AKoYQwCnoKGio6SlpqezCgClpgCfmJmam5ydnp/zBgCcnQagAJSQkZKTlJWWl7WMmJmam5ydnp+gAJJ3ASKNjo+QkZKTlJWWl5hRyACSmeGa3pubQwBI5wCJmgCDfH1+f4CBgoOShYaHiImKi4yNjo+QkaEGAHyeAHZ3eHl6e3x9fn8/AHN1dgBtb3BxcnN0dZhnaGlqa2xtbm9wcXJzdd+ZAGcXpGFiY2RlZmdoaWprbHwGAGBFAFlLAFNUVVZXWFlaZVJTVFVWV1hZWltkAE1OT1BRUlNUVVZXWFlacOMATe4ARRkAPDc4OTo7PD0+TD9AQUJDREVGR0hJSktMTU59DAA8mgA2Jf8xMjM0NTY3ODk6Ozw9Pj9AQUJDREVGR0hJSks6TQAwMQApKissLS4vMDEyMzQ1Njc4OTpfkiWkKTcAISIjJCUmJygpKissLS4vMDEyMzQ1Ngw9HgAgXQAZGhscHR4fICEiIyQlJhYAnpoIAJeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/wA=";
    audio.volume = 0.5; // Set volume to 50%
    
    // Play the sound
    const playPromise = audio.play();
    
    // Handle potential promise rejection (in modern browsers)
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error("Embedded audio playback failed:", error);
        // Fallback to Web Audio API if embedded audio fails
        playAudioWithWebAudio();
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error playing embedded notification sound:', error);
    // Try final fallback approach
    return playAudioWithWebAudio();
  }
}

// Third fallback: Web Audio API
function playAudioWithWebAudio() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Configure a more noticeable sound
    oscillator.type = 'square'; // square wave sounds more like an alert
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Louder sound
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    
    // Play a beep pattern
    oscillator.start();
    
    // First beep
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    // Second beep
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + 0.3);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    // Stop after the pattern
    oscillator.stop(audioContext.currentTime + 0.6);
    
    return true;
  } catch (e) {
    console.error("All audio playback methods failed:", e);
    return false;
  }
}

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

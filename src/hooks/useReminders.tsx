
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Reminder, Task, Habit } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { loadFromStorage, saveToStorage } from '@/utils/initialData';

export const useReminders = () => {
  const { toast } = useToast();
  
  const [reminders, setReminders] = useState<Reminder[]>(() => 
    loadFromStorage('teddy-reminders', [])
  );
  
  useEffect(() => {
    saveToStorage('teddy-reminders', reminders);
  }, [reminders]);
  
  // Check for due reminders and show notifications
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      
      reminders.forEach(reminder => {
        if (!reminder.completed) {
          const reminderTime = new Date(reminder.time);
          
          // Check if the reminder is due (within the last minute)
          const timeDifference = (now.getTime() - reminderTime.getTime()) / 1000;
          if (timeDifference >= 0 && timeDifference < 60) {
            // Show notification
            toast({
              title: 'Reminder: ' + reminder.title,
              description: 'This task is due now!',
            });
            
            // Attempt to use browser notifications if allowed
            if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
              new Notification('Reminder: ' + reminder.title, {
                body: 'This task is due now!',
              });
            }
          }
        }
      });
    };
    
    // Request notification permission
    if (typeof Notification !== 'undefined' && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
    
    // Check reminders every minute
    const interval = setInterval(checkReminders, 60 * 1000);
    checkReminders(); // Check on init
    
    return () => clearInterval(interval);
  }, [reminders, toast]);
  
  const addReminder = (title: string, time: Date, taskId?: string, habitId?: string) => {
    const reminder: Reminder = {
      id: uuidv4(),
      title,
      time,
      completed: false,
      taskId,
      habitId
    };
    
    setReminders([...reminders, reminder]);
    
    toast({
      title: 'Reminder set',
      description: `You'll be reminded about "${title}" on ${time.toLocaleDateString()} at ${time.toLocaleTimeString()}`,
    });
  };
  
  const completeReminder = (id: string) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, completed: true } : reminder
    ));
  };
  
  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };
  
  // Update reminders when a task gets a reminder
  const setTaskReminder = (task: Task, reminderTime: Date) => {
    // First, delete any existing reminders for this task
    const filteredReminders = reminders.filter(r => r.taskId !== task.id);
    
    // Add the new reminder
    const newReminder: Reminder = {
      id: uuidv4(),
      title: task.title,
      time: reminderTime,
      completed: false,
      taskId: task.id
    };
    
    setReminders([...filteredReminders, newReminder]);
    
    toast({
      title: 'Task reminder set',
      description: `You'll be reminded about "${task.title}" on ${reminderTime.toLocaleDateString()} at ${reminderTime.toLocaleTimeString()}`,
    });
  };
  
  // Update reminders when a habit gets a reminder
  const setHabitReminder = (habit: Habit, reminderTime: Date) => {
    // First, delete any existing reminders for this habit
    const filteredReminders = reminders.filter(r => r.habitId !== habit.id);
    
    // Add the new reminder
    const newReminder: Reminder = {
      id: uuidv4(),
      title: habit.title,
      time: reminderTime,
      completed: false,
      habitId: habit.id
    };
    
    setReminders([...filteredReminders, newReminder]);
    
    toast({
      title: 'Habit reminder set',
      description: `You'll be reminded about "${habit.title}" on ${reminderTime.toLocaleDateString()} at ${reminderTime.toLocaleTimeString()}`,
    });
  };
  
  return {
    reminders,
    addReminder,
    completeReminder,
    deleteReminder,
    setTaskReminder,
    setHabitReminder
  };
};

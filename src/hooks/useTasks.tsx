
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { initialTasks, loadFromStorage, saveToStorage } from '@/utils/initialData';

export const useTasks = (gainExperience?: (amount: number) => void) => {
  const { toast } = useToast();
  
  const [tasks, setTasks] = useState<Task[]>(() => 
    loadFromStorage('teddy-tasks', initialTasks)
  );
  
  useEffect(() => {
    saveToStorage('teddy-tasks', tasks);
  }, [tasks]);
  
  const addTask = (newTask: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: uuidv4(),
      completed: false,
      createdAt: new Date(),
    };
    setTasks([...tasks, task]);
    toast({
      title: 'Task added!',
      description: `"${task.title}" has been added to your tasks.`,
    });
  };
  
  const completeTask = (id: string, completed: boolean) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed } : task
    ));
    
    if (completed) {
      // Award XP based on task priority
      const task = tasks.find(t => t.id === id);
      if (task && gainExperience) {
        let xpAmount = 10; // Base XP
        
        // Award more XP for higher priority tasks
        if (task.priority === 'medium') xpAmount = 20;
        if (task.priority === 'high') xpAmount = 30;
        
        gainExperience(xpAmount);
      }
      
      toast({
        title: 'Task completed!',
        description: "Great job! Keep up the good work.",
      });
    }
  };
  
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({
      title: 'Task deleted',
      description: 'The task has been removed from your list.',
    });
  };
  
  const completedTasks = tasks.filter(task => task.completed);
  const uncompletedTasks = tasks.filter(task => !task.completed);
  
  return {
    tasks,
    completedTasks,
    uncompletedTasks,
    addTask,
    completeTask,
    deleteTask
  };
};

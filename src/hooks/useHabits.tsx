
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Habit } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { initialHabits, loadFromStorage, saveToStorage } from '@/utils/initialData';

export const useHabits = () => {
  const { toast } = useToast();
  
  const [habits, setHabits] = useState<Habit[]>(() => 
    loadFromStorage('teddy-habits', initialHabits)
  );
  
  useEffect(() => {
    saveToStorage('teddy-habits', habits);
  }, [habits]);
  
  const addHabit = (newHabit: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'daysCompleted'>) => {
    const habit: Habit = {
      ...newHabit,
      id: uuidv4(),
      streak: 0,
      daysCompleted: [],
      createdAt: new Date(),
    };
    setHabits([...habits, habit]);
    toast({
      title: 'Habit created!',
      description: `"${habit.title}" has been added to your habits.`,
    });
  };
  
  const completeHabit = (id: string) => {
    setHabits(habits.map(habit => {
      if (habit.id !== id) return habit;
      
      const isDaily = habit.frequency === 'daily';
      const lastCompletedDate = habit.lastCompleted 
        ? new Date(habit.lastCompleted) 
        : null;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (isDaily && lastCompletedDate) {
        const lastDate = new Date(lastCompletedDate);
        lastDate.setHours(0, 0, 0, 0);
        
        if (lastDate.getTime() === today.getTime()) {
          return habit;
        }
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const isContinuous = lastDate.getTime() === yesterday.getTime();
        
        return {
          ...habit,
          streak: isContinuous ? habit.streak + 1 : 1,
          lastCompleted: new Date(),
          daysCompleted: [...habit.daysCompleted, new Date()]
        };
      } 
      
      const isThisWeekCompleted = habit.daysCompleted.some(date => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        const thisMonday = new Date(today.setDate(diff));
        thisMonday.setHours(0, 0, 0, 0);
        return d >= thisMonday;
      });
      
      if (!isDaily && habit.frequency === 'weekly' && isThisWeekCompleted) {
        return habit;
      }
      
      return {
        ...habit,
        streak: habit.streak + 1,
        lastCompleted: new Date(),
        daysCompleted: [...habit.daysCompleted, new Date()]
      };
    }));
    
    toast({
      title: 'Habit completed!',
      description: "You're building consistency. Keep it up!",
    });
  };
  
  return {
    habits,
    addHabit,
    completeHabit
  };
};

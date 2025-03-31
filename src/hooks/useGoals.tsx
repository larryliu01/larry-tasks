
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Goal } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { initialGoals, loadFromStorage, saveToStorage } from '@/utils/initialData';

export const useGoals = () => {
  const { toast } = useToast();
  
  const [goals, setGoals] = useState<Goal[]>(() => 
    loadFromStorage('teddy-goals', initialGoals)
  );
  
  useEffect(() => {
    saveToStorage('teddy-goals', goals);
  }, [goals]);
  
  const addGoal = (newGoal: Omit<Goal, 'id' | 'createdAt'>) => {
    const goal: Goal = {
      ...newGoal,
      id: uuidv4(),
      createdAt: new Date(),
    };
    setGoals([...goals, goal]);
    toast({
      title: 'Goal created!',
      description: `"${goal.title}" has been added to your goals.`,
    });
  };
  
  const updateGoal = (id: string, progress: number) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;
    
    const wasComplete = goal.progress >= goal.target;
    const isNowComplete = progress >= goal.target;
    
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, progress } : goal
    ));
    
    if (!wasComplete && isNowComplete) {
      toast({
        title: 'Goal achieved!',
        description: `Congratulations! You've reached your goal: "${goal.title}"`,
      });
    }
  };
  
  return {
    goals,
    addGoal,
    updateGoal
  };
};


import { useState, useEffect } from 'react';
import { TeddyCustomization, TeddyAccessory } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { initialCustomization, initialAccessories, loadFromStorage, saveToStorage } from '@/utils/initialData';

export const useTeddyCustomization = () => {
  const { toast } = useToast();
  
  const [teddyCustomization, setTeddyCustomization] = useState<TeddyCustomization>(() => 
    loadFromStorage('teddy-customization', initialCustomization)
  );
  
  const [accessories, setAccessories] = useState<TeddyAccessory[]>(() => 
    loadFromStorage('teddy-accessories', initialAccessories)
  );
  
  useEffect(() => {
    saveToStorage('teddy-customization', teddyCustomization);
  }, [teddyCustomization]);
  
  useEffect(() => {
    saveToStorage('teddy-accessories', accessories);
  }, [accessories]);
  
  const unlockAccessory = (completedCount: number) => {
    if (completedCount % 5 === 0) {
      const lockedAccessories = accessories.filter(a => !a.unlocked);
      if (lockedAccessories.length > 0) {
        const randomIndex = Math.floor(Math.random() * lockedAccessories.length);
        const accessoryToUnlock = lockedAccessories[randomIndex];
        setAccessories(accessories.map(a => 
          a.id === accessoryToUnlock.id ? { ...a, unlocked: true } : a
        ));
        toast({
          title: 'New accessory unlocked!',
          description: `You've unlocked the "${accessoryToUnlock.name}" for your teddy!`,
        });
      }
    }
  };

  const gainExperience = (amount: number) => {
    setTeddyCustomization(prev => {
      const newExperience = prev.experience + amount;
      
      // Check if the character should level up
      if (newExperience >= prev.nextLevelExperience) {
        const newLevel = prev.level + 1;
        // Calculate next level experience requirement (increases with each level)
        const nextLevelExperience = Math.floor(prev.nextLevelExperience * 1.5);
        
        toast({
          title: 'Level Up!',
          description: `${prev.name} has reached level ${newLevel}! Keep up the good work!`,
        });
        
        return {
          ...prev,
          level: newLevel,
          experience: newExperience - prev.nextLevelExperience,
          nextLevelExperience,
        };
      }
      
      return {
        ...prev,
        experience: newExperience,
      };
    });
  };
  
  return {
    teddyCustomization,
    setTeddyCustomization,
    accessories,
    unlockAccessory,
    gainExperience
  };
};

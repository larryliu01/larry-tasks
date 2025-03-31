
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
  
  return {
    teddyCustomization,
    setTeddyCustomization,
    accessories,
    unlockAccessory
  };
};

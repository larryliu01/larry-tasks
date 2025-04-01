
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DailyAdvice } from '@/types';
import { loadFromStorage, saveToStorage } from '@/utils/initialData';

const adviceList = [
  "Take a small step every day toward your goals.",
  "Remember to drink water and stay hydrated!",
  "A little progress each day adds up to big results.",
  "Don't forget to stretch and take breaks from sitting.",
  "Celebrate your small victories too!",
  "Be kind to yourself, you're doing your best.",
  "Taking time to rest is also being productive.",
  "Focus on progress, not perfection.",
  "Doing something small is better than doing nothing.",
  "Your habits shape your future self.",
  "Consistency beats intensity in the long run.",
  "Remember why you started when things get tough.",
  "Every expert was once a beginner.",
  "It's okay to have bad days, just don't give up.",
  "Small changes lead to big transformations."
];

export const useDailyAdvice = () => {
  const [allAdvices, setAllAdvices] = useState<DailyAdvice[]>(() => 
    loadFromStorage('teddy-advices', [])
  );
  
  const [currentAdvice, setCurrentAdvice] = useState<DailyAdvice>(() => {
    const savedAdvices = loadFromStorage('teddy-advices', []);
    
    // Check if we have an advice for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayAdvice = savedAdvices.find(advice => {
      const adviceDate = new Date(advice.date);
      adviceDate.setHours(0, 0, 0, 0);
      return adviceDate.getTime() === today.getTime();
    });
    
    if (todayAdvice) {
      return todayAdvice;
    }
    
    // Create a new advice for today
    const randomIndex = Math.floor(Math.random() * adviceList.length);
    const newAdvice: DailyAdvice = {
      id: uuidv4(),
      text: adviceList[randomIndex],
      date: today,
      saved: false
    };
    
    // Save to allAdvices
    setAllAdvices(prev => [...prev, newAdvice]);
    
    return newAdvice;
  });
  
  useEffect(() => {
    saveToStorage('teddy-advices', allAdvices);
  }, [allAdvices]);
  
  const saveAdvice = (advice: DailyAdvice) => {
    const updatedAdvices = allAdvices.map(a => 
      a.id === advice.id ? advice : a
    );
    
    setAllAdvices(updatedAdvices);
    setCurrentAdvice(advice);
  };
  
  const savedAdvices = allAdvices.filter(advice => advice.saved);
  
  return {
    currentAdvice,
    savedAdvices,
    saveAdvice
  };
};

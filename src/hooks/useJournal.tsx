
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { JournalEntry } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { loadFromStorage, saveToStorage } from '@/utils/initialData';

export const useJournal = () => {
  const { toast } = useToast();
  
  const [entries, setEntries] = useState<JournalEntry[]>(() => 
    loadFromStorage('teddy-journal', [])
  );
  
  useEffect(() => {
    saveToStorage('teddy-journal', entries);
  }, [entries]);
  
  const addEntry = (newEntry: Omit<JournalEntry, 'id' | 'date'>) => {
    const entry: JournalEntry = {
      ...newEntry,
      id: uuidv4(),
      date: new Date(),
    };
    
    setEntries([entry, ...entries]);
    
    toast({
      title: 'Journal entry saved',
      description: 'Your thoughts have been captured for today.',
    });
  };
  
  return {
    entries,
    addEntry
  };
};


import { v4 as uuidv4 } from 'uuid';
import { Task, Habit, Goal, TeddyCustomization, TeddyAccessory } from '@/types';

// Initial sample data
export const initialTasks: Task[] = [
  {
    id: uuidv4(),
    title: 'Complete project proposal',
    description: 'Finish the draft and send it to the team for review',
    completed: false,
    priority: 'high',
    category: 'Work',
    dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
    createdAt: new Date(),
  },
  {
    id: uuidv4(),
    title: 'Go for a 30-minute walk',
    description: 'Take a brisk walk around the neighborhood',
    completed: false,
    priority: 'medium',
    category: 'Health',
    createdAt: new Date(),
  }
];

export const initialHabits: Habit[] = [
  {
    id: uuidv4(),
    title: 'Drink water',
    description: 'Drink at least 8 glasses of water',
    streak: 3,
    frequency: 'daily',
    daysCompleted: [
      new Date(Date.now() - 86400000 * 3),
      new Date(Date.now() - 86400000 * 2),
      new Date(Date.now() - 86400000),
    ],
    createdAt: new Date(Date.now() - 86400000 * 7),
  }
];

export const initialGoals: Goal[] = [
  {
    id: uuidv4(),
    title: 'Read 24 books',
    description: 'Read at least 2 books every month',
    progress: 5,
    target: 24,
    category: 'Learning',
    dueDate: new Date(new Date().getFullYear(), 11, 31), // December 31 this year
    createdAt: new Date(),
  }
];

export const initialAccessories: TeddyAccessory[] = [
  { id: 'hat', name: 'Cozy Hat', type: 'hat', unlocked: true },
  { id: 'scarf', name: 'Warm Scarf', type: 'scarf', unlocked: true },
  { id: 'glasses', name: 'Reading Glasses', type: 'glasses', unlocked: true },
  { id: 'bowtie', name: 'Fancy Bow Tie', type: 'outfit', unlocked: false },
  { id: 'crown', name: 'Royal Crown', type: 'hat', unlocked: false },
];

export const initialCustomization: TeddyCustomization = {
  color: 'bg-teddy',
  accessories: ['hat'],
  name: 'Teddy',
};

// Helper functions to handle localStorage
export const loadFromStorage = <T,>(key: string, initialData: T): T => {
  if (typeof window === 'undefined') return initialData;
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : initialData;
};

export const saveToStorage = (key: string, data: any): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

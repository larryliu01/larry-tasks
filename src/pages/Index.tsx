
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, Habit, Goal, TeddyCustomization, TeddyAccessory } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, ListTodo, Target, Calendar } from 'lucide-react';

import WeatherBackground from '@/components/WeatherBackground';
import TeddyCharacter from '@/components/TeddyCharacter';
import TaskCard from '@/components/TaskCard';
import AddTaskForm from '@/components/AddTaskForm';
import HabitTracker from '@/components/HabitTracker';
import GoalTracker from '@/components/GoalTracker';
import TeddySettings from '@/components/TeddySettings';

// Initial sample data
const initialTasks: Task[] = [
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

const initialHabits: Habit[] = [
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

const initialGoals: Goal[] = [
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

const initialAccessories: TeddyAccessory[] = [
  { id: 'hat', name: 'Cozy Hat', type: 'hat', unlocked: true },
  { id: 'scarf', name: 'Warm Scarf', type: 'scarf', unlocked: true },
  { id: 'glasses', name: 'Reading Glasses', type: 'glasses', unlocked: true },
  { id: 'bowtie', name: 'Fancy Bow Tie', type: 'outfit', unlocked: false },
  { id: 'crown', name: 'Royal Crown', type: 'hat', unlocked: false },
];

const initialCustomization: TeddyCustomization = {
  color: 'bg-teddy',
  accessories: ['hat'],
  name: 'Teddy',
};

const Index = () => {
  const { toast } = useToast();
  
  // State for all our data
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('teddy-tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });
  
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('teddy-habits');
    return saved ? JSON.parse(saved) : initialHabits;
  });
  
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('teddy-goals');
    return saved ? JSON.parse(saved) : initialGoals;
  });
  
  const [teddyCustomization, setTeddyCustomization] = useState<TeddyCustomization>(() => {
    const saved = localStorage.getItem('teddy-customization');
    return saved ? JSON.parse(saved) : initialCustomization;
  });
  
  const [accessories, setAccessories] = useState<TeddyAccessory[]>(() => {
    const saved = localStorage.getItem('teddy-accessories');
    return saved ? JSON.parse(saved) : initialAccessories;
  });
  
  // Save to localStorage whenever our data changes
  useEffect(() => {
    localStorage.setItem('teddy-tasks', JSON.stringify(tasks));
    localStorage.setItem('teddy-habits', JSON.stringify(habits));
    localStorage.setItem('teddy-goals', JSON.stringify(goals));
    localStorage.setItem('teddy-customization', JSON.stringify(teddyCustomization));
    localStorage.setItem('teddy-accessories', JSON.stringify(accessories));
  }, [tasks, habits, goals, teddyCustomization, accessories]);
  
  // Handler functions for tasks
  const handleAddTask = (newTask: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
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
  
  const handleCompleteTask = (id: string, completed: boolean) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed } : task
    ));
    if (completed) {
      toast({
        title: 'Task completed!',
        description: 'Great job! Keep up the good work.',
      });
      
      // Check if we should unlock any accessories
      const completedCount = tasks.filter(t => t.completed).length + 1;
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
    }
  };
  
  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({
      title: 'Task deleted',
      description: 'The task has been removed from your list.',
    });
  };
  
  // Handler functions for habits
  const handleAddHabit = (newHabit: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'daysCompleted'>) => {
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
  
  const handleCompleteHabit = (id: string) => {
    setHabits(habits.map(habit => {
      if (habit.id !== id) return habit;
      
      const isDaily = habit.frequency === 'daily';
      const lastCompletedDate = habit.lastCompleted 
        ? new Date(habit.lastCompleted) 
        : null;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // For daily habits, check if it was completed today
      if (isDaily && lastCompletedDate) {
        const lastDate = new Date(lastCompletedDate);
        lastDate.setHours(0, 0, 0, 0);
        
        if (lastDate.getTime() === today.getTime()) {
          return habit; // Already completed today
        }
        
        // Check if the streak is continuous
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
      
      // For weekly habits, just check if it was completed this week
      const isThisWeekCompleted = habit.daysCompleted.some(date => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
        const thisMonday = new Date(today.setDate(diff));
        thisMonday.setHours(0, 0, 0, 0);
        return d >= thisMonday;
      });
      
      if (!isDaily && isThisWeekCompleted) {
        return habit; // Already completed this week
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
      description: 'You're building consistency. Keep it up!',
    });
  };
  
  // Handler functions for goals
  const handleAddGoal = (newGoal: Omit<Goal, 'id' | 'createdAt'>) => {
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
  
  const handleUpdateGoal = (id: string, progress: number) => {
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
  
  // Filter completed and uncompleted tasks
  const completedTasks = tasks.filter(task => task.completed);
  const uncompletedTasks = tasks.filter(task => !task.completed);
  
  return (
    <div className="min-h-screen py-6 px-4 md:px-8 max-w-7xl mx-auto">
      <WeatherBackground />
      
      <header className="mb-8 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <h1 className="text-3xl font-bold font-cute">Teddy Tasks</h1>
        </div>
        <div className="flex items-center gap-4">
          <TeddySettings 
            customization={teddyCustomization}
            onUpdateCustomization={setTeddyCustomization}
            accessories={accessories}
          />
        </div>
      </header>
      
      <main className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Teddy Character - Left Side */}
        <div className="lg:col-span-2 order-1 flex flex-col items-center">
          <div className="glass rounded-2xl p-6 w-full flex justify-center">
            <TeddyCharacter 
              tasks={tasks}
              habits={habits}
              customization={teddyCustomization}
            />
          </div>
          
          <div className="mt-6 w-full">
            <HabitTracker 
              habits={habits}
              onCompleteHabit={handleCompleteHabit}
              onAddHabit={handleAddHabit}
            />
          </div>
          
          <div className="mt-6 w-full">
            <GoalTracker 
              goals={goals}
              onUpdateGoal={handleUpdateGoal}
              onAddGoal={handleAddGoal}
            />
          </div>
        </div>
        
        {/* Task Management - Right Side */}
        <div className="lg:col-span-5 order-2">
          <AddTaskForm onAddTask={handleAddTask} />
          
          <Tabs defaultValue="tasks" className="glass rounded-lg p-4">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="tasks" className="flex items-center">
                <ListTodo className="mr-2 h-4 w-4" />
                Tasks {uncompletedTasks.length > 0 && `(${uncompletedTasks.length})`}
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4" />
                Completed {completedTasks.length > 0 && `(${completedTasks.length})`}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="tasks">
              {uncompletedTasks.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <p className="text-lg mb-2">All caught up!</p>
                  <p>You don't have any pending tasks. Add a new task to get started.</p>
                </div>
              ) : (
                <div className="task-grid">
                  {uncompletedTasks.map(task => (
                    <TaskCard 
                      key={task.id}
                      task={task}
                      onComplete={handleCompleteTask}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              {completedTasks.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <p className="text-lg mb-2">Nothing completed yet</p>
                  <p>When you complete tasks, they will appear here.</p>
                </div>
              ) : (
                <div className="task-grid">
                  {completedTasks.map(task => (
                    <TaskCard 
                      key={task.id}
                      task={task}
                      onComplete={handleCompleteTask}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;

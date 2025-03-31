
import { useEffect } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useHabits } from '@/hooks/useHabits';
import { useGoals } from '@/hooks/useGoals';
import { useTeddyCustomization } from '@/hooks/useTeddyCustomization';

import WeatherBackground from '@/components/WeatherBackground';
import TeddySettings from '@/components/TeddySettings';
import DateTime from '@/components/DateTime';
import TaskSection from '@/components/TaskSection';
import TeddySidebar from '@/components/TeddySidebar';

const Index = () => {
  const { tasks, completedTasks, uncompletedTasks, addTask, completeTask, deleteTask } = useTasks();
  const { habits, addHabit, completeHabit } = useHabits();
  const { goals, addGoal, updateGoal } = useGoals();
  const { teddyCustomization, setTeddyCustomization, accessories, unlockAccessory } = useTeddyCustomization();
  
  // Check if completing a task should unlock an accessory
  useEffect(() => {
    const completedCount = tasks.filter(t => t.completed).length;
    unlockAccessory(completedCount);
  }, [tasks]);
  
  return (
    <div className="min-h-screen py-6 px-4 md:px-8 max-w-7xl mx-auto">
      <WeatherBackground />
      
      <header className="mb-4 flex flex-col md:flex-row justify-between items-center">
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
      
      <div className="mb-6">
        <DateTime />
      </div>
      
      <main className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <div className="lg:col-span-2 order-1">
          <TeddySidebar 
            tasks={tasks}
            habits={habits}
            goals={goals}
            teddyCustomization={teddyCustomization}
            onCompleteHabit={completeHabit}
            onAddHabit={addHabit}
            onUpdateGoal={updateGoal}
            onAddGoal={addGoal}
          />
        </div>
        
        <div className="lg:col-span-5 order-2">
          <TaskSection 
            completedTasks={completedTasks}
            uncompletedTasks={uncompletedTasks}
            onAddTask={addTask}
            onCompleteTask={completeTask}
            onDeleteTask={deleteTask}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;

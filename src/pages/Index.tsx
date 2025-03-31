
import { useEffect } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useHabits } from '@/hooks/useHabits';
import { useGoals } from '@/hooks/useGoals';
import { useTeddyCustomization } from '@/hooks/useTeddyCustomization';

import MainLayout from '@/components/MainLayout';
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
    <MainLayout 
      teddyCustomization={teddyCustomization}
      setTeddyCustomization={setTeddyCustomization}
      accessories={accessories}
    >
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
    </MainLayout>
  );
};

export default Index;


import { useEffect } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useHabits } from '@/hooks/useHabits';
import { useGoals } from '@/hooks/useGoals';
import { useTeddyCustomization } from '@/hooks/useTeddyCustomization';
import { useDailyAdvice } from '@/hooks/useDailyAdvice';
import { useJournal } from '@/hooks/useJournal';
import { useReminders } from '@/hooks/useReminders';

import MainLayout from '@/components/MainLayout';
import TaskSection from '@/components/TaskSection';
import TeddySidebar from '@/components/TeddySidebar';
import GoalTree from '@/components/GoalTree';
import HabitTrackerWithReminder from '@/components/HabitTrackerWithReminder';

const Index = () => {
  const { tasks, completedTasks, uncompletedTasks, addTask, completeTask, deleteTask } = useTasks();
  const { habits, addHabit, completeHabit } = useHabits();
  const { goals, addGoal, updateGoal } = useGoals();
  const { teddyCustomization, setTeddyCustomization, accessories, unlockAccessory } = useTeddyCustomization();
  const { currentAdvice, savedAdvices, saveAdvice } = useDailyAdvice();
  const { entries: journalEntries, addEntry: addJournalEntry } = useJournal();
  const { reminders, completeReminder, deleteReminder, setTaskReminder, setHabitReminder } = useReminders();
  
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
      currentAdvice={currentAdvice}
      savedAdvices={savedAdvices}
      onSaveAdvice={saveAdvice}
      journalEntries={journalEntries}
      onAddJournalEntry={addJournalEntry}
      tasks={tasks}
      habits={habits}
      reminders={reminders}
      onCompleteReminder={completeReminder}
      onDeleteReminder={deleteReminder}
    >
      <div className="lg:col-span-3 order-1">
        <div className="space-y-6">
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
          
          <div className="glass rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Habits</h3>
            <HabitTrackerWithReminder 
              habits={habits}
              onCompleteHabit={completeHabit}
              onSetReminder={setHabitReminder}
            />
          </div>
          
          <GoalTree goals={goals} />
        </div>
      </div>
      
      <div className="lg:col-span-2 order-2">
        <TaskSection 
          completedTasks={completedTasks}
          uncompletedTasks={uncompletedTasks}
          onAddTask={addTask}
          onCompleteTask={completeTask}
          onDeleteTask={deleteTask}
          onSetReminder={setTaskReminder}
        />
      </div>
    </MainLayout>
  );
};

export default Index;

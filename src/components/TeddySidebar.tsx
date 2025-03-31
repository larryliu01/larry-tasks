
import { Task, Habit, TeddyCustomization, TeddyAccessory } from '@/types';
import TeddyCharacter from '@/components/TeddyCharacter';
import HabitTracker from '@/components/HabitTracker';
import GoalTracker from '@/components/GoalTracker';

type TeddySidebarProps = {
  tasks: Task[];
  habits: Habit[];
  goals: any[];
  teddyCustomization: TeddyCustomization;
  onCompleteHabit: (id: string) => void;
  onAddHabit: (newHabit: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'daysCompleted'>) => void;
  onUpdateGoal: (id: string, progress: number) => void;
  onAddGoal: (newGoal: any) => void;
};

const TeddySidebar = ({
  tasks,
  habits,
  goals,
  teddyCustomization,
  onCompleteHabit,
  onAddHabit,
  onUpdateGoal,
  onAddGoal
}: TeddySidebarProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="glass rounded-2xl p-6 w-full flex justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-lavender-light via-peach-light to-skyblue-light opacity-30"></div>
        <div className="stars absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: Math.random() * 0.7 + 0.3
              }}
            ></div>
          ))}
        </div>
        
        <div className="relative z-10">
          <TeddyCharacter 
            tasks={tasks}
            habits={habits}
            customization={teddyCustomization}
          />
        </div>
      </div>
      
      <div className="mt-6 w-full">
        <HabitTracker 
          habits={habits}
          onCompleteHabit={onCompleteHabit}
          onAddHabit={onAddHabit}
        />
      </div>
      
      <div className="mt-6 w-full">
        <GoalTracker 
          goals={goals}
          onUpdateGoal={onUpdateGoal}
          onAddGoal={onAddGoal}
        />
      </div>
    </div>
  );
};

export default TeddySidebar;

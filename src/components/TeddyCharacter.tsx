
import { useState, useEffect } from 'react';
import { Task, Habit, TeddyCustomization } from '@/types';
import { cn } from '@/lib/utils';

type TeddyCharacterProps = {
  tasks: Task[];
  habits: Habit[];
  customization: TeddyCustomization;
};

const TeddyCharacter = ({ tasks, habits, customization }: TeddyCharacterProps) => {
  const [emotion, setEmotion] = useState<'happy' | 'neutral' | 'excited'>('neutral');
  const [message, setMessage] = useState('');
  
  // Calculate progress statistics
  useEffect(() => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? completedTasks / totalTasks : 0;
    const streaks = habits.reduce((sum, habit) => sum + habit.streak, 0);
    
    // Set teddy's emotion based on progress
    if (completionRate > 0.7 || streaks > 5) {
      setEmotion('excited');
      setMessage("Wow! You're doing amazing!");
    } else if (completionRate > 0.3 || streaks > 2) {
      setEmotion('happy');
      setMessage("You're making great progress!");
    } else if (totalTasks === 0) {
      setEmotion('neutral');
      setMessage('Hi there! Add some tasks to get started!');
    } else {
      setEmotion('neutral');
      setMessage('Keep going, you can do it!');
    }
  }, [tasks, habits]);

  // Animation when emotion changes
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(timer);
  }, [emotion]);

  return (
    <div className="flex flex-col items-center">
      <div 
        className={cn(
          "relative w-40 h-40 bg-teddy rounded-full mb-2 shadow-lg flex items-center justify-center",
          { "animate-wiggle": animate },
          { "bg-teddy-dark": emotion === 'excited', "bg-teddy-light": emotion === 'neutral', "bg-teddy": emotion === 'happy' }
        )}
      >
        {/* Teddy face */}
        <div className="absolute w-32 h-32 bg-teddy-light rounded-full top-6 left-4"></div>
        
        {/* Eyes */}
        <div className="absolute w-3 h-3 bg-black rounded-full top-16 left-14"></div>
        <div className="absolute w-3 h-3 bg-black rounded-full top-16 right-14"></div>
        
        {/* Nose */}
        <div className="absolute w-5 h-3 bg-teddy-dark rounded-full top-20 left-[72px]"></div>
        
        {/* Mouth - changes with emotion */}
        {emotion === 'excited' && (
          <div className="absolute w-10 h-5 bg-teddy-dark rounded-full top-24 left-[60px] flex items-center justify-center">
            <div className="w-8 h-2 bg-white rounded-full"></div>
          </div>
        )}
        {emotion === 'happy' && (
          <div className="absolute w-8 h-3 border-b-2 border-teddy-dark rounded-full top-24 left-[64px]"></div>
        )}
        {emotion === 'neutral' && (
          <div className="absolute w-6 h-1 bg-teddy-dark rounded-full top-24 left-[68px]"></div>
        )}
        
        {/* Accessories based on customization */}
        {customization.accessories.includes('hat') && (
          <div className="absolute w-24 h-12 bg-lavender-dark rounded-full -top-6 left-8"></div>
        )}
        {customization.accessories.includes('scarf') && (
          <div className="absolute w-36 h-8 bg-skyblue-dark rounded-md top-32 left-2"></div>
        )}
        {customization.accessories.includes('glasses') && (
          <div className="absolute w-20 h-6 border-2 border-black rounded-full top-16 left-10"></div>
        )}
      </div>
      
      {/* Teddy's message bubble */}
      <div className="bg-white rounded-xl p-3 shadow-md max-w-[200px] text-center relative">
        <div className="absolute w-4 h-4 bg-white -top-2 left-1/2 transform -translate-x-1/2 rotate-45"></div>
        <p className="text-sm font-cute">{message}</p>
      </div>
    </div>
  );
};

export default TeddyCharacter;

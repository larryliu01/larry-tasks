
import { useState, useEffect } from 'react';
import { Task, Habit, TeddyCustomization } from '@/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
      <div className="cute-background w-full h-40 rounded-t-xl bg-gradient-to-b from-peach-light to-skyblue-light opacity-60"></div>
      
      <div className="relative -mt-20 flex flex-col items-center">
        {customization.profileImage ? (
          // Custom user image display
          <div className={cn(
              "relative flex flex-col items-center justify-center transition-all duration-300",
              { "animate-wiggle": animate }
            )}>
            <Avatar className="w-40 h-40 border-4 border-white shadow-lg">
              <AvatarImage 
                src={customization.profileImage} 
                alt={customization.name} 
                className="object-cover"
              />
              <AvatarFallback className="text-2xl font-bold">
                {customization.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            {/* Custom accessories for user image */}
            <div className="relative">
              {customization.accessories.includes('hat') && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-24 h-12 bg-lavender-dark rounded-t-full"></div>
              )}
              {customization.accessories.includes('glasses') && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-24 h-6 border-2 border-black rounded-full"></div>
              )}
              {customization.accessories.includes('scarf') && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-skyblue-dark rounded-md"></div>
              )}
            </div>
          </div>
        ) : (
          // Full body teddy character
          <div 
            className={cn(
              "relative w-36 h-60 flex flex-col items-center justify-center transition-all duration-300",
              { "animate-wiggle": animate }
            )}
          >
            {/* Head */}
            <div 
              className={cn(
                "w-40 h-40 rounded-full mb-2 shadow-lg flex items-center justify-center relative",
                { "bg-teddy-dark": emotion === 'excited', "bg-teddy-light": emotion === 'neutral', "bg-teddy": emotion === 'happy' }
              )}
              style={{backgroundColor: customization.color}}
            >
              {/* Face */}
              <div className="absolute w-32 h-32 bg-teddy-light rounded-full top-6 left-4"></div>
              
              {/* Eyes */}
              <div className={cn(
                "absolute w-3 h-3 bg-black rounded-full top-16 left-14 transition-all",
                emotion === 'excited' && "h-4 animate-bounce-small"
              )}></div>
              <div className={cn(
                "absolute w-3 h-3 bg-black rounded-full top-16 right-14 transition-all",
                emotion === 'excited' && "h-4 animate-bounce-small"
              )}></div>
              
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
              {customization.accessories.includes('glasses') && (
                <div className="absolute w-20 h-6 border-2 border-black rounded-full top-16 left-10"></div>
              )}
            </div>
            
            {/* Body */}
            <div 
              className="w-28 h-28 rounded-t-[50%] -mt-10"
              style={{backgroundColor: customization.color}}
            ></div>
            
            {/* Arms */}
            <div className="flex w-full justify-between -mt-20 z-10">
              <div 
                className={cn(
                  "w-8 h-20 rounded-full transform -rotate-12",
                  animate && "animate-wiggle"
                )}
                style={{backgroundColor: customization.color}}
              ></div>
              <div 
                className={cn(
                  "w-8 h-20 rounded-full transform rotate-12",
                  animate && "animate-wiggle"
                )}
                style={{backgroundColor: customization.color}}
              ></div>
            </div>
            
            {/* Legs */}
            <div className="flex justify-center gap-3 -mt-4">
              <div 
                className={cn("w-10 h-14 rounded-b-full")}
                style={{backgroundColor: customization.color}}
              ></div>
              <div 
                className={cn("w-10 h-14 rounded-b-full")}
                style={{backgroundColor: customization.color}}
              ></div>
            </div>
            
            {/* Scarf accessory */}
            {customization.accessories.includes('scarf') && (
              <div className="absolute w-36 h-8 bg-skyblue-dark rounded-md top-32 left-0"></div>
            )}
          </div>
        )}
        
        {/* Character's message bubble */}
        <div className="bg-white rounded-xl p-3 shadow-md max-w-[200px] text-center relative mt-4">
          <div className="absolute w-4 h-4 bg-white -top-2 left-1/2 transform -translate-x-1/2 rotate-45"></div>
          <p className="text-sm font-cute">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default TeddyCharacter;

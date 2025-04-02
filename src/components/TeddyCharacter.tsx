
import { useState, useEffect } from 'react';
import { Task, Habit, TeddyCustomization } from '@/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

type TeddyCharacterProps = {
  tasks: Task[];
  habits: Habit[];
  customization: TeddyCustomization;
};

const TeddyCharacter = ({ tasks, habits, customization }: TeddyCharacterProps) => {
  const [emotion, setEmotion] = useState<'happy' | 'neutral' | 'excited' | 'sad'>('neutral');
  const [message, setMessage] = useState('');
  const [isInteracting, setIsInteracting] = useState(false);
  
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
    } else if (completionRate < 0.1 && totalTasks > 3) {
      setEmotion('sad');
      setMessage('I believe in you! Let\'s tackle those tasks together.');
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

  // Interaction messages
  const interactionMessages = [
    "Hello! I'm here to help you stay organized!",
    "Let's achieve our goals together!",
    "Don't forget to take breaks too!",
    "You're doing great! I'm proud of you!",
    "Remember to stay hydrated!",
    "Every small step counts toward your goals!",
    "I believe in you!",
    "*happy squeaking noises*",
    "Yay! You're the best!",
    "Let's make today productive!",
    `I'm level ${customization.level} now! Thank you for helping me grow!`,
    "Complete more tasks to help me gain experience!",
    "Each habit completion gives me strength to level up!"
  ];

  const handleInteraction = () => {
    const randomMessage = interactionMessages[Math.floor(Math.random() * interactionMessages.length)];
    setMessage(randomMessage);
    setIsInteracting(true);
    setAnimate(true);
    
    // Reset after animation
    setTimeout(() => {
      setIsInteracting(false);
      setAnimate(false);
    }, 2000);
  };

  // Calculate exp percentage for progress bar
  const expPercentage = Math.min(
    100,
    Math.round((customization.experience / customization.nextLevelExperience) * 100)
  );

  return (
    <div className="flex flex-col items-center">
      <div className="cute-background w-full h-64 rounded-t-xl bg-gradient-to-b from-lavender-light to-skyblue-light opacity-60"></div>
      
      <div className="relative -mt-40 flex flex-col items-center">
        {customization.profileImage ? (
          // Custom user image display
          <div 
            className={cn(
              "relative flex flex-col items-center justify-center transition-all duration-300 cursor-pointer",
              { "animate-wiggle": animate }
            )}
            onClick={handleInteraction}
          >
            <Avatar className="w-48 h-48 border-4 border-white shadow-lg">
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
          // Anime-style teddy character
          <div 
            className={cn(
              "relative w-48 h-80 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer",
              { "animate-wiggle": animate, "animate-jump": isInteracting }
            )}
            onClick={handleInteraction}
          >
            {/* Level badge */}
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full border-2 border-white shadow-lg z-20 flex items-center justify-center">
              <span className="text-sm font-bold">{customization.level}</span>
            </div>
            
            {/* Head */}
            <div 
              className={cn(
                "w-44 h-44 rounded-full mb-2 shadow-lg flex items-center justify-center relative",
                { "bg-teddy-dark": emotion === 'excited', "bg-teddy-light": emotion === 'sad', "bg-teddy": emotion === 'happy' || emotion === 'neutral' }
              )}
              style={{backgroundColor: customization.color}}
            >
              {/* Face */}
              <div className="absolute w-32 h-32 bg-teddy-light rounded-full top-6 left-6"></div>
              
              {/* Blush marks for cuteness */}
              <div className="absolute w-6 h-3 bg-pink-300 rounded-full opacity-60 top-20 left-10"></div>
              <div className="absolute w-6 h-3 bg-pink-300 rounded-full opacity-60 top-20 right-10"></div>
              
              {/* Eyes - change with emotion */}
              {emotion === 'excited' && (
                <>
                  <div className="absolute w-5 h-5 bg-black rounded-full top-16 left-14 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1 right-1"></div>
                  </div>
                  <div className="absolute w-5 h-5 bg-black rounded-full top-16 right-14 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1 right-1"></div>
                  </div>
                </>
              )}
              
              {emotion === 'happy' && (
                <>
                  <div className="absolute w-5 h-4 bg-black rounded-full top-16 left-14 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1 right-1"></div>
                  </div>
                  <div className="absolute w-5 h-4 bg-black rounded-full top-16 right-14 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1 right-1"></div>
                  </div>
                </>
              )}
              
              {emotion === 'neutral' && (
                <>
                  <div className="absolute w-5 h-5 bg-black rounded-full top-16 left-14"></div>
                  <div className="absolute w-5 h-5 bg-black rounded-full top-16 right-14"></div>
                </>
              )}
              
              {emotion === 'sad' && (
                <>
                  <div className="absolute w-4 h-5 bg-black rounded-full transform rotate-45 top-16 left-14"></div>
                  <div className="absolute w-4 h-5 bg-black rounded-full transform -rotate-45 top-16 right-14"></div>
                </>
              )}
              
              {/* Nose */}
              <div className="absolute w-5 h-3 bg-teddy-dark rounded-full top-20 left-[72px]"></div>
              
              {/* Mouth - changes with emotion */}
              {emotion === 'excited' && (
                <div className="absolute w-10 h-5 bg-teddy-dark rounded-full top-24 left-[60px] flex items-center justify-center">
                  <div className="w-8 h-2 bg-pink-300 rounded-full"></div>
                </div>
              )}
              
              {emotion === 'happy' && (
                <div className="absolute w-8 h-3 border-b-2 border-teddy-dark rounded-full top-24 left-[64px]"></div>
              )}
              
              {emotion === 'neutral' && (
                <div className="absolute w-6 h-1 bg-teddy-dark rounded-full top-24 left-[68px]"></div>
              )}
              
              {emotion === 'sad' && (
                <div className="absolute w-8 h-3 border-t-2 border-teddy-dark rounded-full top-26 left-[64px]"></div>
              )}
              
              {/* Accessories based on customization */}
              {customization.accessories.includes('hat') && (
                <div className="absolute w-32 h-16 bg-lavender-dark rounded-full -top-8 left-6 z-10 flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
              )}
              
              {customization.accessories.includes('glasses') && (
                <div className="absolute w-28 h-8 top-16 left-8 z-20">
                  <div className="w-10 h-10 border-2 border-black rounded-full absolute left-0"></div>
                  <div className="w-10 h-10 border-2 border-black rounded-full absolute right-0"></div>
                  <div className="w-6 h-1 bg-black absolute top-5 left-10"></div>
                  <div className="w-6 h-1 bg-black absolute top-1 left-2 transform -rotate-45"></div>
                  <div className="w-6 h-1 bg-black absolute top-1 right-2 transform rotate-45"></div>
                </div>
              )}
            </div>
            
            {/* Body */}
            <div 
              className="w-40 h-40 rounded-t-[50%] -mt-12"
              style={{backgroundColor: customization.color}}
            ></div>
            
            {/* Arms */}
            <div className="flex w-full justify-between -mt-28 z-10">
              <div 
                className={cn(
                  "w-10 h-24 rounded-full transform -rotate-12",
                  animate && "animate-wiggle"
                )}
                style={{backgroundColor: customization.color}}
              ></div>
              <div 
                className={cn(
                  "w-10 h-24 rounded-full transform rotate-12",
                  animate && "animate-wiggle"
                )}
                style={{backgroundColor: customization.color}}
              ></div>
            </div>
            
            {/* Legs */}
            <div className="flex justify-center gap-4 -mt-8">
              <div 
                className={cn("w-12 h-16 rounded-b-full")}
                style={{backgroundColor: customization.color}}
              ></div>
              <div 
                className={cn("w-12 h-16 rounded-b-full")}
                style={{backgroundColor: customization.color}}
              ></div>
            </div>
            
            {/* Scarf accessory */}
            {customization.accessories.includes('scarf') && (
              <div className="absolute w-40 h-12 bg-skyblue-dark rounded-md top-36 left-4 z-20 flex items-center justify-center">
                <div className="w-32 h-6 bg-skyblue-light rounded-md absolute"></div>
              </div>
            )}
          </div>
        )}
        
        {/* Character's message bubble */}
        <div className="bg-white rounded-xl p-4 shadow-md max-w-[240px] text-center relative mt-4 min-h-[70px] glass">
          <div className="absolute w-4 h-4 bg-white -top-2 left-1/2 transform -translate-x-1/2 rotate-45"></div>
          <p className="text-sm font-cute">{message}</p>
        </div>
        
        {/* Experience bar */}
        <div className="mt-4 w-full max-w-[240px]">
          <div className="flex justify-between text-xs mb-1">
            <span>Level {customization.level}</span>
            <span>{customization.experience}/{customization.nextLevelExperience} XP</span>
          </div>
          <Progress value={expPercentage} className="h-2" />
        </div>
      </div>
    </div>
  );
};

export default TeddyCharacter;

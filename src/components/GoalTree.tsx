
import { Goal } from '@/types';
import { useState, useEffect } from 'react';
import AnimatedProgress from '@/components/AnimatedProgress';

type GoalTreeProps = {
  goals: Goal[];
};

const GoalTree = ({ goals }: GoalTreeProps) => {
  const [totalProgress, setTotalProgress] = useState(0);
  
  useEffect(() => {
    if (goals.length === 0) {
      setTotalProgress(0);
      return;
    }
    
    const completedValues = goals.reduce((sum, goal) => {
      const percentComplete = goal.progress / goal.target;
      return sum + percentComplete;
    }, 0);
    
    const averageProgress = (completedValues / goals.length) * 100;
    setTotalProgress(averageProgress);
  }, [goals]);
  
  const getTreeStage = () => {
    if (totalProgress < 20) return 1; // Seedling
    if (totalProgress < 40) return 2; // Small tree
    if (totalProgress < 60) return 3; // Medium tree
    if (totalProgress < 80) return 4; // Large tree
    return 5; // Fully grown tree with flowers/fruits
  };
  
  const renderTree = () => {
    const stage = getTreeStage();
    
    return (
      <div className="w-full h-80 flex flex-col items-center justify-end relative">
        {/* Ground */}
        <div className="absolute bottom-0 w-full h-10 bg-green-200 rounded-b-lg"></div>
        
        {/* Tree trunk */}
        <div 
          className={`bg-amber-800 rounded-md w-6 transition-all duration-1000 ease-in-out ${
            stage === 1 ? 'h-10' : 
            stage === 2 ? 'h-20' : 
            stage === 3 ? 'h-32' : 
            stage === 4 ? 'h-40' : 
            'h-44'
          }`}
        ></div>
        
        {/* Tree foliage */}
        <div 
          className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 transition-all duration-1000 ${
            stage === 1 ? 'w-12 h-12 -mb-2' : 
            stage === 2 ? 'w-24 h-24 -mb-4' : 
            stage === 3 ? 'w-40 h-40 -mb-6' : 
            stage === 4 ? 'w-48 h-48 -mb-8' : 
            'w-56 h-56 -mb-10'
          }`}
        >
          <div 
            className={`absolute inset-0 bg-green-400 rounded-full transform transition-all duration-700 ${
              stage === 1 ? 'scale-75' : 
              stage === 2 ? 'scale-90' : 
              'scale-100'
            } opacity-80`}
          ></div>
          <div 
            className={`absolute inset-0 bg-green-500 rounded-full transform scale-75 transition-opacity duration-700 ${
              stage < 2 ? 'opacity-0' : 'opacity-90'
            }`}
          ></div>
          <div 
            className={`absolute inset-0 bg-green-600 rounded-full transform scale-50 transition-opacity duration-700 ${
              stage < 3 ? 'opacity-0' : 'opacity-90'
            }`}
          ></div>
          
          {/* Flowers and fruits */}
          {stage >= 4 && (
            <div className="absolute inset-0">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i}
                  className={`absolute w-4 h-4 rounded-full bg-pink-400 animate-pulse ${
                    stage >= 5 ? 'opacity-100' : 'opacity-60'
                  }`}
                  style={{
                    top: `${Math.random() * 70 + 10}%`,
                    left: `${Math.random() * 70 + 10}%`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                ></div>
              ))}
            </div>
          )}
          
          {stage >= 5 && (
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-6 h-6 rounded-full bg-yellow-400 animate-bounce"
                  style={{
                    top: `${Math.random() * 70 + 15}%`,
                    left: `${Math.random() * 70 + 15}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${1 + Math.random() * 2}s`,
                  }}
                ></div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="glass p-4 rounded-lg">
      <h3 className="text-lg font-bold font-cute mb-2 text-center">Goal Progress Tree</h3>
      
      {renderTree()}
      
      <div className="mt-4">
        <AnimatedProgress 
          value={totalProgress} 
          color={
            totalProgress < 30 ? 'danger' : 
            totalProgress < 70 ? 'warning' : 
            'success'
          }
        />
        <p className="text-center text-sm mt-2">
          {totalProgress < 20 ? 'Just starting out!' : 
           totalProgress < 40 ? 'Growing steadily!' : 
           totalProgress < 60 ? 'Making good progress!' : 
           totalProgress < 80 ? 'Almost there!' : 
           'Goals flourishing!'}
        </p>
      </div>
    </div>
  );
};

export default GoalTree;

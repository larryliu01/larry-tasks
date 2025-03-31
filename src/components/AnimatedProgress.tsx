
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type AnimatedProgressProps = {
  value: number;
  className?: string;
  showPercentage?: boolean;
  color?: 'default' | 'success' | 'warning' | 'danger';
};

const AnimatedProgress = ({ 
  value, 
  className, 
  showPercentage = true, 
  color = 'default' 
}: AnimatedProgressProps) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(value);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [value]);
  
  // Get appropriate color based on progress
  const getColorClass = () => {
    if (color !== 'default') {
      return color === 'success' ? 'bg-green-500' : 
             color === 'warning' ? 'bg-yellow-500' : 
             'bg-red-500';
    }
    
    return '';
  };
  
  return (
    <div className="relative">
      <Progress 
        value={progress} 
        className={cn("h-3 transition-all duration-700", className)}
        indicatorClassName={getColorClass()}
      />
      {showPercentage && (
        <div className="absolute top-0 right-0 -mt-6 text-xs font-medium animate-pulse">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

export default AnimatedProgress;

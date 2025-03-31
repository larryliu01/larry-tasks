
import { useState } from 'react';
import { Task } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Flag, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type TaskCardProps = {
  task: Task;
  onComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
};

const TaskCard = ({ task, onComplete, onDelete }: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-amber-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div 
      className={cn(
        "glass p-4 rounded-lg transition-all duration-300 hover:shadow-lg relative",
        { "opacity-70": task.completed }
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-2">
        <Checkbox 
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={(checked) => onComplete(task.id, checked as boolean)}
          className="mt-1"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <label 
              htmlFor={`task-${task.id}`}
              className={cn(
                "text-lg font-medium cursor-pointer",
                { "line-through opacity-70": task.completed }
              )}
            >
              {task.title}
            </label>
            <Flag className={cn("h-4 w-4", getPriorityColor(task.priority))} />
          </div>
          
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
          )}
          
          <div className="mt-3 flex flex-wrap gap-2 items-center text-xs text-muted-foreground">
            <span className="bg-accent px-2 py-1 rounded-full">{task.category}</span>
            
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(task.dueDate), 'MMM d')}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{format(new Date(task.createdAt), 'MMM d')}</span>
            </div>
          </div>
        </div>
      </div>
      
      {isHovered && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 h-6 w-6 opacity-70 hover:opacity-100"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default TaskCard;

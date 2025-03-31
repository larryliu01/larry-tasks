
import { useState } from 'react';
import { Goal } from '@/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Target, PlusCircle, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type GoalTrackerProps = {
  goals: Goal[];
  onUpdateGoal: (id: string, progress: number) => void;
  onAddGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
};

const GoalTracker = ({ goals, onUpdateGoal, onAddGoal }: GoalTrackerProps) => {
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState<Omit<Goal, 'id' | 'createdAt'>>({
    title: '',
    description: '',
    progress: 0,
    target: 100,
    category: 'Personal',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddGoal(newGoal);
    setNewGoal({
      title: '',
      description: '',
      progress: 0,
      target: 100,
      category: 'Personal',
    });
    setShowForm(false);
  };

  const categories = ['Personal', 'Work', 'Health', 'Learning', 'Financial'];

  return (
    <div className="glass p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <Target className="mr-2 text-lavender-dark" />
          Annual Goals
        </h2>
        <Button
          size="sm"
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? "secondary" : "default"}
        >
          {showForm ? 'Cancel' : 'Add Goal'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-3 bg-white/50 rounded-lg">
          <div className="grid gap-3">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Goal Name
              </label>
              <input
                id="title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description (Optional)
              </label>
              <input
                id="description"
                value={newGoal.description}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">
                Category
              </label>
              <select
                id="category"
                value={newGoal.category}
                onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                className="w-full p-2 border rounded"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="target" className="block text-sm font-medium mb-1">
                Target Value
              </label>
              <input
                id="target"
                type="number"
                value={newGoal.target}
                onChange={(e) => setNewGoal({...newGoal, target: Number(e.target.value)})}
                className="w-full p-2 border rounded"
                min="1"
                required
              />
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                Due Date (Optional)
              </label>
              <input
                id="dueDate"
                type="date"
                onChange={(e) => setNewGoal({...newGoal, dueDate: e.target.value ? new Date(e.target.value) : undefined})}
                className="w-full p-2 border rounded"
              />
            </div>
            <Button type="submit">Add Goal</Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {goals.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Target className="mx-auto h-8 w-8 mb-2" />
            <p>No goals yet. Add an annual goal to track your progress!</p>
          </div>
        ) : (
          goals.map((goal) => (
            <div key={goal.id} className="bg-white/60 p-3 rounded-lg">
              <div className="mb-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{goal.title}</h3>
                  <span className="text-xs bg-accent px-2 py-1 rounded-full">
                    {goal.category}
                  </span>
                </div>
                {goal.description && (
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                )}
                {goal.dueDate && (
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Due {format(new Date(goal.dueDate), 'MMM d, yyyy')}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>
                    {goal.progress} of {goal.target} ({Math.round((goal.progress / goal.target) * 100)}%)
                  </span>
                </div>
                <Progress 
                  value={(goal.progress / goal.target) * 100}
                  className="h-2 mb-2"
                />
                <div className="pt-2">
                  <Slider
                    value={[goal.progress]}
                    max={goal.target}
                    step={1}
                    onValueChange={(value) => onUpdateGoal(goal.id, value[0])}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GoalTracker;


import { useState } from 'react';
import { Habit } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { format, isToday, isThisWeek, addDays } from 'date-fns';
import { CheckCircle, Calendar, Flame, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import AnimatedProgress from './AnimatedProgress';

type HabitTrackerProps = {
  habits: Habit[];
  onCompleteHabit: (id: string) => void;
  onAddHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'daysCompleted'>) => void;
};

const HabitTracker = ({ habits, onCompleteHabit, onAddHabit }: HabitTrackerProps) => {
  const [showForm, setShowForm] = useState(false);
  const [newHabit, setNewHabit] = useState({
    title: '',
    description: '',
    frequency: 'daily' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddHabit(newHabit);
    setNewHabit({ title: '', description: '', frequency: 'daily' });
    setShowForm(false);
  };

  const canCompleteToday = (habit: Habit) => {
    if (!habit.lastCompleted) return true;
    return !isToday(new Date(habit.lastCompleted));
  };

  return (
    <div className="glass p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <Flame className="mr-2 text-orange-500" />
          Habit Streaks
        </h2>
        <Button 
          size="sm" 
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? "secondary" : "default"}
        >
          {showForm ? 'Cancel' : 'Add Habit'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-3 bg-white/50 rounded-lg">
          <div className="grid gap-3">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Habit Name
              </label>
              <input
                id="title"
                value={newHabit.title}
                onChange={(e) => setNewHabit({...newHabit, title: e.target.value})}
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
                value={newHabit.description}
                onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Frequency</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="daily"
                    checked={newHabit.frequency === 'daily'}
                    onChange={() => setNewHabit({...newHabit, frequency: 'daily'})}
                  />
                  <span>Daily</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="weekly"
                    checked={newHabit.frequency === 'weekly'}
                    onChange={() => setNewHabit({...newHabit, frequency: 'weekly' as 'daily'})}
                  />
                  <span>Weekly</span>
                </label>
              </div>
            </div>
            <Button type="submit">Add Habit</Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {habits.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Info className="mx-auto h-8 w-8 mb-2" />
            <p>No habits yet. Add a habit to start building streaks!</p>
          </div>
        ) : (
          habits.map((habit) => (
            <div key={habit.id} className="bg-white/60 p-3 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{habit.title}</h3>
                  {habit.description && (
                    <p className="text-sm text-muted-foreground">{habit.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center text-amber-600">
                      <Flame className="h-4 w-4 mr-1" />
                      <span className="font-bold">{habit.streak}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {habit.frequency === 'daily' ? 'Daily' : 'Weekly'}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className={cn(
                    "flex items-center gap-1",
                    !canCompleteToday(habit) && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => canCompleteToday(habit) && onCompleteHabit(habit.id)}
                  disabled={!canCompleteToday(habit)}
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>
                    {!canCompleteToday(habit)
                      ? 'Done Today'
                      : habit.frequency === 'daily'
                      ? 'Complete Today'
                      : 'Complete This Week'}
                  </span>
                </Button>
              </div>
              
              {/* For weekly habits, show day progress */}
              {habit.frequency === 'weekly' && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Weekly Progress</span>
                    <span>
                      {habit.daysCompleted.filter(d => isThisWeek(new Date(d))).length}/7 days
                    </span>
                  </div>
                  <AnimatedProgress
                    value={(habit.daysCompleted.filter(d => isThisWeek(new Date(d))).length / 7) * 100}
                    className="h-2"
                    color={habit.streak > 2 ? 'success' : 'default'}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HabitTracker;


import React, { useState } from 'react';
import { Habit } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Plus, Info } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type HabitTrackerProps = {
  habits: Habit[];
  onCompleteHabit: (id: string) => void;
  onAddHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'daysCompleted'>) => void;
};

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, onCompleteHabit, onAddHabit }) => {
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');
  const [newHabitFrequency, setNewHabitFrequency] = useState<'daily' | 'weekly'>('daily');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newHabitTitle.trim()) {
      onAddHabit({
        title: newHabitTitle,
        description: newHabitDescription,
        frequency: newHabitFrequency
      });
      
      // Reset form
      setNewHabitTitle('');
      setNewHabitDescription('');
      setNewHabitFrequency('daily');
      setIsAddingHabit(false);
    }
  };

  const isHabitCompletedToday = (habit: Habit) => {
    if (!habit.lastCompleted) return false;
    
    const today = new Date();
    const lastCompleted = new Date(habit.lastCompleted);
    
    return today.toDateString() === lastCompleted.toDateString();
  };
  
  const isHabitCompletedThisWeek = (habit: Habit) => {
    if (!habit.lastCompleted) return false;
    
    const today = new Date();
    const lastCompleted = new Date(habit.lastCompleted);
    
    // Get start of current week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    return lastCompleted >= startOfWeek;
  };

  const canCompleteHabit = (habit: Habit) => {
    if (habit.frequency === 'daily') {
      return !isHabitCompletedToday(habit);
    } else if (habit.frequency === 'weekly') {
      return !isHabitCompletedThisWeek(habit);
    }
    return true;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Habits</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsAddingHabit(!isAddingHabit)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Habit
        </Button>
      </CardHeader>
      
      <CardContent className="pb-2">
        <Collapsible open={isAddingHabit} onOpenChange={setIsAddingHabit}>
          <CollapsibleContent>
            <form onSubmit={handleSubmit} className="space-y-3 mb-4">
              <div>
                <Label htmlFor="habitTitle">Habit Title</Label>
                <Input 
                  id="habitTitle" 
                  value={newHabitTitle} 
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                  placeholder="New habit..."
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="habitDescription">Description (optional)</Label>
                <Input 
                  id="habitDescription" 
                  value={newHabitDescription} 
                  onChange={(e) => setNewHabitDescription(e.target.value)}
                  placeholder="Description..."
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="habitFrequency">Frequency</Label>
                <Select 
                  value={newHabitFrequency} 
                  onValueChange={(value) => setNewHabitFrequency(value as 'daily' | 'weekly')}
                >
                  <SelectTrigger id="habitFrequency" className="mt-1">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddingHabit(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Habit</Button>
              </div>
            </form>
          </CollapsibleContent>
        </Collapsible>
        
        {habits.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No habits yet. Add one to start building consistency!
          </p>
        ) : (
          <div className="space-y-2">
            {habits.map((habit) => (
              <div 
                key={habit.id} 
                className={`flex items-center justify-between p-3 rounded-md border ${
                  habit.frequency === 'daily' 
                    ? isHabitCompletedToday(habit) ? 'bg-green-50 border-green-200' : 'bg-card' 
                    : isHabitCompletedThisWeek(habit) ? 'bg-green-50 border-green-200' : 'bg-card'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-medium">{habit.title}</h3>
                    {habit.description && (
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 ml-1">
                            <Info className="h-4 w-4" />
                            <span className="sr-only">Info</span>
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p>{habit.description}</p>
                        </HoverCardContent>
                      </HoverCard>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1 space-x-2">
                    <Badge variant="outline">
                      {habit.frequency === 'daily' ? 'Daily' : 'Weekly'}
                    </Badge>
                    <span className="flex items-center">
                      <span className="font-semibold">{habit.streak}</span>
                      <span className="ml-1">🔥</span>
                    </span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant={canCompleteHabit(habit) ? "default" : "outline"}
                  disabled={!canCompleteHabit(habit)}
                  onClick={() => onCompleteHabit(habit.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {canCompleteHabit(habit) ? 'Complete' : 'Done'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HabitTracker;

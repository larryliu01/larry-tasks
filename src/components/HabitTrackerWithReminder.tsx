
import { Habit } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, MoreHorizontal, X } from 'lucide-react';
import HabitReminderDialog from '@/components/HabitReminderDialog';

type HabitTrackerWithReminderProps = {
  habits: Habit[];
  onCompleteHabit: (id: string) => void;
  onSetReminder?: (habit: Habit, reminderTime: Date) => void;
};

const HabitTrackerWithReminder = ({ habits, onCompleteHabit, onSetReminder }: HabitTrackerWithReminderProps) => {
  if (habits.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-muted-foreground">No habits found</p>
        <p className="text-xs text-muted-foreground">Add habits to start tracking your progress</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {habits.map((habit) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const lastCompleted = habit.lastCompleted
          ? new Date(habit.lastCompleted)
          : null;
          
        const isCompletedToday = lastCompleted
          ? new Date(lastCompleted).setHours(0, 0, 0, 0) === today.getTime()
          : false;
          
        return (
          <Card key={habit.id} className="relative overflow-hidden">
            {habit.streak > 0 && (
              <div className="absolute top-0 right-0 bg-lavender-light text-primary-foreground px-2 py-1 text-xs font-medium rounded-bl-md">
                {habit.streak} day streak
              </div>
            )}
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">{habit.title}</CardTitle>
              <CardDescription>
                {habit.description || `${habit.frequency === 'daily' ? 'Daily' : 'Weekly'} habit`}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {isCompletedToday ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Completed today
                    </span>
                  ) : (
                    <span>
                      {habit.frequency === 'daily' ? 'Complete daily' : 'Complete this week'}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              {onSetReminder && (
                <HabitReminderDialog
                  habit={habit}
                  onSetReminder={onSetReminder}
                />
              )}
              <Button
                variant={isCompletedToday ? "outline" : "default"}
                size="sm"
                onClick={() => onCompleteHabit(habit.id)}
                disabled={isCompletedToday}
                className="ml-auto"
              >
                {isCompletedToday ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>Done</span>
                  </>
                ) : (
                  <span>Complete</span>
                )}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default HabitTrackerWithReminder;

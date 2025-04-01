
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Task, Habit, Reminder } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

type ScheduleCalendarProps = {
  tasks: Task[];
  habits: Habit[];
  reminders: Reminder[];
  timezone: string;
};

const ScheduleCalendar = ({ tasks, habits, reminders, timezone }: ScheduleCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Filter tasks, habits, and reminders for the selected date
  const getItemsForSelectedDate = () => {
    if (!selectedDate) return { tasks: [], habits: [], reminders: [] };
    
    const selectedDay = new Date(selectedDate);
    selectedDay.setHours(0, 0, 0, 0);
    
    const filteredTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === selectedDay.getTime();
    });
    
    const filteredHabits = habits.filter(habit => {
      // For daily habits, show all
      if (habit.frequency === 'daily') return true;
      
      // For weekly habits, show on same day of week
      if (habit.frequency === 'weekly') {
        return selectedDay.getDay() === new Date().getDay();
      }
      
      return false;
    });
    
    const filteredReminders = reminders.filter(reminder => {
      if (reminder.completed) return false;
      const reminderDate = new Date(reminder.time);
      reminderDate.setHours(0, 0, 0, 0);
      return reminderDate.getTime() === selectedDay.getTime();
    });
    
    return {
      tasks: filteredTasks,
      habits: filteredHabits,
      reminders: filteredReminders
    };
  };
  
  const { tasks: dayTasks, habits: dayHabits, reminders: dayReminders } = getItemsForSelectedDate();
  
  // Highlight dates with tasks or reminders
  const getDayHighlight = (date: Date) => {
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);
    
    // Check for tasks
    const hasTask = tasks.some(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === day.getTime();
    });
    
    // Check for reminders
    const hasReminder = reminders.some(reminder => {
      if (reminder.completed) return false;
      const reminderDate = new Date(reminder.time);
      reminderDate.setHours(0, 0, 0, 0);
      return reminderDate.getTime() === day.getTime();
    });
    
    if (hasTask || hasReminder) {
      return "bg-primary/20 text-primary font-bold";
    }
    
    return "";
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-cute">Schedule Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiersClassNames={{
                selected: "bg-primary text-primary-foreground",
              }}
              modifiers={{
                highlight: (date) => getDayHighlight(date) !== "",
              }}
              modifiersStyles={{
                highlight: { fontWeight: "bold" }
              }}
            />
          </div>
          
          <div className="md:w-1/2">
            {selectedDate && (
              <div className="space-y-4">
                <h3 className="font-medium">
                  {formatInTimeZone(selectedDate, timezone, 'EEEE, MMMM d, yyyy')}
                </h3>
                
                {dayTasks.length === 0 && dayHabits.length === 0 && dayReminders.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">No activities scheduled for this day</p>
                  </div>
                ) : (
                  <>
                    {dayTasks.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Tasks</h4>
                        <ul className="space-y-1">
                          {dayTasks.map(task => (
                            <li key={task.id} className="text-sm flex items-center gap-2">
                              <CheckCircle2 className={`h-4 w-4 ${task.completed ? 'text-green-500' : 'text-muted-foreground'}`} />
                              <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                                {task.title}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {dayHabits.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Habits</h4>
                        <ul className="space-y-1">
                          {dayHabits.map(habit => (
                            <li key={habit.id} className="text-sm flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                              <span>{habit.title}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {dayReminders.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Reminders</h4>
                        <ul className="space-y-1">
                          {dayReminders.map(reminder => (
                            <li key={reminder.id} className="text-sm flex items-center gap-2">
                              <Clock className="h-4 w-4 text-primary" />
                              <span>
                                {reminder.title} - {formatInTimeZone(new Date(reminder.time), timezone, 'h:mm a')}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleCalendar;


import { useState } from 'react';
import { Reminder } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

type RemindersListProps = {
  reminders: Reminder[];
  timezone: string;
  onCompleteReminder: (id: string) => void;
  onDeleteReminder: (id: string) => void;
};

const RemindersList = ({ 
  reminders, 
  timezone,
  onCompleteReminder, 
  onDeleteReminder 
}: RemindersListProps) => {
  const activeReminders = reminders.filter(r => !r.completed);
  
  if (activeReminders.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-cute">Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No active reminders</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-cute">Reminders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {activeReminders.map((reminder) => (
            <div 
              key={reminder.id} 
              className="flex items-center justify-between p-2 rounded-md bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">{reminder.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatInTimeZone(
                      new Date(reminder.time),
                      timezone,
                      'h:mm a, MMM d'
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onCompleteReminder(reminder.id)}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => onDeleteReminder(reminder.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RemindersList;

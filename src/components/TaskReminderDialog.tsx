
import { useState } from 'react';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Clock, BellRing } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

type TaskReminderDialogProps = {
  task: Task;
  onSetReminder: (task: Task, reminderTime: Date) => void;
};

const TaskReminderDialog = ({ task, onSetReminder }: TaskReminderDialogProps) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [hour, setHour] = useState<string>("12");
  const [minute, setMinute] = useState<string>("00");
  const [period, setPeriod] = useState<string>("PM");
  
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  
  const handleSetReminder = () => {
    if (!date) {
      toast({
        title: "Please select a date",
        description: "You need to select a date for your reminder",
        variant: "destructive",
      });
      return;
    }
    
    const reminderDate = new Date(date);
    let hourValue = parseInt(hour);
    
    // Convert to 24 hour format
    if (period === "PM" && hourValue < 12) {
      hourValue += 12;
    } else if (period === "AM" && hourValue === 12) {
      hourValue = 0;
    }
    
    reminderDate.setHours(hourValue, parseInt(minute), 0, 0);
    
    // Check if reminder time is in the past
    if (reminderDate <= new Date()) {
      toast({
        title: "Invalid reminder time",
        description: "Reminder time cannot be in the past",
        variant: "destructive",
      });
      return;
    }
    
    onSetReminder(task, reminderDate);
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <BellRing className="h-4 w-4" />
          <span>Reminder</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="end">
        <div className="space-y-4">
          <h4 className="font-medium">Set Reminder</h4>
          <div className="border rounded-md">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md"
              initialFocus
            />
          </div>
          
          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-1">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span className="text-sm">Time</span>
              </div>
              <div className="flex gap-1">
                <Select value={hour} onValueChange={setHour}>
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((h) => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <span className="flex items-center">:</span>
                
                <Select value={minute} onValueChange={setMinute}>
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent>
                    {minutes.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {date && (
            <div className="pt-2 text-sm text-muted-foreground">
              {date && (
                <p>
                  Reminder set for{" "}
                  <strong>
                    {format(date, "MMMM do")} at {hour}:{minute} {period}
                  </strong>
                </p>
              )}
            </div>
          )}
          
          <Button 
            onClick={handleSetReminder} 
            className="w-full"
            disabled={!date}
          >
            Set Reminder
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TaskReminderDialog;

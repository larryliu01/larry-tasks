
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';

type DateTimeProps = {
  timezone: string;
};

const DateTime = ({ timezone }: DateTimeProps) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  
  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="glass p-4 rounded-lg flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3">
      <div className="flex items-center">
        <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
        <span className="font-cute text-lg">
          {formatInTimeZone(currentDateTime, timezone, 'EEEE, MMMM d, yyyy')}
        </span>
      </div>
      <div className="flex items-center">
        <Clock className="mr-2 h-5 w-5 text-primary" />
        <span className="font-cute text-lg">
          {formatInTimeZone(currentDateTime, timezone, 'h:mm:ss a')}
        </span>
      </div>
    </div>
  );
};

export default DateTime;

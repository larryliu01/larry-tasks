
import React, { useState } from 'react';
import WeatherBackground from '@/components/WeatherBackground';
import TeddySettings from '@/components/TeddySettings';
import { TeddyCustomization, TeddyAccessory, DailyAdvice as DailyAdviceType, Reminder } from '@/types';
import DateTime from '@/components/DateTime';
import DailyAdvice from '@/components/DailyAdvice';
import Journal from '@/components/Journal';
import RemindersList from '@/components/RemindersList';
import ScheduleCalendar from '@/components/ScheduleCalendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Calendar, BookOpen, Bell } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  teddyCustomization: TeddyCustomization;
  setTeddyCustomization: (customization: TeddyCustomization) => void;
  accessories: TeddyAccessory[];
  currentAdvice: DailyAdviceType;
  savedAdvices: DailyAdviceType[];
  onSaveAdvice: (advice: DailyAdviceType) => void;
  journalEntries: any[];
  onAddJournalEntry: (entry: any) => void;
  tasks: any[];
  habits: any[];
  reminders: Reminder[];
  onCompleteReminder: (id: string) => void;
  onDeleteReminder: (id: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  teddyCustomization,
  setTeddyCustomization,
  accessories,
  currentAdvice,
  savedAdvices,
  onSaveAdvice,
  journalEntries,
  onAddJournalEntry,
  tasks,
  habits,
  reminders,
  onCompleteReminder,
  onDeleteReminder
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen py-6 px-4 md:px-8 max-w-7xl mx-auto">
      <WeatherBackground timezone={teddyCustomization.location.timezone} />
      
      <header className="mb-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <h1 className="text-3xl font-bold font-cute">Teddy Tasks</h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Hidden settings button */}
          <div className="relative">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="bg-transparent border-none p-0 m-0 cursor-pointer"
              aria-label="Settings"
            >
              <Settings className="h-6 w-6 text-primary opacity-0" />
            </button>
            
            {showSettings && (
              <div className="absolute top-0 right-0 z-50">
                <TeddySettings 
                  customization={teddyCustomization}
                  onUpdateCustomization={setTeddyCustomization}
                  accessories={accessories}
                />
              </div>
            )}
          </div>
        </div>
      </header>
      
      <div className="mb-6">
        <DateTime timezone={teddyCustomization.location.timezone} />
      </div>
      
      <div className="mb-6">
        <DailyAdvice 
          currentAdvice={currentAdvice}
          savedAdvices={savedAdvices}
          onSaveAdvice={onSaveAdvice}
        />
      </div>
      
      <main className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {children}
        
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="reminders">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="reminders" className="flex items-center gap-1">
                <Bell className="h-4 w-4" />
                <span>Reminders</span>
              </TabsTrigger>
              <TabsTrigger value="journal" className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>Journal</span>
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Calendar</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="reminders" className="mt-4">
              <RemindersList 
                reminders={reminders}
                timezone={teddyCustomization.location.timezone}
                onCompleteReminder={onCompleteReminder}
                onDeleteReminder={onDeleteReminder}
              />
            </TabsContent>
            
            <TabsContent value="journal" className="mt-4">
              <Journal 
                entries={journalEntries}
                onAddEntry={onAddJournalEntry}
              />
            </TabsContent>
            
            <TabsContent value="calendar" className="mt-4">
              <ScheduleCalendar 
                tasks={tasks}
                habits={habits}
                reminders={reminders}
                timezone={teddyCustomization.location.timezone}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;

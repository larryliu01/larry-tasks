
import React from 'react';
import WeatherBackground from '@/components/WeatherBackground';
import TeddySettings from '@/components/TeddySettings';
import { TeddyCustomization, TeddyAccessory } from '@/types';
import DateTime from '@/components/DateTime';

interface MainLayoutProps {
  children: React.ReactNode;
  teddyCustomization: TeddyCustomization;
  setTeddyCustomization: (customization: TeddyCustomization) => void;
  accessories: TeddyAccessory[];
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  teddyCustomization,
  setTeddyCustomization,
  accessories
}) => {
  return (
    <div className="min-h-screen py-6 px-4 md:px-8 max-w-7xl mx-auto">
      <WeatherBackground timezone={teddyCustomization.location.timezone} />
      
      <header className="mb-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <h1 className="text-3xl font-bold font-cute">Teddy Tasks</h1>
        </div>
        <div className="flex items-center gap-4">
          <TeddySettings 
            customization={teddyCustomization}
            onUpdateCustomization={setTeddyCustomization}
            accessories={accessories}
          />
        </div>
      </header>
      
      <div className="mb-6">
        <DateTime timezone={teddyCustomization.location.timezone} />
      </div>
      
      <main className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;


import { useEffect, useState } from 'react';
import { WeatherType } from '@/types';
import { Cloud, CloudRain, Moon, Sun, Sunset } from 'lucide-react';

const WeatherBackground = () => {
  const [weatherType, setWeatherType] = useState<WeatherType>('day');

  useEffect(() => {
    // Get current time to determine if it's day or night
    const getCurrentWeather = () => {
      const hour = new Date().getHours();
      
      // Simple time-based weather for now
      if (hour >= 5 && hour < 8) {
        setWeatherType('sunset'); // sunrise
      } else if (hour >= 8 && hour < 18) {
        setWeatherType('day');
      } else if (hour >= 18 && hour < 20) {
        setWeatherType('sunset');
      } else {
        setWeatherType('night');
      }
      
      // Randomly change to cloudy or rainy sometimes
      const randomWeather = Math.random();
      if (randomWeather > 0.8) {
        setWeatherType('cloudy');
      } else if (randomWeather > 0.7) {
        setWeatherType('rainy');
      }
    };

    getCurrentWeather();
    
    // Update weather every 15 minutes
    const interval = setInterval(getCurrentWeather, 15 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const renderWeatherIcon = () => {
    switch (weatherType) {
      case 'day':
        return <Sun className="text-yellow-400 w-10 h-10 animate-float" />;
      case 'night':
        return <Moon className="text-white w-10 h-10 animate-float" />;
      case 'sunset':
        return <Sunset className="text-orange-400 w-10 h-10 animate-float" />;
      case 'cloudy':
        return <Cloud className="text-white w-10 h-10 animate-float" />;
      case 'rainy':
        return <CloudRain className="text-white w-10 h-10 animate-float" />;
      default:
        return null;
    }
  };

  return (
    <div className={`fixed inset-0 -z-10 transition-colors duration-1000 ease-in-out weather-${weatherType}`}>
      <div className="absolute top-10 right-10">
        {renderWeatherIcon()}
      </div>
    </div>
  );
};

export default WeatherBackground;


import { useEffect, useState } from 'react';
import { WeatherType } from '@/types';
import { Cloud, CloudRain, Moon, Sun, Sunset, Snowflake, CloudFog } from 'lucide-react';

type WeatherBackgroundProps = {
  timezone: string;
};

const WeatherBackground = ({ timezone }: WeatherBackgroundProps) => {
  const [weatherType, setWeatherType] = useState<WeatherType>('day');

  useEffect(() => {
    // Get current time to determine if it's day or night based on timezone
    const getCurrentWeather = () => {
      // Create a date object with the timezone
      const options = { timeZone: timezone, hour: 'numeric', hour12: false } as const;
      const hour = parseInt(new Intl.DateTimeFormat('en-US', options).format(new Date()));
      
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
      if (randomWeather > 0.85) {
        setWeatherType('cloudy');
      } else if (randomWeather > 0.75) {
        setWeatherType('rainy');
      } else if (randomWeather > 0.7) {
        setWeatherType('snowy');
      } else if (randomWeather > 0.65) {
        setWeatherType('foggy');
      }
    };

    getCurrentWeather();
    
    // Update weather every 15 minutes
    const interval = setInterval(getCurrentWeather, 15 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [timezone]);

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
      case 'snowy':
        return <Snowflake className="text-white w-10 h-10 animate-float" />;
      case 'foggy':
        return <CloudFog className="text-white w-10 h-10 animate-float" />;
      default:
        return null;
    }
  };

  // Helper function to render weather particles (rain drops, snowflakes, etc.)
  const renderParticles = () => {
    if (weatherType === 'rainy') {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-0.5 h-8 bg-blue-200 opacity-70 animate-rainfall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${0.5 + Math.random() * 1}s`,
              }}
            ></div>
          ))}
        </div>
      );
    }
    
    if (weatherType === 'snowy') {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-90 animate-snowfall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>
      );
    }
    
    if (weatherType === 'cloudy') {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="absolute bg-white/20 rounded-full blur-xl animate-cloud-float"
              style={{
                width: `${150 + Math.random() * 200}px`,
                height: `${80 + Math.random() * 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 30}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${20 + Math.random() * 40}s`,
              }}
            ></div>
          ))}
        </div>
      );
    }
    
    if (weatherType === 'foggy') {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none bg-white/20 backdrop-blur-sm">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="absolute bg-white/30 rounded-full blur-3xl animate-fog-float"
              style={{
                width: `${200 + Math.random() * 300}px`,
                height: `${100 + Math.random() * 150}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 80}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${30 + Math.random() * 30}s`,
              }}
            ></div>
          ))}
        </div>
      );
    }
    
    if (weatherType === 'day') {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-1/4 w-20 h-20 bg-yellow-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="absolute bg-white/10 rounded-full blur-xl animate-cloud-float"
              style={{
                width: `${100 + Math.random() * 150}px`,
                height: `${60 + Math.random() * 80}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 30}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${30 + Math.random() * 30}s`,
              }}
            ></div>
          ))}
        </div>
      );
    }
    
    if (weatherType === 'night') {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                opacity: Math.random() * 0.7 + 0.3,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${1 + Math.random() * 5}s`,
              }}
            ></div>
          ))}
          <div className="absolute top-20 right-1/4 w-16 h-16 bg-gray-100 rounded-full blur-sm opacity-80"></div>
        </div>
      );
    }
    
    if (weatherType === 'sunset') {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-orange-500/50 to-transparent"></div>
          <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-orange-400 rounded-full blur-3xl opacity-50"></div>
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="absolute bg-orange-200/20 rounded-full blur-xl"
              style={{
                width: `${100 + Math.random() * 150}px`,
                height: `${60 + Math.random() * 80}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 30 + 20}%`,
              }}
            ></div>
          ))}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className={`fixed inset-0 -z-10 transition-colors duration-1000 ease-in-out weather-${weatherType}`}>
      {renderParticles()}
      <div className="absolute top-10 right-10 opacity-80 z-10">
        {renderWeatherIcon()}
      </div>
    </div>
  );
};

export default WeatherBackground;

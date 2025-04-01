
export type WeatherType = 'day' | 'night' | 'sunset' | 'cloudy' | 'rainy';

export type WeatherCondition = {
  type: WeatherType;
  description: string;
  icon: string;
};

export type Location = {
  country: string;
  district: string;
  timezone: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  category: string;
  createdAt: Date;
};

export type Habit = {
  id: string;
  title: string;
  description?: string;
  streak: number;
  frequency: 'daily' | 'weekly';
  lastCompleted?: Date;
  daysCompleted: Date[];
  createdAt: Date;
};

export type Goal = {
  id: string;
  title: string;
  description?: string;
  progress: number;
  target: number;
  category: string;
  dueDate?: Date;
  createdAt: Date;
};

export type TeddyAccessory = {
  id: string;
  name: string;
  type: 'hat' | 'scarf' | 'glasses' | 'outfit';
  unlocked: boolean;
};

export type TeddyCustomization = {
  color: string;
  accessories: string[];
  name: string;
  profileImage?: string;
  location: Location;
};

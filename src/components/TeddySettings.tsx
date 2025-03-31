import { useState } from 'react';
import { TeddyCustomization, TeddyAccessory } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Palette, ShoppingBag, User } from 'lucide-react';

type TeddySettingsProps = {
  customization: TeddyCustomization;
  onUpdateCustomization: (customization: TeddyCustomization) => void;
  accessories: TeddyAccessory[];
};

const TeddySettings = ({ customization, onUpdateCustomization, accessories }: TeddySettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localCustomization, setLocalCustomization] = useState<TeddyCustomization>(customization);
  
  const colors = [
    { name: 'Brown', value: 'bg-teddy' },
    { name: 'Honey', value: 'bg-amber-300' },
    { name: 'Peach', value: 'bg-peach' },
    { name: 'Lavender', value: 'bg-lavender-light' },
    { name: 'Blue', value: 'bg-skyblue' },
  ];
  
  const handleSave = () => {
    onUpdateCustomization(localCustomization);
    setIsOpen(false);
  };
  
  const toggleAccessory = (id: string) => {
    const newAccessories = [...localCustomization.accessories];
    if (newAccessories.includes(id)) {
      setLocalCustomization({
        ...localCustomization,
        accessories: newAccessories.filter(a => a !== id)
      });
    } else {
      setLocalCustomization({
        ...localCustomization,
        accessories: [...newAccessories, id]
      });
    }
  };
  
  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)} 
        variant="outline" 
        size="icon" 
        className="h-10 w-10 rounded-full glass"
      >
        <Settings className="h-5 w-5" />
      </Button>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-4 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Customize Your Teddy</h2>
        
        <Tabs defaultValue="appearance">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="appearance" className="flex items-center">
              <Palette className="mr-2 h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="accessories" className="flex items-center">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Accessories
            </TabsTrigger>
            <TabsTrigger value="name" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Name
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Teddy Color</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    className={`w-10 h-10 rounded-full ${color.value} border-2 ${
                      localCustomization.color === color.value
                        ? 'border-primary ring-2 ring-primary ring-offset-2'
                        : 'border-gray-200'
                    }`}
                    onClick={() => setLocalCustomization({...localCustomization, color: color.value})}
                    aria-label={`Select ${color.name} color`}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="accessories" className="space-y-4">
            <h3 className="font-medium mb-2">Available Accessories</h3>
            <div className="grid grid-cols-2 gap-2">
              {accessories.filter(a => a.unlocked).map((accessory) => (
                <div 
                  key={accessory.id} 
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    localCustomization.accessories.includes(accessory.id)
                      ? 'bg-lavender-light border-lavender'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  onClick={() => toggleAccessory(accessory.id)}
                >
                  <div className="font-medium">{accessory.name}</div>
                  <div className="text-xs text-muted-foreground">{accessory.type}</div>
                </div>
              ))}
            </div>
            
            {accessories.filter(a => !a.unlocked).length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2 text-muted-foreground">Locked Accessories</h3>
                <div className="grid grid-cols-2 gap-2">
                  {accessories.filter(a => !a.unlocked).map((accessory) => (
                    <div 
                      key={accessory.id} 
                      className="p-3 border rounded-lg bg-gray-100/50 opacity-70"
                    >
                      <div className="font-medium">{accessory.name}</div>
                      <div className="text-xs text-muted-foreground">Complete more tasks to unlock!</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="name">
            <div>
              <label htmlFor="teddyName" className="block font-medium mb-2">
                Teddy's Name
              </label>
              <input
                id="teddyName"
                type="text"
                value={localCustomization.name}
                onChange={(e) => setLocalCustomization({...localCustomization, name: e.target.value})}
                className="w-full p-2 border rounded mb-4"
                maxLength={20}
                placeholder="Name your teddy..."
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex gap-2 justify-end mt-4">
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeddySettings;

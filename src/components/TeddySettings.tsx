
import { useState, useRef } from 'react';
import { TeddyCustomization, TeddyAccessory } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Palette, ShoppingBag, User, Image } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

type TeddySettingsProps = {
  customization: TeddyCustomization;
  onUpdateCustomization: (customization: TeddyCustomization) => void;
  accessories: TeddyAccessory[];
};

const TeddySettings = ({ customization, onUpdateCustomization, accessories }: TeddySettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localCustomization, setLocalCustomization] = useState<TeddyCustomization>(customization);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Image too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    // Convert image to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setLocalCustomization({
        ...localCustomization,
        profileImage: result
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setLocalCustomization({
      ...localCustomization,
      profileImage: undefined
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
        <h2 className="text-xl font-bold mb-4">Customize Your Character</h2>
        
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
            <TabsTrigger value="profileImage" className="flex items-center">
              <Image className="mr-2 h-4 w-4" />
              My Image
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
                Character Name
              </label>
              <input
                id="teddyName"
                type="text"
                value={localCustomization.name}
                onChange={(e) => setLocalCustomization({...localCustomization, name: e.target.value})}
                className="w-full p-2 border rounded mb-4"
                maxLength={20}
                placeholder="Name your character..."
              />
            </div>
          </TabsContent>

          <TabsContent value="profileImage">
            <div>
              <h3 className="font-medium mb-2">Upload Your Image</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload your own image to use as your character. This will replace the teddy bear.
              </p>
              
              <div className="flex flex-col items-center gap-4 mb-4">
                {localCustomization.profileImage ? (
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={localCustomization.profileImage} alt="Profile" />
                      <AvatarFallback>{localCustomization.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Button variant="destructive" size="sm" onClick={handleRemoveImage}>
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-2">
                      <Image className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">No image selected</p>
                  </div>
                )}
                
                <div className="flex flex-col w-full">
                  <input
                    type="file"
                    id="profile-image"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    Choose Image
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Recommended: Square image, max 5MB
                </div>
              </div>
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

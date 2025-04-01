
import { useState, useEffect } from 'react';
import { DailyAdvice as DailyAdviceType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Star, StarOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import SavedAdvices from '@/components/SavedAdvices';

type DailyAdviceProps = {
  currentAdvice: DailyAdviceType;
  savedAdvices: DailyAdviceType[];
  onSaveAdvice: (advice: DailyAdviceType) => void;
};

const adviceList = [
  "Take a small step every day toward your goals.",
  "Remember to drink water and stay hydrated!",
  "A little progress each day adds up to big results.",
  "Don't forget to stretch and take breaks from sitting.",
  "Celebrate your small victories too!",
  "Be kind to yourself, you're doing your best.",
  "Taking time to rest is also being productive.",
  "Focus on progress, not perfection.",
  "Doing something small is better than doing nothing.",
  "Your habits shape your future self.",
  "Consistency beats intensity in the long run.",
  "Remember why you started when things get tough.",
  "Every expert was once a beginner.",
  "It's okay to have bad days, just don't give up.",
  "Small changes lead to big transformations."
];

const DailyAdvice = ({ currentAdvice, savedAdvices, onSaveAdvice }: DailyAdviceProps) => {
  const { toast } = useToast();
  const [saved, setSaved] = useState(currentAdvice.saved);
  
  useEffect(() => {
    setSaved(currentAdvice.saved);
  }, [currentAdvice]);
  
  const handleSaveAdvice = () => {
    const updatedAdvice = { ...currentAdvice, saved: !saved };
    onSaveAdvice(updatedAdvice);
    setSaved(!saved);
    
    toast({
      title: saved ? "Advice removed from saved" : "Advice saved!",
      description: saved 
        ? "This advice has been removed from your saved collection." 
        : "This advice has been added to your saved collection.",
    });
  };
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center text-lg font-cute">
          <span>Today's Advice</span>
          <span className="text-sm text-muted-foreground">
            {format(new Date(currentAdvice.date), 'MMM d, yyyy')}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-base italic">"{currentAdvice.text}"</p>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <SavedAdvices savedAdvices={savedAdvices} onSaveAdvice={onSaveAdvice} />
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleSaveAdvice}
          className="flex items-center gap-1"
        >
          {saved ? (
            <>
              <StarOff className="h-4 w-4" />
              <span>Unsave</span>
            </>
          ) : (
            <>
              <Star className="h-4 w-4" />
              <span>Save</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DailyAdvice;


import React, { useState } from 'react';
import { DailyAdvice } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Bookmark, Star, X } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';

type SavedAdvicesProps = {
  savedAdvices: DailyAdvice[];
  onSaveAdvice: (advice: DailyAdvice) => void;
};

const SavedAdvices = ({ savedAdvices, onSaveAdvice }: SavedAdvicesProps) => {
  const [open, setOpen] = useState(false);
  
  const handleUnsaveAdvice = (advice: DailyAdvice) => {
    const updatedAdvice = { ...advice, saved: false };
    onSaveAdvice(updatedAdvice);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Bookmark className="h-4 w-4" />
          <span>My Collection ({savedAdvices.length})</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Saved Advice Collection</DialogTitle>
          <DialogDescription>
            Your personally curated collection of daily wisdom.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {savedAdvices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="mb-2">Your collection is empty</p>
              <p>Save advice from the daily card to see it here.</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {savedAdvices.map((advice) => (
                  <Card key={advice.id} className="relative">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-muted-foreground">
                        {format(new Date(advice.date), 'MMMM d, yyyy')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm italic">"{advice.text}"</p>
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnsaveAdvice(advice)}
                        className="h-7 px-2"
                      >
                        <X className="h-4 w-4 mr-1" />
                        <span>Remove</span>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SavedAdvices;

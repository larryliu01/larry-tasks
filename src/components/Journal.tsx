
import { useState } from 'react';
import { JournalEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { format } from 'date-fns';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter, 
  DialogClose 
} from '@/components/ui/dialog';
import { BookOpen, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from '@/components/ui/select';

type JournalProps = {
  entries: JournalEntry[];
  onAddEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
};

const Journal = ({ entries, onAddEntry }: JournalProps) => {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<JournalEntry['mood']>('neutral');
  
  const handleSubmit = () => {
    if (!content.trim()) return;
    
    onAddEntry({
      content,
      mood,
      tags: []
    });
    
    setContent('');
    setMood('neutral');
  };
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold font-cute">My Journal</h2>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>New Entry</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Journal Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(), 'EEEE, MMMM d, yyyy')}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm">Mood:</span>
                  <Select value={mood} onValueChange={(value) => setMood(value as JournalEntry['mood'])}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select mood" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="happy">Happy</SelectItem>
                      <SelectItem value="excited">Excited</SelectItem>
                      <SelectItem value="calm">Calm</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="sad">Sad</SelectItem>
                      <SelectItem value="angry">Angry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Textarea 
                placeholder="Write your thoughts for today..." 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px]"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button 
                onClick={handleSubmit} 
                disabled={!content.trim()}
              >
                Save Entry
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {entries.length === 0 ? (
        <Card className="w-full p-6 text-center">
          <BookOpen className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No journal entries yet. Start writing today!</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {entries.slice(0, 3).map((entry) => (
            <Card key={entry.id} className="w-full">
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center text-md">
                  <div className="flex items-center gap-2">
                    <span className="capitalize text-sm">{entry.mood} mood</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(entry.date), 'MMM d, yyyy')}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-line line-clamp-3">{entry.content}</p>
              </CardContent>
            </Card>
          ))}
          
          {entries.length > 3 && (
            <Button variant="ghost" className="w-full">
              View All Entries
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Journal;

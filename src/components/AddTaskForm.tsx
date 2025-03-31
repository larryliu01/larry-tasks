
import { useState } from 'react';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

type AddTaskFormProps = {
  onAddTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
};

const AddTaskForm = ({ onAddTask }: AddTaskFormProps) => {
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'completed' | 'createdAt'>>({
    title: '',
    description: '',
    priority: 'medium',
    category: 'General',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask(newTask);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      category: 'General',
    });
    setShowForm(false);
  };

  const categories = ['General', 'Work', 'Personal', 'Health', 'Shopping', 'Learning'];

  return (
    <div className="mb-6">
      {!showForm ? (
        <Button 
          onClick={() => setShowForm(true)} 
          className="w-full glass bg-lavender/30 hover:bg-lavender/50 text-foreground"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Task
        </Button>
      ) : (
        <div className="glass p-4 rounded-lg">
          <h3 className="font-medium mb-3">Add New Task</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Task Title
              </label>
              <input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                className="w-full p-2 border rounded h-20"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label htmlFor="priority" className="block text-sm font-medium mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value as Task['priority']})}
                  className="w-full p-2 border rounded"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={newTask.category}
                  onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                  Due Date (Optional)
                </label>
                <input
                  id="dueDate"
                  type="date"
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value ? new Date(e.target.value) : undefined})}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Task</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddTaskForm;

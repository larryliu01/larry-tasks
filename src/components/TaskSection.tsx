
import { Task } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, ListTodo } from 'lucide-react';
import TaskCard from '@/components/TaskCard';
import AddTaskForm from '@/components/AddTaskForm';

type TaskSectionProps = {
  completedTasks: Task[];
  uncompletedTasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
  onCompleteTask: (id: string, completed: boolean) => void;
  onDeleteTask: (id: string) => void;
  onSetReminder?: (task: Task, reminderTime: Date) => void;
};

const TaskSection = ({
  completedTasks,
  uncompletedTasks,
  onAddTask,
  onCompleteTask,
  onDeleteTask,
  onSetReminder
}: TaskSectionProps) => {
  return (
    <div>
      <AddTaskForm onAddTask={onAddTask} />
      
      <Tabs defaultValue="tasks" className="glass rounded-lg p-4">
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="tasks" className="flex items-center">
            <ListTodo className="mr-2 h-4 w-4" />
            Tasks {uncompletedTasks.length > 0 && `(${uncompletedTasks.length})`}
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4" />
            Completed {completedTasks.length > 0 && `(${completedTasks.length})`}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks">
          {uncompletedTasks.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <p className="text-lg mb-2">All caught up!</p>
              <p>You don't have any pending tasks. Add a new task to get started.</p>
            </div>
          ) : (
            <div className="task-grid">
              {uncompletedTasks.map(task => (
                <TaskCard 
                  key={task.id}
                  task={task}
                  onComplete={onCompleteTask}
                  onDelete={onDeleteTask}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {completedTasks.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <p className="text-lg mb-2">Nothing completed yet</p>
              <p>When you complete tasks, they will appear here.</p>
            </div>
          ) : (
            <div className="task-grid">
              {completedTasks.map(task => (
                <TaskCard 
                  key={task.id}
                  task={task}
                  onComplete={onCompleteTask}
                  onDelete={onDeleteTask}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskSection;

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import TaskList from '@/components/TaskList';
import AddTaskButton from '@/components/AddTaskButton';
import ImportButton from '@/components/ImportButton';

export default async function TasksPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select(`
      *,
      customers (
        name
      )
    `)
    .order('due_date');

  if (error) {
    throw error;
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Oppgaver</h1>
          <div className="space-x-4">
            <ImportButton type="tasks" />
            <AddTaskButton />
          </div>
        </div>
        <div className="mt-6">
          <TaskList tasks={tasks} />
        </div>
      </div>
    </div>
  );
}
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import TaskList from '@/components/TaskList';
import AddTaskButton from '@/components/AddTaskButton';
import ImportButton from '@/components/ImportButton';
import type { Task } from '@/lib/api/types';

export default async function TasksPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data, error } = await supabase
    .from('tasks')
    .select(`
      id,
      customer_id,
      type,
      due_date,
      status,
      description,
      customers (
        name
      )
    `)
    .order('due_date');

  if (error) {
    console.error('Feil ved henting av oppgaver:', error.message);
    return <p className="text-red-600">Kunne ikke laste oppgaver.</p>;
  }

  if (!data || data.length === 0) {
    return <p className="text-gray-600">Ingen oppgaver funnet.</p>;
  }

  const tasks: Task[] = data.map((task: any) => ({
    id: task.id,
    customerId: task.customer_id,
    type: task.type,
    dueDate: new Date(task.due_date),
    status: task.status,
    description: task.description,
    customers: task.customers,
  }));

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

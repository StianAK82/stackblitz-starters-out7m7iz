import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import EditTaskForm from '@/components/EditTaskForm';

export default async function EditTaskPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: task, error } = await supabase
    .from('tasks')
    .select(`
      *,
      customers (
        name
      )
    `)
    .eq('id', id)
    .single();

  if (error || !task) {
    notFound();
  }

  return (
    <div className="py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Rediger oppgave: {task.title}
        </h1>
        <div className="bg-white shadow rounded-lg">
          <EditTaskForm task={task} />
        </div>
      </div>
    </div>
  );
}
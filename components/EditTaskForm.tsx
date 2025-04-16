'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Task } from '@/lib/api/types';

const taskSchema = z.object({
  title: z.string().min(1, 'Tittel er påkrevd'),
  description: z.string().optional(),
  dueDate: z.string().min(1, 'Velg frist'),
  status: z.enum(['pending', 'in_progress', 'completed']),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface EditTaskFormProps {
  task: Task;
}

export default function EditTaskForm({ task }: EditTaskFormProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      dueDate: new Date(task.due_date).toISOString().split('T')[0],
      status: task.status,
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      const { error: updateError } = await supabase
        .from('tasks')
        .update({
          title: data.title,
          description: data.description,
          due_date: new Date(data.dueDate).toISOString(),
          status: data.status,
        })
        .eq('id', task.id);

      if (updateError) {
        throw updateError;
      }

      router.push('/tasks');
      router.refresh();
    } catch (err) {
      setError('Det oppstod en feil ved oppdatering av oppgave');
      console.error('Error updating task:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Tittel
        </label>
        <input
          type="text"
          id="title"
          {...register('title')}
          className="mt-1 input"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Beskrivelse
        </label>
        <textarea
          id="description"
          rows={3}
          {...register('description')}
          className="mt-1 input"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
          Frist
        </label>
        <input
          type="date"
          id="dueDate"
          {...register('dueDate')}
          className="mt-1 input"
        />
        {errors.dueDate && (
          <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          {...register('status')}
          className="mt-1 input"
        >
          <option value="pending">Venter</option>
          <option value="in_progress">Pågår</option>
          <option value="completed">Fullført</option>
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Avbryt
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? 'Lagrer...' : 'Lagre'}
        </button>
      </div>
    </form>
  );
}
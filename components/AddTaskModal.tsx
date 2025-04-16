import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Customer } from '@/lib/api/types';

const taskSchema = z.object({
  customerId: z.string().uuid('Velg kunde'),
  type: z.enum(['vat', 'salary', 'yearend', 'bookkeeping'], {
    required_error: 'Velg oppgavetype',
  }),
  title: z.string().min(1, 'Tittel er påkrevd'),
  description: z.string().optional(),
  dueDate: z.string().min(1, 'Velg frist'),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddTaskModal({ open, onClose }: AddTaskModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  useEffect(() => {
    async function loadCustomers() {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');
      
      if (!error && data) {
        setCustomers(data);
      }
    }

    if (open) {
      loadCustomers();
    }
  }, [open, supabase]);

  const onSubmit = async (data: TaskFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Ikke innlogget');
      }

      const { error: insertError } = await supabase
        .from('tasks')
        .insert({
          customer_id: data.customerId,
          type: data.type,
          title: data.title,
          description: data.description,
          due_date: new Date(data.dueDate).toISOString(),
          user_id: user.id,
        });

      if (insertError) {
        throw insertError;
      }

      reset();
      onClose();
      router.refresh();
    } catch (err) {
      setError('Det oppstod en feil ved lagring av oppgave');
      console.error('Error adding task:', err);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Legg til ny oppgave
                  </Dialog.Title>

                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
                      Kunde
                    </label>
                    <select
                      id="customerId"
                      {...register('customerId')}
                      className="mt-1 input"
                    >
                      <option value="">Velg kunde</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                    {errors.customerId && (
                      <p className="mt-1 text-sm text-red-600">{errors.customerId.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <select
                      id="type"
                      {...register('type')}
                      className="mt-1 input"
                    >
                      <option value="">Velg type</option>
                      <option value="vat">MVA-oppgave</option>
                      <option value="salary">Lønnskjøring</option>
                      <option value="yearend">Årsregnskap</option>
                      <option value="bookkeeping">Bokføring</option>
                    </select>
                    {errors.type && (
                      <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                    )}
                  </div>

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

                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2"
                    >
                      {isSubmitting ? 'Lagrer...' : 'Lagre'}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    >
                      Avbryt
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
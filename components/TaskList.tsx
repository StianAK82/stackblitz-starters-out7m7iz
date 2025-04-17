import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Task } from '@/lib/api/types';
import TaskStatusBadge from './TaskStatusBadge';
import Link from 'next/link';

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {tasks.map((task) => (
          <li key={task.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-blue-600 truncate">
                    {task.description}
                  </p>
                  <TaskStatusBadge status={task.status} className="ml-2" />
                </div>
                <div className="ml-2 flex-shrink-0 flex">
                  <Link
                    href={`/tasks/${task.id}`}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-900"
                  >
                    Se detaljer
                  </Link>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    {task.customers?.name}
                  </p>
                  <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                    {task.type === 'vat' && 'MVA-oppgave'}
                    {task.type === 'salary' && 'Lønnskjøring'}
                    {task.type === 'yearend' && 'Årsregnskap'}
                    {task.type === 'bookkeeping' && 'Bokføring'}
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <p>
                    Frist:{' '}
                    {format(new Date(task.dueDate), 'PPP', { locale: nb })}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

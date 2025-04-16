import { Task } from '@/lib/api/types';
import clsx from 'clsx';

interface TaskStatusBadgeProps {
  status: Task['status'];
  className?: string;
}

export default function TaskStatusBadge({ status, className }: TaskStatusBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-yellow-100 text-yellow-800': status === 'pending',
          'bg-blue-100 text-blue-800': status === 'in_progress',
          'bg-green-100 text-green-800': status === 'completed',
        },
        className
      )}
    >
      {status === 'pending' && 'Venter'}
      {status === 'in_progress' && 'Pågår'}
      {status === 'completed' && 'Fullført'}
    </span>
  );
}
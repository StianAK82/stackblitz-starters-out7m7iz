import { HomeIcon, UserGroupIcon, ClipboardDocumentListIcon, ChatBubbleLeftRightIcon, Cog6ToothIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import clsx from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Kunder', href: '/customers', icon: UserGroupIcon },
  { name: 'Oppgaver', href: '/tasks', icon: ClipboardDocumentListIcon },
  { name: 'Integrasjoner', href: '/integrations', icon: ArrowsRightLeftIcon },
  { name: 'AI Assistent', href: '/ai-assistant', icon: ChatBubbleLeftRightIcon },
  { name: 'Innstillinger', href: '/settings', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow bg-white pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-semibold text-gray-900">Regnskaps CRM</h1>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                  'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon
                  className={clsx(
                    'mr-3 flex-shrink-0 h-6 w-6',
                    'text-gray-400 group-hover:text-gray-500'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
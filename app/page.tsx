import { ArrowTrendingUpIcon, UserGroupIcon, ClockIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const stats = [
  { name: 'Aktive Kunder', stat: '24', icon: UserGroupIcon },
  { name: 'Ventende Oppgaver', stat: '12', icon: ClockIcon },
  { name: 'MVA-frister Denne Måneden', stat: '8', icon: ExclamationCircleIcon },
  { name: 'Fullførte Oppgaver', stat: '156', icon: ArrowTrendingUpIcon },
];

export default function Home() {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.name} className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">{item.name}</div>
                  <div className="text-lg font-semibold text-gray-900">{item.stat}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Kommende Frister</h2>
            <div className="space-y-3">
              {[
                { name: 'MVA-oppgave Q3', date: '15. oktober 2023', status: 'warning' },
                { name: 'Lønnskjøring', date: '1. oktober 2023', status: 'normal' },
                { name: 'Årsregnskap Bedrift AS', date: '31. desember 2023', status: 'normal' },
              ].map((task) => (
                <div
                  key={task.name}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{task.name}</p>
                    <p className="text-sm text-gray-500">{task.date}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      task.status === 'warning'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {task.status === 'warning' ? 'Haster' : 'Planlagt'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Siste Aktiviteter</h2>
            <div className="space-y-4">
              {[
                { user: 'Ole Hansen', action: 'fullførte MVA-oppgave for', client: 'Teknisk AS' },
                { user: 'Maria Olsen', action: 'oppdaterte timeliste for', client: 'Byggtjenester AS' },
                { user: 'Per Jensen', action: 'lastet opp bilag for', client: 'Restaurant AS' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">{activity.user}</span>
                      {' '}{activity.action}{' '}
                      <span className="font-medium text-gray-900">{activity.client}</span>
                    </p>
                    <p className="text-xs text-gray-500">For 2 timer siden</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
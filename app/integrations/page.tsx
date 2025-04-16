import { accountingProviders } from '@/lib/api/providers';

export default function IntegrationsPage() {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Integrasjoner</h1>
        
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {accountingProviders.map((provider) => (
            <div key={provider.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-gray-100">
                    {/* Placeholder for logo */}
                    <span className="text-xl font-semibold text-gray-700">
                      {provider.name[0]}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{provider.name}</h3>
                    <p className="text-sm text-gray-500">{provider.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <button
                  className={`btn-primary w-full ${
                    !provider.isSupported && 'opacity-50 cursor-not-allowed'
                  }`}
                  disabled={!provider.isSupported}
                >
                  {provider.isSupported ? 'Koble til' : 'Kommer snart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
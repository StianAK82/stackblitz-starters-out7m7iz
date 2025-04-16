import { useState } from 'react';

export default function AIAssistantPage() {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">AI Assistent</h1>
        
        <div className="bg-white shadow-sm rounded-lg p-6">
          <p className="text-gray-600">
            AI-assistenten er under utvikling og vil være tilgjengelig snart. 
            Den vil hjelpe deg med:
          </p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center text-gray-700">
              <span className="mr-2">•</span>
              Automatisk kategorisering av bilag
            </li>
            <li className="flex items-center text-gray-700">
              <span className="mr-2">•</span>
              Forslag til kontering
            </li>
            <li className="flex items-center text-gray-700">
              <span className="mr-2">•</span>
              Identifisering av avvik og feil
            </li>
            <li className="flex items-center text-gray-700">
              <span className="mr-2">•</span>
              Automatisk generering av rapporter
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
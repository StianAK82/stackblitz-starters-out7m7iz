'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Beklager, noe gikk galt
          </h2>
          <p className="text-gray-600 mb-4">
            Det oppstod en feil ved lasting av kundelisten.
          </p>
          <button
            onClick={reset}
            className="btn-primary"
          >
            Prøv igjen
          </button>
        </div>
      </div>
    </div>
  );
}
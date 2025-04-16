import AddCustomerForm from '@/components/AddCustomerForm';

export default function AddCustomerPage() {
  return (
    <div className="py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Legg til ny kunde</h1>
        <div className="bg-white shadow rounded-lg">
          <AddCustomerForm />
        </div>
      </div>
    </div>
  );
}
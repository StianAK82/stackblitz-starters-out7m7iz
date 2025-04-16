import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import EditCustomerForm from '@/components/EditCustomerForm';

export default async function EditCustomerPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: customer, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !customer) {
    notFound();
  }

  return (
    <div className="py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Rediger kunde: {customer.name}
        </h1>
        <div className="bg-white shadow rounded-lg">
          <EditCustomerForm customer={customer} />
        </div>
      </div>
    </div>
  );
}
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { accountingProviders } from '@/lib/api/providers';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';

const customerSchema = z.object({
  name: z.string().min(1, 'Bedriftsnavn er påkrevd'),
  orgNumber: z.string().length(9, 'Organisasjonsnummer må være 9 siffer'),
  accountingSystem: z.string().min(1, 'Velg regnskapssystem'),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export default function AddCustomerForm() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });

  const onSubmit = async (data: CustomerFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Ikke innlogget');
      }

      const { error: insertError } = await supabase
        .from('customers')
        .insert({
          name: data.name,
          org_number: data.orgNumber,
          accounting_system: data.accountingSystem,
          user_id: user.id,
        });

      if (insertError) {
        throw insertError;
      }

      router.push('/customers');
      router.refresh();
    } catch (err) {
      setError('Det oppstod en feil ved lagring av kunde');
      console.error('Error adding customer:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Bedriftsnavn
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className="mt-1 input"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="orgNumber" className="block text-sm font-medium text-gray-700">
          Organisasjonsnummer
        </label>
        <input
          type="text"
          id="orgNumber"
          {...register('orgNumber')}
          className="mt-1 input"
        />
        {errors.orgNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.orgNumber.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="accountingSystem" className="block text-sm font-medium text-gray-700">
          Regnskapssystem
        </label>
        <select
          id="accountingSystem"
          {...register('accountingSystem')}
          className="mt-1 input"
        >
          <option value="">Velg regnskapssystem</option>
          {accountingProviders
            .filter(provider => provider.isSupported)
            .map(provider => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
        </select>
        {errors.accountingSystem && (
          <p className="mt-1 text-sm text-red-600">{errors.accountingSystem.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Avbryt
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? 'Lagrer...' : 'Lagre'}
        </button>
      </div>
    </form>
  );
}
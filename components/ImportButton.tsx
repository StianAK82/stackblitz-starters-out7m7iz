'use client';

import { useState } from 'react';
import { read, utils } from 'xlsx';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface ImportButtonProps {
  type: 'customers' | 'tasks';
  onSuccess?: () => void;
}

export default function ImportButton({ type, onSuccess }: ImportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Ikke innlogget');
      }

      if (type === 'customers') {
        for (const row of jsonData) {
          const customer = {
            name: row['Bedriftsnavn'],
            org_number: row['Organisasjonsnummer'].toString(),
            accounting_system: row['Regnskapssystem'],
            user_id: user.id
          };

          const { error: insertError } = await supabase
            .from('customers')
            .insert(customer);

          if (insertError) throw insertError;
        }
      } else {
        for (const row of jsonData) {
          const task = {
            customer_id: row['Kunde ID'],
            type: row['Type'],
            title: row['Tittel'],
            description: row['Beskrivelse'],
            due_date: new Date(row['Frist']).toISOString(),
            status: 'pending',
            user_id: user.id
          };

          const { error: insertError } = await supabase
            .from('tasks')
            .insert(task);

          if (insertError) throw insertError;
        }
      }

      onSuccess?.();
      router.refresh();
    } catch (err) {
      console.error('Import error:', err);
      setError('Det oppstod en feil under import');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <label
        htmlFor="file-upload"
        className={`btn-primary cursor-pointer inline-block ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Importerer...' : 'Importer fra Excel'}
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        disabled={isLoading}
        className="hidden"
      />
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
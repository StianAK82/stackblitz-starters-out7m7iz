export interface Task {
  id: string;
  customer_id: string;
  type: 'vat' | 'salary' | 'yearend' | 'bookkeeping';
  due_date: string; // Supabase returnerer datoer som ISO-strenger
  status: 'pending' | 'in_progress' | 'completed';
  description: string;
  customers?: {
    name: string;
  };
}

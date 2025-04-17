export interface Task {
  id: string;
  customerId: string;
  type: 'vat' | 'salary' | 'yearend' | 'bookkeeping';
  dueDate: Date; // Viktig: Bruk Date, ikke string
  status: 'pending' | 'in_progress' | 'completed';
  description: string;
  customers?: {
    name: string;
  };
}

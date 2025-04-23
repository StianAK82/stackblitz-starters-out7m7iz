export interface Task {
  id: string;
  customerId: string;
  type: 'vat' | 'salary' | 'yearend' | 'bookkeeping';
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  description: string;
  customers?: {
    name: string;
  };
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  organizationNumber?: string;
  address?: string;
  phone?: string;
  city?: string;
  zip?: string;
}

export interface AccountingProvider {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  isSupported?: boolean;
}

export type AccountingSystem = 'fiken' | 'tripletex' | 'poweroffice' | 'conta';

export interface AccountingData {
  customerId: string;
  provider: string;
  importedAt: string;
  data: Record<string, any>;
}



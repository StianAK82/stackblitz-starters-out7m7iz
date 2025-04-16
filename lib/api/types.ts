export interface AccountingSystem {
  name: string;
  apiKey?: string;
  baseUrl: string;
  isConnected: boolean;
}

export interface AccountingProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  isSupported: boolean;
}

export interface Customer {
  id: string;
  name: string;
  orgNumber: string;
  accountingSystem: string;
  lastSync?: Date;
  status: 'active' | 'inactive';
}

export interface AccountingData {
  balance: number;
  revenue: number;
  expenses: number;
  lastUpdated: Date;
  period: string;
}

export interface Task {
  id: string;
  customerId: string;
  type: 'vat' | 'salary' | 'yearend' | 'bookkeeping';
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed';
  description: string;
}
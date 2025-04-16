import { AccountingSystem, AccountingData, Customer, Task } from './types';

class ApiClient {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getCustomers(): Promise<Customer[]> {
    return this.fetch<Customer[]>('/customers');
  }

  async getCustomerData(customerId: string): Promise<AccountingData> {
    return this.fetch<AccountingData>(`/customers/${customerId}/accounting`);
  }

  async getTasks(customerId: string): Promise<Task[]> {
    return this.fetch<Task[]>(`/customers/${customerId}/tasks`);
  }

  async createTask(customerId: string, task: Omit<Task, 'id'>): Promise<Task> {
    return this.fetch<Task>(`/customers/${customerId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    return this.fetch<Task>(`/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }
}
const tasks: Task[] = data.map((task: any) => ({
  id: task.id,
  customerId: task.customer_id,
  type: task.type,
  dueDate: task.due_date,
  status: task.status,
  description: task.description,
  customers: task.customers,
}));

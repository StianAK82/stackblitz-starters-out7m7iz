/*
  # Create tasks table and related schemas

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key to customers)
      - `type` (text, task type: 'vat', 'salary', 'yearend', 'bookkeeping')
      - `title` (text, task title)
      - `description` (text, optional)
      - `due_date` (timestamptz)
      - `status` (text: 'pending', 'in_progress', 'completed')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `user_id` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on `tasks` table
    - Add policies for authenticated users to:
      - Read tasks for their customers
      - Create new tasks
      - Update their own tasks
*/

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('vat', 'salary', 'yearend', 'bookkeeping')),
  title text NOT NULL,
  description text,
  due_date timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = tasks.customer_id
      AND customers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = tasks.customer_id
      AND customers.user_id = auth.uid()
    )
    AND auth.uid() = user_id
  );

CREATE POLICY "Users can update own tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = tasks.customer_id
      AND customers.user_id = auth.uid()
    )
  );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
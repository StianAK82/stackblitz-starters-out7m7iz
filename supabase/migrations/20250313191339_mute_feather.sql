/*
  # Create customers table

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `org_number` (text, required, unique)
      - `accounting_system` (text, required)
      - `last_sync` (timestamp)
      - `status` (text, default: 'active')
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on `customers` table
    - Add policies for authenticated users to:
      - Read their own customers
      - Create new customers
      - Update their own customers
*/

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  org_number text NOT NULL UNIQUE,
  accounting_system text NOT NULL,
  last_sync timestamptz,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own customers"
  ON customers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create customers"
  ON customers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own customers"
  ON customers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);
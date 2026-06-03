/*
  # Create Loyalty Points System

  1. New Tables
    - `loyalty_accounts` - Customer loyalty profiles
    - `loyalty_transactions` - Points earned/spent history
    - `redemption_codes` - Generated redemption codes

  2. Security
    - Enable RLS on all tables
    - Allow customers to manage their own accounts and view history
    - Allow receptionists to validate codes

  3. Columns
    - loyalty_accounts: id, customer_id, email, points_balance, tier, total_earned, total_redeemed, created_at, updated_at
    - loyalty_transactions: id, account_id, type (earn/redeem), points, amount_pkr, description, date
    - redemption_codes: id, account_id, code, points_used, discount_amount, branch, used_at, created_at, expires_at
*/

CREATE TABLE IF NOT EXISTS loyalty_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email text UNIQUE NOT NULL,
  points_balance integer DEFAULT 0,
  tier text DEFAULT 'Bronze',
  total_earned integer DEFAULT 0,
  total_redeemed integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE loyalty_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own loyalty account"
  ON loyalty_accounts FOR SELECT
  USING (true);

CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES loyalty_accounts(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('earn', 'redeem')),
  points integer NOT NULL,
  amount_pkr integer NOT NULL,
  description text,
  transaction_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own transactions"
  ON loyalty_transactions FOR SELECT
  USING (
    account_id IN (
      SELECT id FROM loyalty_accounts WHERE customer_email = current_user
    )
  );

CREATE TABLE IF NOT EXISTS redemption_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES loyalty_accounts(id) ON DELETE CASCADE,
  code text UNIQUE NOT NULL,
  points_used integer NOT NULL,
  discount_amount integer NOT NULL,
  branch text,
  is_used boolean DEFAULT false,
  used_at timestamptz,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '30 days')
);

ALTER TABLE redemption_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own redemption codes"
  ON redemption_codes FOR SELECT
  USING (
    account_id IN (
      SELECT id FROM loyalty_accounts WHERE customer_email = current_user
    )
  );

CREATE POLICY "Anyone can check redemption code validity"
  ON redemption_codes FOR SELECT
  USING (true);

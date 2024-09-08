-- Check if the 'templates' table exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'templates') THEN
        -- Create the 'templates' table
        CREATE TABLE templates (
          id BIGSERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          account_number TEXT NOT NULL,
          debit NUMERIC NOT NULL,
          credit NUMERIC NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -- No need for Row Level Security as templates are shared

        -- Create an index on the name column for faster lookups
        CREATE INDEX idx_templates_name ON templates(name);
    END IF;
END $$;

-- Insert some example templates
INSERT INTO templates (name, account_number, debit, credit)
VALUES
  ('Sales - Cash', '3000', 0, 1000),
  ('Sales - Credit', '3000', 0, 1000),
  ('Purchase - Cash', '4000', 1000, 0),
  ('Purchase - Credit', '4000', 1000, 0),
  ('Salary Payment', '7000', 5000, 0),
  ('Rent Expense', '5000', 2000, 0),
  ('Utility Bill', '6000', 500, 0),
  ('Bank Transfer - Incoming', '1000', 3000, 0),
  ('Bank Transfer - Outgoing', '1000', 0, 3000),
  ('Depreciation Expense', '8000', 1000, 0);
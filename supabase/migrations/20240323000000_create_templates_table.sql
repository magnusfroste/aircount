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
          user_id UUID NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -- Enable Row Level Security (RLS)
        ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

        -- Create a policy to allow read access only to the user's own templates
        CREATE POLICY "Users can only view their own templates" ON templates
          FOR SELECT USING (auth.uid() = user_id);

        -- Create a policy to allow insert for authenticated users
        CREATE POLICY "Users can insert their own templates" ON templates
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        -- Create a policy to allow update for users on their own templates
        CREATE POLICY "Users can update their own templates" ON templates
          FOR UPDATE USING (auth.uid() = user_id);

        -- Create a policy to allow delete for users on their own templates
        CREATE POLICY "Users can delete their own templates" ON templates
          FOR DELETE USING (auth.uid() = user_id);

        -- Create an index on the user_id column for faster lookups
        CREATE INDEX idx_templates_user_id ON templates(user_id);
    END IF;
END $$;

-- Insert some example templates
INSERT INTO templates (name, account_number, debit, credit, user_id)
VALUES
  ('Sales - Cash', '3000', 0, 1000, '00000000-0000-0000-0000-000000000000'),
  ('Sales - Credit', '3000', 0, 1000, '00000000-0000-0000-0000-000000000000'),
  ('Purchase - Cash', '4000', 1000, 0, '00000000-0000-0000-0000-000000000000'),
  ('Purchase - Credit', '4000', 1000, 0, '00000000-0000-0000-0000-000000000000'),
  ('Salary Payment', '7000', 5000, 0, '00000000-0000-0000-0000-000000000000'),
  ('Rent Expense', '5000', 2000, 0, '00000000-0000-0000-0000-000000000000'),
  ('Utility Bill', '6000', 500, 0, '00000000-0000-0000-0000-000000000000'),
  ('Bank Transfer - Incoming', '1000', 3000, 0, '00000000-0000-0000-0000-000000000000'),
  ('Bank Transfer - Outgoing', '1000', 0, 3000, '00000000-0000-0000-0000-000000000000'),
  ('Depreciation Expense', '8000', 1000, 0, '00000000-0000-0000-0000-000000000000');
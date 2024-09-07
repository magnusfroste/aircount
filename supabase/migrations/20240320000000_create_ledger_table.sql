-- Check if the 'ledger' table exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ledger') THEN
        -- Create the 'ledger' table
        CREATE TABLE ledger (
          id BIGSERIAL PRIMARY KEY,
          account TEXT NOT NULL,
          date DATE NOT NULL,
          description TEXT,
          debit NUMERIC NOT NULL DEFAULT 0,
          credit NUMERIC NOT NULL DEFAULT 0,
          balance NUMERIC NOT NULL DEFAULT 0,
          user_id UUID NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -- Enable Row Level Security (RLS)
        ALTER TABLE ledger ENABLE ROW LEVEL SECURITY;

        -- Create a policy to allow read access only to the user's own ledger entries
        CREATE POLICY "Users can only view their own ledger entries" ON ledger
          FOR SELECT USING (auth.uid() = user_id);

        -- Create a policy to allow insert for authenticated users
        CREATE POLICY "Users can insert their own ledger entries" ON ledger
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        -- Create a policy to allow update for users on their own ledger entries
        CREATE POLICY "Users can update their own ledger entries" ON ledger
          FOR UPDATE USING (auth.uid() = user_id);

        -- Create a policy to allow delete for users on their own ledger entries
        CREATE POLICY "Users can delete their own ledger entries" ON ledger
          FOR DELETE USING (auth.uid() = user_id);

        -- Create an index on the user_id column for faster lookups
        CREATE INDEX idx_ledger_user_id ON ledger(user_id);

        -- Create an index on the account column for faster account-based queries
        CREATE INDEX idx_ledger_account ON ledger(account);

        -- Create an index on the date column for faster date-based queries
        CREATE INDEX idx_ledger_date ON ledger(date);
    END IF;
END $$;
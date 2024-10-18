-- Check if the 'opening_balances' table exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'opening_balances') THEN
        -- Create the 'opening_balances' table
        CREATE TABLE opening_balances (
          id BIGSERIAL PRIMARY KEY,
          account TEXT NOT NULL,
          balance NUMERIC NOT NULL,
          user_id UUID NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -- Enable Row Level Security (RLS)
        ALTER TABLE opening_balances ENABLE ROW LEVEL SECURITY;

        -- Create a policy to allow read access only to the user's own opening balances
        CREATE POLICY "Users can only view their own opening balances" ON opening_balances
          FOR SELECT USING (auth.uid() = user_id);

        -- Create a policy to allow insert for authenticated users
        CREATE POLICY "Users can insert their own opening balances" ON opening_balances
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        -- Create a policy to allow update for users on their own opening balances
        CREATE POLICY "Users can update their own opening balances" ON opening_balances
          FOR UPDATE USING (auth.uid() = user_id);

        -- Create a policy to allow delete for users on their own opening balances
        CREATE POLICY "Users can delete their own opening balances" ON opening_balances
          FOR DELETE USING (auth.uid() = user_id);

        -- Create an index on the user_id column for faster lookups
        CREATE INDEX idx_opening_balances_user_id ON opening_balances(user_id);

        -- Create an index on the account column for faster account-based queries
        CREATE INDEX idx_opening_balances_account ON opening_balances(account);
    END IF;
END $$;
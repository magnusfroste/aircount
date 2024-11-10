-- Check if the 'transactions' table exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'transactions') THEN
        -- Create the 'transactions' table
        CREATE TABLE transactions (
          id BIGSERIAL PRIMARY KEY,
          date DATE NOT NULL,
          account TEXT NOT NULL,
          debit NUMERIC NOT NULL,
          credit NUMERIC NOT NULL,
          ver TEXT,
          description TEXT,
          user_id UUID NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -- Enable Row Level Security (RLS)
        ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

        -- Create a policy to allow read access only to the user's own transactions
        CREATE POLICY "Users can only view their own transactions" ON transactions
          FOR SELECT USING (auth.uid() = user_id);

        -- Create a policy to allow insert for authenticated users
        CREATE POLICY "Users can insert their own transactions" ON transactions
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        -- Create a policy to allow update for users on their own transactions
        CREATE POLICY "Users can update their own transactions" ON transactions
          FOR UPDATE USING (auth.uid() = user_id);

        -- Create a policy to allow delete for users on their own transactions
        CREATE POLICY "Users can delete their own transactions" ON transactions
          FOR DELETE USING (auth.uid() = user_id);

        -- Create an index on the user_id column for faster lookups
        CREATE INDEX idx_transactions_user_id ON transactions(user_id);

        -- Create an index on the date column for faster date-based queries
        CREATE INDEX idx_transactions_date ON transactions(date);

        -- Create an index on the ver column for faster verification-based queries
        CREATE INDEX idx_transactions_ver ON transactions(ver);
    ELSE
        -- Add the description column if it doesn't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'description') THEN
            ALTER TABLE transactions ADD COLUMN description TEXT;
        END IF;
    END IF;
END $$;
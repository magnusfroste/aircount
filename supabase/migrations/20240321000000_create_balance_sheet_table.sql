-- Check if the 'balance_sheet' table exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'balance_sheet') THEN
        -- Create the 'balance_sheet' table
        CREATE TABLE balance_sheet (
          id BIGSERIAL PRIMARY KEY,
          user_id UUID NOT NULL,
          date DATE NOT NULL,
          account TEXT NOT NULL,
          category TEXT NOT NULL,
          subcategory TEXT,
          amount NUMERIC NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -- Enable Row Level Security (RLS)
        ALTER TABLE balance_sheet ENABLE ROW LEVEL SECURITY;

        -- Create a policy to allow read access only to the user's own balance sheet entries
        CREATE POLICY "Users can only view their own balance sheet entries" ON balance_sheet
          FOR SELECT USING (auth.uid() = user_id);

        -- Create a policy to allow insert for authenticated users
        CREATE POLICY "Users can insert their own balance sheet entries" ON balance_sheet
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        -- Create a policy to allow update for users on their own balance sheet entries
        CREATE POLICY "Users can update their own balance sheet entries" ON balance_sheet
          FOR UPDATE USING (auth.uid() = user_id);

        -- Create a policy to allow delete for users on their own balance sheet entries
        CREATE POLICY "Users can delete their own balance sheet entries" ON balance_sheet
          FOR DELETE USING (auth.uid() = user_id);

        -- Create an index on the user_id column for faster lookups
        CREATE INDEX idx_balance_sheet_user_id ON balance_sheet(user_id);

        -- Create an index on the date column for faster date-based queries
        CREATE INDEX idx_balance_sheet_date ON balance_sheet(date);

        -- Create an index on the account column for faster account-based queries
        CREATE INDEX idx_balance_sheet_account ON balance_sheet(account);
    END IF;
END $$;
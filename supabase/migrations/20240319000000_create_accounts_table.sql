-- Check if the 'accounts' table exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'accounts') THEN
        -- Create the 'accounts' table
        CREATE TABLE accounts (
          id BIGSERIAL PRIMARY KEY,
          account TEXT NOT NULL,
          account_name TEXT NOT NULL,
          user_id UUID NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -- Enable Row Level Security (RLS)
        ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

        -- Create a policy to allow read access only to the user's own accounts
        CREATE POLICY "Users can only view their own accounts" ON accounts
          FOR SELECT USING (auth.uid() = user_id);

        -- Create a policy to allow insert for authenticated users
        CREATE POLICY "Users can insert their own accounts" ON accounts
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        -- Create a policy to allow update for users on their own accounts
        CREATE POLICY "Users can update their own accounts" ON accounts
          FOR UPDATE USING (auth.uid() = user_id);

        -- Create a policy to allow delete for users on their own accounts
        CREATE POLICY "Users can delete their own accounts" ON accounts
          FOR DELETE USING (auth.uid() = user_id);

        -- Create an index on the user_id column for faster lookups
        CREATE INDEX idx_accounts_user_id ON accounts(user_id);
    END IF;
END $$;
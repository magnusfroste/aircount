-- Check if the 'records' table exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'records') THEN
        -- Create the 'records' table
        CREATE TABLE records (
          id BIGSERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          user_id UUID NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -- Enable Row Level Security (RLS)
        ALTER TABLE records ENABLE ROW LEVEL SECURITY;

        -- Create a policy to allow read access only to the user's own records
        CREATE POLICY "Users can only view their own records" ON records
          FOR SELECT USING (auth.uid() = user_id);

        -- Create a policy to allow insert for authenticated users
        CREATE POLICY "Users can insert their own records" ON records
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        -- Create a policy to allow update for users on their own records
        CREATE POLICY "Users can update their own records" ON records
          FOR UPDATE USING (auth.uid() = user_id);

        -- Create a policy to allow delete for users on their own records
        CREATE POLICY "Users can delete their own records" ON records
          FOR DELETE USING (auth.uid() = user_id);

        -- Create an index on the user_id column for faster lookups
        CREATE INDEX idx_records_user_id ON records(user_id);
    END IF;
END $$;
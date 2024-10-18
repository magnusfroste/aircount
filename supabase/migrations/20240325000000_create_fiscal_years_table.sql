-- Check if the 'fiscal_years' table exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'fiscal_years') THEN
        -- Create the 'fiscal_years' table
        CREATE TABLE fiscal_years (
          id BIGSERIAL PRIMARY KEY,
          year INT NOT NULL,
          user_id UUID NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(year, user_id)
        );

        -- Enable Row Level Security (RLS)
        ALTER TABLE fiscal_years ENABLE ROW LEVEL SECURITY;

        -- Create a policy to allow read access only to the user's own fiscal years
        CREATE POLICY "Users can only view their own fiscal years" ON fiscal_years
          FOR SELECT USING (auth.uid() = user_id);

        -- Create a policy to allow insert for authenticated users
        CREATE POLICY "Users can insert their own fiscal years" ON fiscal_years
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        -- Create a policy to allow update for users on their own fiscal years
        CREATE POLICY "Users can update their own fiscal years" ON fiscal_years
          FOR UPDATE USING (auth.uid() = user_id);

        -- Create a policy to allow delete for users on their own fiscal years
        CREATE POLICY "Users can delete their own fiscal years" ON fiscal_years
          FOR DELETE USING (auth.uid() = user_id);

        -- Create an index on the user_id column for faster lookups
        CREATE INDEX idx_fiscal_years_user_id ON fiscal_years(user_id);

        -- Create an index on the year column for faster year-based queries
        CREATE INDEX idx_fiscal_years_year ON fiscal_years(year);
    END IF;
END $$;
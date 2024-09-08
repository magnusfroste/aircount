-- Check if the 'templates' table exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'templates') THEN
        -- Create the 'templates' table
        CREATE TABLE templates (
          id BIGSERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          date DATE NOT NULL,
          account TEXT NOT NULL,
          debit NUMERIC NOT NULL DEFAULT 0,
          credit NUMERIC NOT NULL DEFAULT 0,
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

        -- Create an index on the name column for faster name-based queries
        CREATE INDEX idx_templates_name ON templates(name);
    END IF;
END $$;
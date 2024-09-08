-- Check if the 'templates' table exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'templates') THEN
        -- Create the 'templates' table
        CREATE TABLE templates (
          id BIGSERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          transactions JSONB NOT NULL,
          is_admin_template BOOLEAN NOT NULL DEFAULT false,
          user_id UUID NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -- Enable Row Level Security (RLS)
        ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

        -- Create a policy to allow read access to all templates (admin and user-created)
        CREATE POLICY "Users can view all templates" ON templates
          FOR SELECT USING (true);

        -- Create a policy to allow insert for authenticated users (non-admin templates)
        CREATE POLICY "Users can insert their own templates" ON templates
          FOR INSERT WITH CHECK (auth.uid() = user_id AND NOT is_admin_template);

        -- Create a policy to allow update for users on their own non-admin templates
        CREATE POLICY "Users can update their own non-admin templates" ON templates
          FOR UPDATE USING (auth.uid() = user_id AND NOT is_admin_template);

        -- Create a policy to allow delete for users on their own non-admin templates
        CREATE POLICY "Users can delete their own non-admin templates" ON templates
          FOR DELETE USING (auth.uid() = user_id AND NOT is_admin_template);

        -- Create an index on the user_id column for faster lookups
        CREATE INDEX idx_templates_user_id ON templates(user_id);

        -- Create an index on the is_admin_template column for faster filtering
        CREATE INDEX idx_templates_is_admin_template ON templates(is_admin_template);
    END IF;
END $$;
-- Create a new RPC function to insert a record with dynamic columns
CREATE OR REPLACE FUNCTION insert_record(
  p_user_id UUID,
  p_record JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  inserted_record JSONB;
BEGIN
  -- Insert the record with dynamic columns
  INSERT INTO records (user_id, data)
  VALUES (p_user_id, p_record)
  RETURNING to_jsonb(records.*) INTO inserted_record;

  RETURN inserted_record;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION insert_record(UUID, JSONB) TO authenticated;

-- Alter the records table to add a JSONB column for dynamic data
ALTER TABLE records ADD COLUMN IF NOT EXISTS data JSONB;

-- Update RLS policies for the new data column
DROP POLICY IF EXISTS "Users can insert their own records" ON records;
CREATE POLICY "Users can insert their own records" ON records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own records" ON records;
CREATE POLICY "Users can update their own records" ON records
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own records" ON records;
CREATE POLICY "Users can delete their own records" ON records
  FOR DELETE USING (auth.uid() = user_id);
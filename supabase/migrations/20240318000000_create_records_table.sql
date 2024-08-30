-- Create the 'records' table
CREATE TABLE records (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE records ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON records
  FOR ALL USING (auth.role() = 'authenticated');

-- Create an index on the email column for faster lookups
CREATE INDEX idx_records_email ON records(email);
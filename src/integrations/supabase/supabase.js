import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

if (!supabaseUrl) {
  console.error('VITE_SUPABASE_PROJECT_URL is not set in the environment variables.');
  throw new Error('Supabase URL is missing. Please check your environment configuration.');
}

if (!supabaseKey) {
  console.error('VITE_SUPABASE_API_KEY is not set in the environment variables.');
  throw new Error('Supabase API key is missing. Please check your environment configuration.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

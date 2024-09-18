import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL || 'https://your-project-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY || 'your-anon-key';

if (supabaseUrl === 'https://your-project-url.supabase.co' || supabaseKey === 'your-anon-key') {
  console.warn('Using default Supabase URL or API key. Please set the correct values in your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

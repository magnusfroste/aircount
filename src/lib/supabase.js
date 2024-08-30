import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or API Key. Please check your environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Import all the relevant exports from other files in the supabase directory
import { supabase } from './supabase.js';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth.jsx';
import { useAccounting, useAddAccounting, useUpdateAccounting, useDeleteAccounting } from './hooks/accounting.js';

// Export all the imported functions and objects from .auth and .hooks/
export {
  supabase,
  SupabaseAuthProvider,
  useSupabaseAuth,
  SupabaseAuthUI,
  useAccounting,
  useAddAccounting,
  useUpdateAccounting,
  useDeleteAccounting,
};
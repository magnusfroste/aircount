// Import all the relevant exports from other files in the supabase directory
import { supabase } from './supabase.js';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth.jsx';
import {
  useRecords,
  useAddRecord,
  useUpdateRecord,
  useDeleteRecord,
} from './hooks/records.js';
import {
  useAccounting,
  useAddAccounting,
  useUpdateAccounting,
  useDeleteAccounting,
} from './hooks/accounting.js';

// Export all the imported functions and objects
export {
  supabase,
  SupabaseAuthProvider,
  useSupabaseAuth,
  SupabaseAuthUI,
  useRecords,
  useAddRecord,
  useUpdateRecord,
  useDeleteRecord,
  useAccounting,
  useAddAccounting,
  useUpdateAccounting,
  useDeleteAccounting,
};
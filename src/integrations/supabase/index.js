import { supabase } from '../../lib/supabase';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth';
import { useRecords, useAddRecord, useUpdateRecord, useDeleteRecord } from './hooks/records';
import { useAccounting, useAddAccounting, useUpdateAccounting, useDeleteAccounting } from './hooks/accounting';

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
  useDeleteAccounting
};

import { supabase } from '../../lib/supabase';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth';
import { useTemplates, useAddTemplate, useUpdateTemplate, useDeleteTemplate } from './hooks/templates';

export {
  supabase,
  SupabaseAuthProvider,
  useSupabaseAuth,
  SupabaseAuthUI,
  useTemplates,
  useAddTemplate,
  useUpdateTemplate,
  useDeleteTemplate,
};

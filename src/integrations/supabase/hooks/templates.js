
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### templates

| name           | type                     | format | required |
|----------------|--------------------------|--------|----------|
| id             | int8                     | number | true     |
| name           | text                     | string | true     |
| account_number | text                     | string | true     |
| debit          | numeric                  | number | true     |
| credit         | numeric                  | number | true     |
| created_at     | timestamp with time zone | string | false    |

*/

export const useTemplates = () => useQuery({
    queryKey: ['air_templates'],
    queryFn: () => fromSupabase(supabase.from('air_templates').select('*')),
});

export const useAddTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (template) => {
      return fromSupabase(supabase.from('air_templates').insert(template));
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['air_templates']);
    },
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...template }) => {
      return fromSupabase(supabase.from('air_templates').update(template).eq('id', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['air_templates']);
    },
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      return fromSupabase(supabase.from('air_templates').delete().eq('id', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['air_templates']);
    },
  });
};

// Re-export the useAddTransaction hook from the transactions.js file
export { useAddTransaction } from './transactions';

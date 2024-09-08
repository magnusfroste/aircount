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
    queryKey: ['templates'],
    queryFn: () => fromSupabase(supabase.from('templates').select('*')),
});

// Re-export the useAddTransaction hook from the transactions.js file
export { useAddTransaction } from './transactions';
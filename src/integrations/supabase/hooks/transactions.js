import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### transactions

| name           | type                     | format | required |
|----------------|--------------------------|--------|----------|
| id             | int8                     | number | true     |
| date           | date                     | string | true     |
| account        | text                     | string | true     |
| debit          | numeric                  | number | true     |
| credit         | numeric                  | number | true     |
| user_id        | uuid                     | string | true     |
| created_at     | timestamp with time zone | string | false    |

*/

export const useTransactions = (userId) => useQuery({
    queryKey: ['transactions', userId],
    queryFn: () => fromSupabase(supabase.from('transactions').select('*').eq('user_id', userId)),
});

export const useAddTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newTransaction) => fromSupabase(supabase.from('transactions').insert([newTransaction])),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['transactions', variables.user_id]);
        },
    });
};

export const useUpdateTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, user_id, ...updateData }) => fromSupabase(supabase.from('transactions').update(updateData).eq('id', id).eq('user_id', user_id)),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['transactions', variables.user_id]);
        },
    });
};

export const useDeleteTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, user_id }) => fromSupabase(supabase.from('transactions').delete().eq('id', id).eq('user_id', user_id)),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['transactions', variables.user_id]);
        },
    });
};
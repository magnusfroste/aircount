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
| ver            | text                     | string | false    |
| user_id        | uuid                     | string | true     |
| created_at     | timestamp with time zone | string | false    |

*/

export const useTransactions = (userId, sortOrder = 'desc') => useQuery({
    queryKey: ['air_transactions', userId, sortOrder],
    queryFn: () => fromSupabase(
        supabase
            .from('air_transactions')
            .select('*')
            .eq('user_id', userId)
            .order('ver', { ascending: sortOrder === 'asc' })
    ),
});

export const useAddTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newTransactions) => {
            const { data, error } = await supabase.from('air_transactions').insert(newTransactions);
            if (error) throw error;
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['air_transactions', variables[0].user_id]);
        },
    });
};

export const useUpdateTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, user_id, ...updateData }) => fromSupabase(supabase.from('air_transactions').update(updateData).eq('id', id).eq('user_id', user_id)),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['air_transactions', variables.user_id]);
        },
    });
};

export const useDeleteTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, user_id }) => fromSupabase(supabase.from('air_transactions').delete().eq('id', id).eq('user_id', user_id)),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['air_transactions', variables.user_id]);
        },
    });
};

export const useImportTransactions = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ transactions, userId }) => {
            const { data, error } = await supabase.from('air_transactions').insert(
                transactions.map(transaction => ({ ...transaction, user_id: userId }))
            );
            if (error) throw new Error(error.message);
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['air_transactions', variables.userId]);
        },
    });
};

export const useDeleteAllTransactions = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId) => fromSupabase(supabase.from('air_transactions').delete().eq('user_id', userId)),
        onSuccess: (_, userId) => {
            queryClient.invalidateQueries(['air_transactions', userId]);
        },
    });
};

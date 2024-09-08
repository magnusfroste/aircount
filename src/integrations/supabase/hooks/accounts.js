import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

export const useAccounts = (userId, page = 1, pageSize = 50, fetchAll = false) => useQuery({
    queryKey: ['accounts', userId, page, pageSize, fetchAll],
    queryFn: async () => {
        if (fetchAll) {
            const { data, error, count } = await supabase
                .from('accounts')
                .select('*', { count: 'exact' })
                .eq('user_id', userId);
            if (error) throw new Error(error.message);
            return { data, count };
        } else {
            const start = (page - 1) * pageSize;
            const end = start + pageSize - 1;
            const { data, error, count } = await supabase
                .from('accounts')
                .select('*', { count: 'exact' })
                .eq('user_id', userId)
                .range(start, end);
            if (error) throw new Error(error.message);
            return { data, count };
        }
    },
});

export const useAddAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newAccount) => fromSupabase(supabase.from('accounts').insert([newAccount])),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['accounts', variables.user_id]);
        },
    });
};

export const useUpdateAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, user_id, ...updateData }) => fromSupabase(supabase.from('accounts').update(updateData).eq('id', id).eq('user_id', user_id)),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['accounts', variables.user_id]);
        },
    });
};

export const useDeleteAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, user_id }) => fromSupabase(supabase.from('accounts').delete().eq('id', id).eq('user_id', user_id)),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['accounts', variables.user_id]);
        },
    });
};

export const useImportAccounts = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ accounts, userId }) => {
            const formattedAccounts = accounts.map(account => ({
                account: account.number,
                account_name: account.name,
                user_id: userId
            }));
            const { data, error } = await supabase.from('accounts').insert(formattedAccounts);
            if (error) throw new Error(error.message);
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['accounts', variables.userId]);
        },
    });
};
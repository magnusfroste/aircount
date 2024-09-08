import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

export const useAccounts = (userId) => useQuery({
    queryKey: ['accounts', userId],
    queryFn: () => fromSupabase(supabase.from('accounts').select('*').eq('user_id', userId)),
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
                account: account.account,
                account_name: account.account_name,
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

export const useDeleteAllAccounts = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId) => fromSupabase(supabase.from('accounts').delete().eq('user_id', userId)),
        onSuccess: (_, userId) => {
            queryClient.invalidateQueries(['accounts', userId]);
        },
    });
};
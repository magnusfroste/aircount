import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

const fetchAllAccounts = async (userId) => {
    let allAccounts = [];
    let page = 0;
    const pageSize = 1000;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from('accounts')
            .select('*')
            .eq('user_id', userId)
            .order('account', { ascending: true })
            .range(page * pageSize, (page + 1) * pageSize - 1);

        if (error) throw new Error(error.message);

        allAccounts = [...allAccounts, ...data];
        hasMore = data.length === pageSize;
        page++;
    }

    return allAccounts;
};

export const useAccounts = (userId) => useQuery({
    queryKey: ['accounts', userId],
    queryFn: () => fetchAllAccounts(userId),
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
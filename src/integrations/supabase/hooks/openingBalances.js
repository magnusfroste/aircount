import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### opening_balances

| name       | type                     | format | required |
|------------|--------------------------|--------|----------|
| id         | int8                     | number | true     |
| account    | text                     | string | true     |
| balance    | numeric                  | number | true     |
| user_id    | uuid                     | string | true     |
| created_at | timestamp with time zone | string | false    |

*/

export const useOpeningBalances = (userId) => useQuery({
    queryKey: ['openingBalances', userId],
    queryFn: () => fromSupabase(supabase.from('opening_balances').select('*').eq('user_id', userId)),
});

export const useAddOpeningBalance = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newBalance) => fromSupabase(supabase.from('opening_balances').insert([newBalance])),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['openingBalances', variables.user_id]);
        },
    });
};

export const useImportOpeningBalances = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ balances, userId }) => {
            const { data, error } = await supabase.from('opening_balances').insert(
                balances.map(balance => ({ ...balance, user_id: userId }))
            );
            if (error) throw new Error(error.message);
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['openingBalances', variables.userId]);
        },
    });
};
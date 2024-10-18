import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### opening_balances

| name        | type                     | format | required |
|-------------|--------------------------|--------|----------|
| id          | int8                     | number | true     |
| account     | text                     | string | true     |
| balance     | numeric                  | number | true     |
| user_id     | uuid                     | string | true     |
| fiscal_year | int4                     | number | true     |
| created_at  | timestamp with time zone | string | false    |

*/

export const useOpeningBalances = (userId, fiscalYear) => useQuery({
    queryKey: ['openingBalances', userId, fiscalYear],
    queryFn: () => fromSupabase(
        supabase.from('opening_balances')
               .select('*')
               .eq('user_id', userId)
               .eq('fiscal_year', fiscalYear)
    ),
    enabled: !!userId && !!fiscalYear,
});

export const useAddOpeningBalance = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newBalance) => fromSupabase(supabase.from('opening_balances').insert([newBalance])),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['openingBalances', variables.user_id, variables.fiscal_year]);
        },
    });
};

export const useDeleteOpeningBalance = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, user_id }) => fromSupabase(supabase.from('opening_balances').delete().eq('id', id).eq('user_id', user_id)),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['openingBalances', variables.user_id]);
        },
    });
};

export const useImportOpeningBalances = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ balances, userId, fiscalYear }) => {
            const formattedBalances = balances.map(balance => ({
                ...balance,
                user_id: userId,
                fiscal_year: fiscalYear
            }));
            const { data, error } = await supabase.from('opening_balances').insert(formattedBalances);
            if (error) throw new Error(error.message);
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['openingBalances', variables.userId, variables.fiscalYear]);
        },
    });
};
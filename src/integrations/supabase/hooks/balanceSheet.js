import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### balance_sheet

| name        | type                     | format | required |
|-------------|--------------------------|--------|----------|
| id          | int8                     | number | true     |
| user_id     | uuid                     | string | true     |
| date        | date                     | string | true     |
| account     | text                     | string | true     |
| category    | text                     | string | true     |
| subcategory | text                     | string | false    |
| amount      | numeric                  | number | true     |
| created_at  | timestamp with time zone | string | false    |

*/

export const useBalanceSheet = (userId, date) => useQuery({
    queryKey: ['balanceSheet', userId, date],
    queryFn: () => fromSupabase(
      supabase.from('balance_sheet')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date)
    ),
});

export const useAddBalanceSheetEntry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newEntry) => fromSupabase(supabase.from('balance_sheet').insert([newEntry])),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['balanceSheet', variables.user_id, variables.date]);
        },
    });
};

export const useUpdateBalanceSheetEntry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, user_id, date, ...updateData }) => fromSupabase(supabase.from('balance_sheet').update(updateData).eq('id', id).eq('user_id', user_id)),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['balanceSheet', variables.user_id, variables.date]);
        },
    });
};

export const useDeleteBalanceSheetEntry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, user_id, date }) => fromSupabase(supabase.from('balance_sheet').delete().eq('id', id).eq('user_id', user_id)),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['balanceSheet', variables.user_id, variables.date]);
        },
    });
};
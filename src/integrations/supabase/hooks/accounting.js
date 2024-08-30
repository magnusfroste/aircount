import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### accounting

| name       | type                     | format | required |
|------------|--------------------------|--------|----------|
| id         | int8                     | number | true     |
| created_at | timestamp with time zone | string | true     |

*/

export const useAccounting = () => useQuery({
    queryKey: ['accounting'],
    queryFn: () => fromSupabase(supabase.from('accounting').select('*')),
});

export const useAddAccounting = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newAccounting) => fromSupabase(supabase.from('accounting').insert([newAccounting])),
        onSuccess: () => {
            queryClient.invalidateQueries('accounting');
        },
    });
};

export const useUpdateAccounting = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('accounting').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('accounting');
        },
    });
};

export const useDeleteAccounting = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('accounting').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('accounting');
        },
    });
};
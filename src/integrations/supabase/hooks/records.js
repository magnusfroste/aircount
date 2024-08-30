import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### records

| name       | type                     | format | required |
|------------|--------------------------|--------|----------|
| id         | int8                     | number | true     |
| name       | text                     | string | true     |
| email      | text                     | string | true     |
| created_at | timestamp with time zone | string | false    |

*/

export const useRecords = () => useQuery({
    queryKey: ['records'],
    queryFn: () => fromSupabase(supabase.from('records').select('*')),
});

export const useAddRecord = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newRecord) => fromSupabase(supabase.from('records').insert([newRecord])),
        onSuccess: () => {
            queryClient.invalidateQueries('records');
        },
    });
};

export const useUpdateRecord = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('records').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('records');
        },
    });
};

export const useDeleteRecord = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('records').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('records');
        },
    });
};
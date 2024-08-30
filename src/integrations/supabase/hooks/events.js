import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### events

| name        | type                     | format | required |
|-------------|--------------------------|--------|----------|
| id          | int8                     | number | true     |
| name        | text                     | string | true     |
| date        | date                     | string | true     |
| location    | text                     | string | true     |
| description | text                     | string | false    |
| created_at  | timestamp with time zone | string | false    |

*/

export const useEvents = (userId) => useQuery({
    queryKey: ['events', userId],
    queryFn: () => fromSupabase(
      supabase.from('events')
        .select('*')
        .eq('user_id', userId)
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
    ),
});

export const useAddEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newEvent) => fromSupabase(supabase.from('events').insert([newEvent])),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['events', variables.user_id]);
        },
    });
};

export const useUpdateEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, user_id, ...updateData }) => fromSupabase(supabase.from('events').update(updateData).eq('id', id).eq('user_id', user_id)),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['events', variables.user_id]);
        },
    });
};

export const useDeleteEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, user_id }) => fromSupabase(supabase.from('events').delete().eq('id', id).eq('user_id', user_id)),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['events', variables.user_id]);
        },
    });
};

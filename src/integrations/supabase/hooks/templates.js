import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

export const useTemplates = (userId) => useQuery({
    queryKey: ['templates', userId],
    queryFn: () => fromSupabase(supabase.from('templates').select('*').or(`user_id.eq.${userId},is_admin_template.eq.true`)),
});

export const useAddTemplate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newTemplate) => fromSupabase(supabase.from('templates').insert([newTemplate])),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['templates', variables.user_id]);
        },
    });
};

export const useUpdateTemplate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, user_id, ...updateData }) => fromSupabase(supabase.from('templates').update(updateData).eq('id', id).eq('user_id', user_id)),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['templates', variables.user_id]);
        },
    });
};

export const useDeleteTemplate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, user_id }) => fromSupabase(supabase.from('templates').delete().eq('id', id).eq('user_id', user_id)),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['templates', variables.user_id]);
        },
    });
};
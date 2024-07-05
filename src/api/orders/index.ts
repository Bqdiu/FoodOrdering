import { supabase } from "@/src/lib/supabase"
import { useAuth } from "@/src/providers/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { InsertTables, UpdateTables } from "@/src/types";

export const useAdminOrderList = ({ archive = false }) => {
    const statuses = archive ? ['Delivered'] : ['New', 'Cooking', 'Delivering'];
    return useQuery({
        queryKey: ['orders', { archive }],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .in('status', statuses)
                .order('created_at', { ascending: false });
            if (error) {
                throw new Error(error.message);
            }
            return data;
        }
    })
}

export const useUserOrderList = () => {
    const { session } = useAuth();
    const id = session?.user.id;
    return useQuery({
        queryKey: ['orders', { user_id: id }],
        queryFn: async () => {
            if (!id) return null;
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', id)
                .order('created_at', { ascending: false });
            if (error) {
                throw new Error(error.message);
            }
            return data;
        }
    })
}


export const useOrderDetails = (id: number) => {
    return useQuery({
        queryKey: ['orders', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('*, order_items(*, products(*))')
                .eq('id', id)
                .single();
            if (error) {
                throw new Error(error.message);
            }
            return data;
        }
    })
}

export const useInsertOrder = () => {
    const queryClient = useQueryClient();
    const { session } = useAuth();
    const userID = session?.user.id;
    return useMutation({
        async mutationFn(data: InsertTables<'orders'>) {
            const { error, data: newOrder } = await supabase
                .from('orders')
                .insert(data)
                .select()
                .single();
            if (error) {
                throw new Error(error.message);
            }
            return newOrder;
        },
        // invalidate the cache to synchronous  display new order
        async onSuccess() {
            await queryClient.invalidateQueries({ queryKey: ['orders', { user_id: userID }] });
        },
    })
}

export const useUpdateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        async mutationFn({ id, updatedFields }: { id: number, updatedFields: UpdateTables<'orders'> }) {
            const { data: udpatedOrder, error } = await supabase
                .from('orders')
                .update(updatedFields)
                .eq('id', id)
                .single();
            if (error) {
                throw new Error(error.message);
            }
            return udpatedOrder;
        },
        async onSuccess(_, { id }) {
            await queryClient.invalidateQueries({ queryKey: ['orders'] });
            await queryClient.invalidateQueries({ queryKey: ['orders', id] });
        },
    })
}

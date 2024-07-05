import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InsertTables } from "@/src/types";
import { supabase } from "@/src/lib/supabase";

export const useInsertOrderItems = () => {
    return useMutation({
        async mutationFn(items: InsertTables<'order_items'>[]) {
            const { error, data: newOrderItems } = await supabase
                .from('order_items')
                .insert(items)
                .select();
            if (error) {
                throw new Error(error.message);
            }
            return newOrderItems;
        },
    })
}
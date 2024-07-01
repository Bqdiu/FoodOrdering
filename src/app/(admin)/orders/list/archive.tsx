import { ActivityIndicator, FlatList, Text } from 'react-native';
import React from 'react'
import { Stack } from 'expo-router'
import orders from '@/assets/data/orders'
import OrdersListItem from '@/src/components/OrdersListItem';
import { useAdminOrderList } from '@/src/api/orders';


const OrdersScreen = () => {
    const { data: orders, isLoading, error } = useAdminOrderList({ archive: true });
    if (isLoading) {
        return <ActivityIndicator />
    }

    if (error) {
        return <Text>Failed to fetch</Text>
    }
    return (
        <>
            <Stack.Screen options={{ title: 'Archive' }} />
            <FlatList
                data={orders}
                renderItem={({ item }) => <OrdersListItem order={item} />}
                contentContainerStyle={{ gap: 10, padding: 10 }}
                
            />
        </>
    );
}

export default OrdersScreen
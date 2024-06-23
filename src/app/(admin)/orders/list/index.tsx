import { FlatList, Text } from 'react-native';
import React from 'react'
import { Stack } from 'expo-router'
import orders from '@/assets/data/orders'
import OrdersListItem from '@/src/components/OrdersListItem';


const OrdersScreen = () => {
    return (
        <>
            <Stack.Screen options={{ title: 'Active' }} />
            <FlatList
                data={orders}
                renderItem={({ item }) => <OrdersListItem order={item} />}
                contentContainerStyle={{ gap: 10, padding: 10 }}
                
            />
        </>
    );
}

export default OrdersScreen
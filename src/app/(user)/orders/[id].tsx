import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import OrderItemListItem from '@/src/components/OrderItemListItem';
import OrdersListItem from '@/src/components/OrdersListItem';
import { useOrderDetails } from '@/src/api/orders';
import { useUpdateOrderSubscription } from '@/src/api/orders/subscriptions';

const OrderDetailScreen = () => {
    const { id: idString } = useLocalSearchParams(); const idStringValue = typeof idString === 'string' ? idString : Array.isArray(idString) ? idString[0] : "";
    const id = parseFloat(idStringValue);
    const { data: order, isLoading, error } = useOrderDetails(id);
    useUpdateOrderSubscription(id);
    if (isLoading) {
        return <ActivityIndicator />
    }

    if (error) {
        return <Text>Failed to fetch</Text>
    }


    if (!order) {
        return <Text>Order not found</Text>
    }

    console.log(order);
    

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: `Order #${order.id}` }} />
            <FlatList
                data={order.order_items}
                renderItem={({ item }) => <OrderItemListItem item={item} />}
                ListHeaderComponent={<OrdersListItem order={order} />}
                contentContainerStyle={{ padding: 10, gap: 10 }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        gap: 10
    }
});

export default OrderDetailScreen 
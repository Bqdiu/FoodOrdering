import { View, Text, FlatList, StyleSheet } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import orders from '@/assets/data/orders';
import ProductListItem from '@/src/components/ProductListItem';
import OrderItemListItem from '@/src/components/OrderItemListItem';
import OrdersListItem from '@/src/components/OrdersListItem';

const OrderDetailScreen = () => {
    const { id } = useLocalSearchParams();
    const order = orders.find((o) => o.id.toString() === id);

    if (!order) {
        return <Text>Order not found</Text>
    }
    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: `Order #${order.id}` }} />
            <FlatList
                data={order.order_items}
                renderItem={({item}) => <OrderItemListItem item = {item}  />}
                ListHeaderComponent={<OrdersListItem order={order} />}
                contentContainerStyle={{padding: 10, gap: 10}}
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
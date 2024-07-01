import { View, Text, FlatList, StyleSheet, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import OrderItemListItem from '@/src/components/OrderItemListItem';
import OrdersListItem from '@/src/components/OrdersListItem';
import { OrderStatusList } from '@/src/types';
import Colors from '@/src/constants/Colors';
import { useOrderDetails } from '@/src/api/orders';

const OrderDetailScreen = () => {
    const { id: idString } = useLocalSearchParams(); const idStringValue = typeof idString === 'string' ? idString : Array.isArray(idString) ? idString[0] : "";
    const id = parseFloat(idStringValue);
    const { data: order, isLoading, error } = useOrderDetails(id);
    if (isLoading) {
        return <ActivityIndicator />
    }

    if (error) {
        return <Text>Failed to fetch</Text>
    }


    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: `Order #${order?.id}` }} />
            <FlatList
                data={order.order_items}
                renderItem={({ item }) => <OrderItemListItem item={item} />}
                contentContainerStyle={{ padding: 10, gap: 10 }}
                ListHeaderComponent={<OrdersListItem order={order} />}
                ListFooterComponent={
                    <>
                        <Text style={{ fontWeight: 'bold' }}>Status</Text>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            {OrderStatusList.map((status) => (
                                <Pressable
                                    key={status}
                                    onPress={() => console.warn('Update status')}
                                    style={{
                                        borderColor: Colors.light.tint,
                                        borderWidth: 1,
                                        padding: 10,
                                        borderRadius: 5,
                                        marginVertical: 10,
                                        backgroundColor:
                                            order?.status === status
                                                ? Colors.light.tint
                                                : 'transparent',
                                    }}
                                >
                                    <Text
                                        style={{
                                            color:
                                                order?.status === status ? 'white' : Colors.light.tint,
                                        }}
                                    >
                                        {status}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </>
                }
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
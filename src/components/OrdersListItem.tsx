import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { Order, Tables } from '../types'
import { Link, useSegments } from 'expo-router';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';

dayjs.extend(relativeTime);

type OrderListItemProps = {
    order: Tables<'orders'>;
}

const OrdersListItem = ({ order }: OrderListItemProps) => {
    const segment = useSegments();
    return (
        <Link href={`/${segment[0]}/orders/${order.id}`} asChild>
            <Pressable style={styles.container}>
                <View>
                    <Text style={styles.title}>Order #{order.id}</Text>
                    <Text style={styles.time}>{dayjs(order.created_at).fromNow()}</Text>
                </View>
                <Text style={styles.status}>{order.status}</Text>

            </Pressable>
        </Link>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center'
    },
    title: {
        fontWeight: 'bold',
    },
    time: {
        color: 'gray',
        marginTop: 5
    },
    status: {
        fontWeight: '600'
    }
});

export default OrdersListItem
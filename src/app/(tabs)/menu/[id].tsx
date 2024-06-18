import { Text, View } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'

const ProductDetailsSreen = () => {
    const { id } = useLocalSearchParams();
    return (
        <View>
            <Stack.Screen options={{ title: 'Detail ' + id }} /> 
            <Text style={{ fontSize: 30 }}>ID: {id}</Text>
        </View>
    )
}

export default ProductDetailsSreen;

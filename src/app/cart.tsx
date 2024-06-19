import { View, Text, Platform } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'

import {  useCart } from '../providers/CartProvider';

const CartSreen = () => {

  const { items } = useCart();

  return (
    <View>
      <Text>Cart items length: {items.length}</Text>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  )
}

export default CartSreen
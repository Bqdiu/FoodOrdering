import { Image, Text, View, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams, useRouter, Link } from 'expo-router'
import products from '@/assets/data/products'
import { defaultPizzaImage } from '@/src/components/ProductListItem'
import { useState } from 'react'
import Button from '@/src/components/Button'
import { useCart } from '@/src/providers/CartProvider'
import { PizzaSize } from '@/src/types'
import { FontAwesome } from '@expo/vector-icons'
import Colors from '@/src/constants/Colors'
const sizes : PizzaSize[] = ['S', 'M', 'L', 'XL'];



const ProductDetailsSreen = () => {
    // get product id
    const { id } = useLocalSearchParams();

    const { addItem } = useCart();

    const router = useRouter();

    const [selectedSize, setSelectedSize] = useState<PizzaSize>('M');

    const product = products.find((p) => p.id.toString() === id)

    // function add to cart 
    const addToCart = () => {
        if(!product)
            return
        addItem(product,selectedSize);
        router.push('/cart');
    }
    if (!product) {
        return <Text>Product not found</Text>
    }
    return (
        <View style={styles.container}>

            <Stack.Screen
                options={{
                    title: 'Menu', headerRight: () => (
                        <Link href={`/(admin)/menu/create?id=${id}`} asChild>
                            <Pressable>
                                {({ pressed }) => (
                                    <FontAwesome
                                        name="pencil"
                                        size={25}
                                        color={Colors.light.tint}
                                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                                    />
                                )}
                            </Pressable>
                        </Link>
                    ),
                }} />
            <Stack.Screen options={{ title: product.name }} />
            <Image
                source={{ uri: product.image || defaultPizzaImage }}
                style={styles.image}
                resizeMode='contain' />
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>${product.price}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        padding: 10
    },
    image: {
        width: '100%',
        aspectRatio: 1
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        marginVertical: 10,
        fontWeight: '600',
    },

})

export default ProductDetailsSreen;

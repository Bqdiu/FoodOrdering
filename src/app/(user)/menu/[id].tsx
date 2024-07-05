import { Image, Text, View, StyleSheet, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { defaultPizzaImage } from '@/src/components/ProductListItem'
import { useState } from 'react'
import Button from '@/src/components/Button'
import { useCart } from '@/src/providers/CartProvider'
import { PizzaSize } from '@/src/types'
import { useProduct } from '@/src/api/products'
const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL'];



const ProductDetailsSreen = () => {
    // get product id
    const { id: idString } = useLocalSearchParams();
    const idStringValue = typeof idString === 'string' ? idString : Array.isArray(idString) ? idString[0] : "";
    const id = parseFloat(idStringValue);
    const { data: product, error, isLoading } = useProduct(id);
    
    const { addItem } = useCart();

    const router = useRouter();

    const [selectedSize, setSelectedSize] = useState<PizzaSize>('M');

    // function add to cart 
    const addToCart = () => {
        if (!product)
            return
        addItem(product, selectedSize);
        router.push('/cart');
    }
    if (isLoading) {
        return <ActivityIndicator />
    }

    if (error || !product) {
        return <Text>Failed to fetch products</Text>
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: product.name }} />
            <Image
                source={{ uri: product.image || defaultPizzaImage }}
                style={styles.image}
                resizeMode='contain' />
            <Text style={styles.subtitle}>Select size</Text>
            <View style={styles.sizes}>
                {sizes.map((size) =>
                    <Pressable
                        onPress={() => { setSelectedSize(size) }}
                        key={size} style={[
                            styles.size,
                            {
                                backgroundColor: selectedSize === size ? 'gainsboro' : 'white'
                            }
                        ]}>
                        <Text style={[
                            styles.sizeText,
                            {
                                color: selectedSize === size ? 'black' : 'gray'
                            }
                        ]}>{size}</Text>
                    </Pressable>
                )}
            </View>
            <Text style={styles.price}>${product.price}</Text>

            <Button onPress={addToCart} text='Add to cart' />
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
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 'auto'
    },
    subtitle: {
        marginVertical: 10,
        fontWeight: '600',
    },
    sizes: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 15
    },
    size: {
        backgroundColor: 'gainsboro',
        width: 50,
        aspectRatio: 1,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sizeText: {
        fontSize: 20,
        fontWeight: 500
    }

})

export default ProductDetailsSreen;

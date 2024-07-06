import { Image, Text, View, StyleSheet, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams, Link } from 'expo-router'
import { defaultPizzaImage } from '@/src/components/ProductListItem'
import { PizzaSize } from '@/src/types'
import { FontAwesome } from '@expo/vector-icons'
import Colors from '@/src/constants/Colors'
import { useProduct } from '@/src/api/products'
import RemoteImage from '@/src/components/RemoteImage'
const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL'];



const ProductDetailsSreen = () => {
    // get product id
    const { id: idString } = useLocalSearchParams();
    const idStringValue = typeof idString === 'string' ? idString : Array.isArray(idString) ? idString[0] : "";
    const id = parseFloat(idStringValue);
    const { data: product, error, isLoading } = useProduct(id);

    if (isLoading) {
        return <ActivityIndicator />
    }

    if (error) {
        return <Text>Failed to fetch products</Text>
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
            <Stack.Screen options={{ title: product?.name }} />
            <RemoteImage
                path={product?.image}
                fallback={defaultPizzaImage}
                style={styles.image}
                resizeMode='contain'
            />
            <Text style={styles.title}>{product?.name}</Text>
            <Text style={styles.price}>${product?.price}</Text>
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

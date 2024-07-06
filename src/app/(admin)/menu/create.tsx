import { View, Text, StyleSheet, TextInput, Image, Keyboard, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Button from '@/src/components/Button';
import { defaultPizzaImage } from '@/src/components/ProductListItem';
import Colors from '@/src/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useDeleteProduct, useInsertProduct, useProduct, useUpdateProduct } from '@/src/api/products';
import * as FileSystem from 'expo-file-system'
import { randomUUID } from 'expo-crypto';
import { supabase } from '@/src/lib/supabase';
import { decode } from 'base64-arraybuffer';
const CreateProductScreen = () => {

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [errors, setErrors] = useState('');
    const [image, setImage] = useState<string | null>(null);

    const { id: idString } = useLocalSearchParams();
    const idStringValue = typeof idString === 'string' ? idString : Array.isArray(idString) ? idString[0] : "";
    const id = parseFloat(idStringValue);
    const isUpdating = !!id;

    const { mutate: insertProduct } = useInsertProduct();
    const { mutate: updateProduct } = useUpdateProduct();
    const { mutate: deleteProduct } = useDeleteProduct();
    const { data: updatingProduct } = useProduct(id);


    useEffect(() => {
        if (updatingProduct) {
            setName(updatingProduct.name);
            setPrice(updatingProduct.price.toString());
            setImage(updatingProduct.image);
        }
    }, [updatingProduct])

    const router = useRouter();

    const resetFields = () => {
        setName('');
        setPrice('');
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const validateInput = () => {
        if (!name) {
            setErrors('Name is required');
            return false;
        }
        if (!price) {
            setErrors('Price is required');
            return false;
        }

        if (isNaN(parseFloat(price))) {
            setErrors('Price is not a number');
            return false;
        }
        return true;
    };

    const onSubmit = () => {
        if (isUpdating) {
            // update
            onUpdate();
        } else {
            //create
            onCreate();
        }
    };
    const onCreate = async () => {
        if (!validateInput()) {
            return;
        }
        const imagePath = await uploadImage();
        // Save in the database
        insertProduct(
            { name, price: parseFloat(price), image: imagePath },
            {
                onSuccess: () => {
                    resetFields();
                    router.back();
                },
            }
        );
    };

    const onUpdate = async () => {
        if (!validateInput()) {
            return;
        }
        const imagePath = await uploadImage();
        updateProduct({ id, name, price: parseFloat(price), image: imagePath }, {
            onSuccess: () => {
                resetFields();
                router.back();
            }
        })
    };

    const onDelete = () => {
        deleteProduct(id, {
            onSuccess: () => {
                resetFields();
                router.replace('/(admin)');
            }
        })
    };

    const confimDelete = () => {
        Alert.alert('Comfirm', 'Are you sure you want to delete this product', [
            {
                text: 'Cancel'
            },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: onDelete
            },
        ])
    };
    // upload image to supabase storage
    const uploadImage = async () => {
        if (!image?.startsWith('file://')) {
            return;
        }

        const base64 = await FileSystem.readAsStringAsync(image, {
            encoding: 'base64',
        });
        const filePath = `${randomUUID()}.png`;
        const contentType = 'image/png';

        const { data, error } = await supabase.storage
            .from('product-images')
            .upload(filePath, decode(base64), { contentType });

        console.log(error);

        if (data) {
            return data.path;
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: isUpdating ? "Update Product" : 'Create Product' }} />
            <Image source={{ uri: image || defaultPizzaImage }} style={styles.img} />
            <Text
                style={styles.textButton}
                onPress={pickImage}
            >
                Select Image</Text>
            <Text style={styles.label}>Name</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder='Name'
                placeholderTextColor={'gray'}
                style={styles.input}
            />
            <Text style={styles.label}>Price ($)</Text>
            <TextInput
                value={price}
                onChangeText={setPrice}
                style={styles.input}
                keyboardType='numeric'
                returnKeyType='done'
            />
            <Text style={{ color: 'red' }}>{errors}</Text>
            <Button text={isUpdating ? "Update" : "Create"} onPress={onSubmit} />
            {isUpdating && <Text onPress={confimDelete} style={styles.textButton}>Delete</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 10
    },
    img: {
        width: '50%',
        aspectRatio: 1,
        alignSelf: 'center'
    },
    textButton: {
        alignSelf: 'center',
        fontWeight: 'bold',
        marginVertical: 10,
        color: Colors.light.tint
    },
    label: {
        color: 'grey'
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        marginTop: 5,
        marginBottom: 10
    }
});

export default CreateProductScreen
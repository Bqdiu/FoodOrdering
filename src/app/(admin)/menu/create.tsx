import { View, Text, StyleSheet, TextInput, Image, Keyboard } from 'react-native'
import React, { useState } from 'react'
import Button from '@/src/components/Button';
import { defaultPizzaImage } from '@/src/components/ProductListItem';
import Colors from '@/src/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { Stack } from 'expo-router';

const create = () => {

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [errors, setErrors] = useState('');
    const [image, setImage] = useState<string | null>(null);

    const resetField = () => {
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

        console.log(result);

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

    const onCreate = () => {
        if (!validateInput()) {
            return;
        }
        console.warn('Creating product: ', name);
        // Save in the database

        resetField();
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{title: 'Create Product'}} />
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
                style={styles.input}
            />
            <Text style={styles.label}>Price ($)</Text>
            <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder='Name'
                style={styles.input}
                keyboardType='numeric'
                returnKeyType='done'
            />

            <Text style={{ color: 'red' }}>{errors}</Text>
            <Button text='Create' onPress={onCreate} />
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

export default create
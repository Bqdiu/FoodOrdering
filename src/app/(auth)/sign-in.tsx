import Button from '@/src/components/Button';
import Colors from '@/src/constants/Colors';
import { Link, Stack } from 'expo-router';
import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'

function SignInScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    
    return (
        <View style={styles.container}>
            <Stack.Screen options={{title: 'Sign in'}} />
            <Text style={styles.label}>Email</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.textInput}
                placeholder='peter@gmail.com'
                placeholderTextColor={'gray'}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
                value={password}
                onChangeText={setPassword}
                style={styles.textInput}
            />

            <Button text='Sign in' />
            <Link href="/sign-up" style={styles.textButton}>
                Create an account
            </Link>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20
    },
    label: {
        color: 'gray'
    },
    textInput: {
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'gray',
    },
    textButton: {
        color: Colors.light.tint,
        alignSelf: 'center',
        marginTop: 15,
        fontWeight: 'bold'
    }
});

export default SignInScreen
import { Stack } from 'expo-router';
import { StyleSheet, View, Text, Button, TextInput } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';
import APIProvider, { useAPI } from '../components/APIProvider';
import { useEffect, useState } from 'react';
import { APIError } from '../components/APIError';

export default function Home()
{

    const { logged_in, login } = useAPI();
    const [email, set_email] = useState("");
    const [password, set_password] = useState("");
    const [error, set_error] = useState("");

    useEffect(() =>
    {

    }, [logged_in]);

    if (logged_in) return (
        <>
            <Stack.Screen options={{ title: 'Tab One' }} />
            <View style={styles.container}>
                <ScreenContent path="app/(tabs)/index.tsx" title="Tab One" />
                <Text>YOU ARE LOGGED IN</Text>
            </View>
        </>
    );

    return (
        <>
            <Stack.Screen options={{ title: 'Tab One' }} />
            <View style={styles.container}>
                <ScreenContent path="app/(tabs)/index.tsx" title="Tab One" />
                <Text>{error}</Text>
                <TextInput onChangeText={set_email} placeholder='email' />
                <TextInput onChangeText={set_password} placeholder='password' />
                <Button onPress={() => 
                {
                    login(email, password)
                        .then(() =>
                        {
                            // Done (should cause reload)
                        })
                        .catch((e: APIError) =>
                        {
                            set_error(e.message)
                        })
                }} title='Login' />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
});

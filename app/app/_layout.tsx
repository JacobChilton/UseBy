import '../global.css';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import APIProvider, { useAPI } from './components/APIProvider'; // Adjust path as necessary
import * as React from 'react';
import ImageCache from '~/components/ImageCache';



function RootLayoutNav()
{
    const router = useRouter();
    const segments = useSegments();
    const { logged_in } = useAPI();

    useEffect(() =>
    {
        const inProtectedRoute = segments[0] === '(tabs)';

        if (!logged_in && inProtectedRoute)
        {
            router.replace('/login');
        } else if (logged_in && segments[0] !== '(tabs)')
        {
            router.replace('/(tabs)');
        }
    }, [logged_in, segments, router]);

    if (logged_in) return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    )

    else return (
        <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
        </Stack>
    );
}

export default function RootLayout()
{
    return (
        <APIProvider> {/* <-- Must wrap your layout here */}
            <ImageCache>
                <RootLayoutNav />
            </ImageCache>
        </APIProvider>
    );
}
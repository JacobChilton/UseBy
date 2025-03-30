import { Stack } from 'expo-router';
import { StyleSheet, View, Text, Button, TextInput, TouchableOpacity } from 'react-native';
import { ScreenContent } from '~/components/ScreenContent';
import APIProvider, { useAPI } from '../components/APIProvider';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
export default function Home()
{


    return (
        <View>
            <Text>
                Yes nav
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
});

import { Stack } from 'expo-router';
import { StyleSheet, View, Text, Button, TextInput } from 'react-native';
import { ScreenContent } from '~/components/ScreenContent';
import APIProvider, { useAPI } from '../components/APIProvider';
import { useEffect, useState } from 'react';

export default function Profile()
{


    return (
        <View>
            <Text>
                profile page
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

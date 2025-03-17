import { Stack } from 'expo-router';
import { StyleSheet, View, Text, Button, TextInput } from 'react-native';
import { ScreenContent } from '~/components/ScreenContent';
import APIProvider, { useAPI } from '../components/APIProvider';
import { useEffect, useState } from 'react';

export default function MyFood()
{


    return (
            <View>
            <Text>
                myFood
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

import { Stack } from 'expo-router';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { Button, IconButton, Avatar, TextInput, DefaultTheme, PaperProvider, Text, Modal, Portal } from 'react-native-paper';
import { useAPI } from '../components/APIProvider';
import BarcodeScanner from '~/components/BarcodeScanner';
import ItemList from '~/components/ItemList';
import { Availability, Product } from '../lib/api/APITypes';
import PopupFormContents from '~/components/PopupFormContents';

export default function MyFood()
{
    const customTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            text: 'black',
            primary: '#6F4AAA',
        },
    };
    const [items, setItems] = useState<Array<Product>>([]);

    const api = useAPI();

    const refreshProductList = () => {

        api.house_product_get_all("67ebf33bc50778b4c4b6c531").then(setItems)
        .catch(console.error);
    }

    useEffect(() => {

        refreshProductList();

    }, [])

    return (
        <PaperProvider theme={customTheme}>
            <View className="flex-1 p-10 pt-28">
                <Text>myFood</Text>
                <ItemList products={items}/>
                <PopupFormContents />
            </View>
        </PaperProvider>
    );
}
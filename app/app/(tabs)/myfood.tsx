import { StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import { DefaultTheme, PaperProvider, Text } from 'react-native-paper';
import { useAPI } from '../components/APIProvider';
import ItemList from '~/components/ItemList';
import { Product } from '../lib/api/APITypes';
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
                <PopupFormContents formType="Add Item"/>
            </View>
        </PaperProvider>
    );
}
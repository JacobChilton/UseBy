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
    

    const api = useAPI();

    const [products, setProducts] = useState<Array<Product>>([]);

    return (
        <PaperProvider theme={customTheme}>
            <View className="flex-1 p-10 pt-28">
                <Text>myFood</Text>
                <ItemList passProducts={products} passSetProducts={setProducts}/>
                <PopupFormContents formType="Add Item" passProducts={products} passSetProducts={setProducts}/>
            </View>
        </PaperProvider>
    );
}
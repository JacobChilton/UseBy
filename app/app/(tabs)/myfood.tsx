import { StyleSheet, View, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { Text } from 'react-native-paper';
import { useAPI } from '../components/APIProvider';
import ItemList from '~/components/ItemList';
import { Product } from '../lib/api/APITypes';
import PopupFormContents from '~/components/PopupFormContents';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function MyFood()
{
    const api = useAPI();

    const [products, setProducts] = useState<Array<Product>>([]);

    return (
        <View className="flex-1 p-10 pt-28">
            <View style={styles.container}>
                <Text style={styles.text}>My Food</Text>
                <Ionicons name="list" size={24} color="grey" />
            </View>
            <ItemList passProducts={products} passSetProducts={setProducts} />
            <PopupFormContents formType="Add Item" passProducts={products} passSetProducts={setProducts} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 10,
        padding: 15,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Verdana-Bold' : 'monospace', // Use system font
    },
});
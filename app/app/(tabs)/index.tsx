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

    const [refresh, setRefresh] = useState<boolean>(false);
    
    const deleteItem = (itemID: string) => {

        console.log("deleting item: ");
        console.log(itemID);
        console.log("refresh value in delete:");
        console.log(refresh);
            console.log("setRefresh function:", setRefresh);

            api.house_product_delete("6806b5858798a785965c01f1", itemID).then(() => 
            {
                if (setRefresh) setRefresh(!refresh)
            })

    };

    useEffect(() => {

        async function refresh() {

            // Refresh product list
            try {
                const newData = await api.house_product_get_all("6806b5858798a785965c01f1");

                // Sort the product list by order of expiration
                newData.sort(function(a, b) {
                    return (a.use_by < b.use_by) ? -1 : ((a.use_by > b.use_by) ? 1 : 0);
                });

                setProducts(newData);
            }
            catch {
                console.error;
            }
            
        }
        refresh();

    }, [refresh]);

    return (
        <View className="flex-1 p-10 pt-28">
            <View style={styles.container}>
                <Text style={styles.text}>My Food</Text>
                <Ionicons name="list" size={24} color="grey" />
            </View>
            <ItemList passProducts={products} passSetProducts={setProducts} passDeleteItem={deleteItem}/>
            <PopupFormContents formType="Add Item" passRefresh={refresh} passSetRefresh={setRefresh} passDeleteItem={deleteItem}/>
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
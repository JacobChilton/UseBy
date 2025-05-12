import { StyleSheet, View, Platform, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { Button, Text } from 'react-native-paper';
import { useAPI } from '../components/APIProvider';
import ItemList from '~/components/ItemList';
import { Product } from '../lib/api/APITypes';
import PopupFormContents from '~/components/PopupFormContents';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AggHouse } from '../lib/api/aggregated';

export default function MyFood()
{
    const api = useAPI();

    const [products, setProducts] = useState<Array<Product>>([]);

    const [refresh, setRefresh] = useState<boolean>(false);

    const [houses, setHouses] = useState<Array<AggHouse>>([]);
    const [selectedHouse, setSelectedHouse] = useState<AggHouse>();

    const deleteItem = (itemID: string) =>
    {

        api.house_product_delete(selectedHouse?._id, itemID).then(() => 
        {
            if (setRefresh) setRefresh(!refresh)
        })

    };

    useEffect(() =>
    {

        api.house_get_all().then((houseData) =>
        {

            setHouses(houseData)

            if (!selectedHouse)
            {

                setSelectedHouse(houseData[0]);
            }
        }).catch(console.error)

    }, [])

    function selectHouse()
    {

        let dropdown = document.getElementById("houses");

        for (let house of houses)
        {

            if (house._id === dropdown.options[dropdown.selectedIndex].value)
            {

                setSelectedHouse(house);
            }
        }
    }

    useEffect(() =>
    {

        async function refresh()
        {

            // Refresh product list
            try
            {
                const newData = await api.house_product_get_all(selectedHouse._id);

                // Sort the product list by order of expiration
                newData.sort(function (a, b)
                {
                    return (a.use_by < b.use_by) ? -1 : ((a.use_by > b.use_by) ? 1 : 0);
                });

                setProducts(newData);
            }
            catch
            {
                console.error;
            }
        }
        refresh();

    }, [refresh, selectedHouse]);

    return (
        <View className="flex-1 pr-10 pl-10 pb-0 pt-10">
            <Text className="text-lg font-medium text-gray-700">
                Choose house list
            </Text>

            {/*houses.map((item, index) => (
                    
                    <Text key={item.name} value={item._id}>
                        {item.name}
                    </option>
                ))*/}

            <ItemList
                selectedHouse={selectedHouse}
                passProducts={products}
                passSetProducts={setProducts}
                passDeleteItem={deleteItem}
                passSetRefresh={setRefresh}
                passRefresh={refresh}
            />
            <PopupFormContents
                formType="Add Item"
                selectedHouse={selectedHouse}
                passRefresh={refresh}
                passSetRefresh={setRefresh}
                passDeleteItem={deleteItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
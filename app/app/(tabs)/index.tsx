import { StyleSheet, View, Platform, TouchableOpacity } from 'react-native';
import { SetStateAction, useEffect, useState } from 'react';
import { Button, Text } from 'react-native-paper';
import { useAPI } from '../components/APIProvider';
import ItemList from '~/components/ItemList';
import { Product } from '../lib/api/APITypes';
import PopupFormContents from '~/components/PopupFormContents';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AggHouse } from '../lib/api/aggregated';
import { SelectList } from 'react-native-dropdown-select-list';
import { updator } from '../lib/invalidator';

const Updator = () =>
{
    const api = useAPI();

    const [products, setProducts] = useState<Array<Product>>([]);

    const [refresh, setRefresh] = useState<boolean>(false);

    const [houses, setHouses] = useState<Array<AggHouse>>([]);
    const [defaultHouse, setDefaultHouse] = useState<{ key: string, value: string }>();
    const [selectedHouse, setSelectedHouse] = useState<AggHouse>();

    useEffect(() =>
    {

        if (houses[0])
        {
            const house = houses[0];
            const houseOption = { key: house._id, value: house.name };
            setDefaultHouse(houseOption);
        }

    }, [houses])

    if (!api.logged_in) return <></>

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

    useEffect(() =>
    {

        async function refresh()
        {
            console.log("refrsehing")
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

            <SelectList
                setSelected={(val: string) =>
                {
                    setSelectedHouse(houses.find(h => h.name === val))
                }}
                data={houses.map(h => ({ key: h._id, value: h.name }))}
                save="value"
                defaultOption={defaultHouse}
            >
            </SelectList>

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
})

export default function MyFood()
{
    const { ugly_duckling } = useAPI();

    return <Updator key={ugly_duckling} />
};
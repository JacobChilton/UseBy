import { StyleSheet, Touchable, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { DefaultTheme, Icon, PaperProvider, Text } from 'react-native-paper';
import { useAPI } from '../components/APIProvider';
import ItemList from '~/components/ItemList';
import { House, Product } from '../lib/api/APITypes';
import PopupFormContents from '~/components/PopupFormContents';
import HouseList from '~/components/HouseList';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

    const [houses, setHouses] = useState<Array<House>>([]);
    const [loading, setLoading] = useState(false);
    const [showCreateHouseModal, setShowCreateHouseModal] = useState(false);

    const { top } = useSafeAreaInsets()

    useEffect(() =>
    {
        setLoading(true);
        api.house_get_all()
            .then((h) =>
            {
                setHouses(h);
                setLoading(false);
            })
            .catch(console.error)
    }, [])

    if (loading) return <PaperProvider theme={customTheme}>
        <Text>Loading</Text>
    </PaperProvider>

    return (
        <PaperProvider theme={customTheme}>
            <View className="flex-1 p-10 pt-28 gap-8">
                <Text className='text-2xl'>Houses</Text>
                <HouseList houses={houses} />
                <TouchableOpacity
                    className={`bg-purple-600 p-4 rounded-lg`}
                    onPress={() =>
                    {
                        setShowCreateHouseModal(true);
                    }}
                >
                    <FontAwesome icon="fa-solid fa-plus" size={30} />
                </TouchableOpacity>
            </View>
        </PaperProvider>
    );
}
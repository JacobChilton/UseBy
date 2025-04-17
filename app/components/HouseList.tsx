import { useCallback, useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Button, Portal, Modal } from 'react-native-paper';
import { House, Product, UserID } from '~/app/lib/api/APITypes';
import { useAPI } from '~/app/components/APIProvider';
import PopupFormContents from './PopupFormContents';
import HouseCard from './HouseCard';
import { reload } from 'expo-router/build/global-state/routing';

interface Props
{
    houses: Array<House>,
    reload?: () => void,
    user: string,
    title?: string,
    invite: () => Promise<string>
}

const HouseList: React.FC<Props> = ({ houses, reload, user, title, invite }) =>
{
    if (!user) return <Text>Loading</Text>

    if (houses.length === 0) return <></>

    return (
        <View>
            <Text className='text-xl'>{title}</Text>
            <View className="mt-4 gap-4">
                {houses.map((h) => <HouseCard
                    invite={invite}
                    house={h}
                    user={user}
                    key={h._id}
                    removed={() => { if (reload) reload() }}
                />)}
                {houses.length === 0 && <Text>No houses here!</Text>}
            </View>
        </View>)
}

export default HouseList;
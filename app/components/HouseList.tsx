import { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Button, Portal, Modal } from 'react-native-paper';
import { House, Product, UserID } from '~/app/lib/api/APITypes';
import { useAPI } from '~/app/components/APIProvider';
import PopupFormContents from './PopupFormContents';
import HouseCard from './HouseCard';

interface Props
{
    houses: Array<House>
}

const HouseList: React.FC<Props> = ({ houses }) =>
{
    const [user, set_user] = useState("");
    const api = useAPI();

    useEffect(() =>
    {
        api.profile_get().then(u => set_user(u._id))
    }, [])

    if (!user) return <Text>Loading</Text>

    return (
        <View className="mt-4 gap-4 flex-1">
            {houses.map((h) => <HouseCard house={h} user={user} />)}
        </View>)
}

export default HouseList;
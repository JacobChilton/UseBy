import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native';
import { Avatar } from 'react-native-paper';
import { useAPI } from '~/app/components/APIProvider';
import { User, UserID } from '~/app/lib/api/APITypes';

interface Props
{
    name: string,
    id: UserID,
}

const UserMiniCard: React.FC<Props> = ({ name, id }) =>
{
    const [image, set_image] = useState("");

    const api = useAPI();

    useEffect(() =>
    {
        api.picture_get(id)
            .then(pic =>
            {
                if (pic) set_image(pic)
            })
            // No img
            .catch(() => { })
    }, [])

    return (
        <View className='flex-row gap-4'>
            {
                image ?
                    <Avatar.Image source={{ uri: image }} size={40} />
                    :
                    <Avatar.Icon size={40} icon="account" />
            }
            <Text className='text-lg flex-1 flex text-white items-center'>{name}</Text>
        </View>
    )
}

export default UserMiniCard;

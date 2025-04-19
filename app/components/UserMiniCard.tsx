import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native';
import { Avatar } from 'react-native-paper';
import { useAPI } from '~/app/components/APIProvider';
import { User, UserID } from '~/app/lib/api/APITypes';
import { useImageCache } from './ImageCache';

interface Props
{
    name: string,
    id: UserID,
}

const UserMiniCard: React.FC<Props> = ({ name, id }) =>
{
    const [image, set_image] = useState("");

    const cache = useImageCache();

    useEffect(() =>
    {
        cache.get_image(id).then(set_image)
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

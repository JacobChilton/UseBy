import React from 'react'
import { View, Text, TouchableOpacity } from "react-native"
import { useAPI } from '~/app/components/APIProvider'
import { House, UserID } from '~/app/lib/api/APITypes'

interface Props
{
    house: House,
    user: UserID // The logged in user is passed in, rather than called
    // Would prefer to have a cache inside useAPI, but dont have time
}

const HouseCard: React.FC<Props> = ({ house, user }) =>
{
    return (
        <View className='bg-purple-600 p-4 rounded-lg flex-row justify-between'>
            <View>
                <Text className='text-white text-xl'>{house.name}</Text>
                <Text className='text-white'>
                    {house.members.length + 1 /*+1 to account for owner*/} Member{!!house.members.length && "s"}
                </Text>
            </View>
            {
                house.owner_id === user ?
                    <TouchableOpacity className='h-full text-center justify-center px-2 bg-white rounded-lg'>
                        <Text className='text-lg text-purple-700 font'>Add Members</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity className='h-full text-center justify-center px-2 bg-white rounded-lg'>
                        <Text className='text-lg text-purple-700 font'>Leave</Text>
                    </TouchableOpacity>
            }

        </View>
    )
}

export default HouseCard

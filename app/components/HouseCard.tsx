import React, { useCallback, useMemo, useState } from 'react'
import { View, Text, TouchableOpacity } from "react-native"
import { Button } from 'react-native-paper'
import { useAPI } from '~/app/components/APIProvider'
import { House, UserID } from '~/app/lib/api/APITypes'

interface Props
{
    house: House,
    user: UserID, // The logged in user is passed in, rather than called
    // Would prefer to have a cache inside useAPI, but dont have time

    // Called if the house is removed, or user leaves the house
    removed?: () => void,
    invite: () => Promise<string>
}

const HouseCard: React.FC<Props> = ({ house, user, removed, invite }) =>
{
    const api = useAPI();
    const [open, set_open] = useState(false);

    const user_owned = user === house.owner_id;

    const leave_house = useCallback(() =>
        api.house_member_remove(house._id, user)
            .then(() =>
            {
                console.log("success");
                if (removed) removed();
            })
            .catch((e) =>
            {
                console.error(e);
            })
        , [house, user])

    const delete_house = useCallback(() =>
        api.house_delete(house._id)
            .then(() =>
            {
                console.log("success");
                if (removed) removed();
            })
            .catch((e) =>
            {
                console.error(e);
            })
        , [house, user])

    return (
        <TouchableOpacity
            className='bg-purple-600 p-4 rounded-lg gap-4'
            onPress={() => set_open(!open)}>
            <View className='flex-row justify-between'>
                <View>
                    <Text className='text-white text-xl'>{house.name}</Text>
                    <Text className='text-white'>
                        {house.members.length + 1 /*+1 to account for owner*/} Member{!!house.members.length && "s"}
                    </Text>
                </View>
                {
                    user_owned &&
                    <View>
                        <Button
                            onPress={() => { invite().then((u) => console.log({ ud: u })).catch(console.error) }}
                            buttonColor='#fff'
                            textColor='#9333ea'>
                            Invite
                        </Button>
                    </View>
                }
            </View>
            {
                open && (user_owned ?
                    <Button
                        onPress={delete_house}
                        buttonColor='#fff'
                        textColor='#9333ea'>
                        Delete
                    </Button>
                    :
                    <Button
                        onPress={leave_house}
                        buttonColor='#fff'
                        textColor='#9333ea'>
                        Leave
                    </Button>)
            }

        </TouchableOpacity>
    )
}

export default HouseCard

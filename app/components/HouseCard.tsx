import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { View, Text, TouchableOpacity, Image } from "react-native"
import { Avatar, Button } from 'react-native-paper'
import { useAPI } from '~/app/components/APIProvider'
import { AggHouse } from '~/app/lib/api/aggregated'
import { House, UserID } from '~/app/lib/api/APITypes'
import UserMiniCard from './UserMiniCard'

interface Props
{
    house: AggHouse,
    user: UserID, // The logged in user is passed in, rather than called
    // Would prefer to have a cache inside useAPI, but dont have time

    // Called if the house is removed, or user leaves the house
    removed?: () => void,
    invite: (p_house: string) => void
}

const HouseCard: React.FC<Props> = ({ house, user, removed, invite }) =>
{
    const api = useAPI();
    const [open, set_open] = useState(false);
    const [members, set_members] = useState(house.members);
    const [member_images, set_member_images] = useState<Map<UserID, string>>(new Map());

    // Load images
    useEffect(() =>
    {
        members.forEach(member =>
        {
            api.picture_get(member._id).then((pic) =>
            {
                if (!pic) return;
                set_member_images((old) => 
                {
                    old.set(member._id, pic);

                    // Recreate to redraw
                    return new Map(old)
                })
            })
        })
    }, [])

    const user_owned = user === house.owner_id;

    const leave_house = () => api.house_member_remove(house._id, user)
        .then(() =>
        {
            console.log("success");
            if (removed) removed();
        })
        .catch((e) =>
        {
            console.error(e);
        })

    const delete_house = () => api.house_delete(house._id)
        .then(() =>
        {
            console.log("success");
            if (removed) removed();
        })
        .catch((e) =>
        {
            console.error(e);
        });

    const kick_member = (p_user: string) => api.house_member_remove(house._id, p_user)
        .then(() =>
        {
            // Remove it locally to avoid reload
            set_members(members.filter(m => m._id !== p_user))
        })
        .catch((e) =>
        {
            console.error(e);
        });


    return (
        <TouchableOpacity
            className='bg-purple-600 p-4 rounded-lg gap-4'
            onPress={() => set_open(!open)}>
            <View className='flex-row justify-between'>
                <View>
                    <Text className='text-white text-xl'>{house.name}</Text>
                    <Text className='text-white'>
                        {members.length + 1 /*+1 to account for owner*/} Member{!!members.length && "s"}
                    </Text>
                </View>
                {
                    user_owned &&
                    <View>
                        <Button
                            onPress={() => { invite(house._id) }}
                            buttonColor='#fff'
                            textColor='#9333ea'>
                            Invite
                        </Button>
                    </View>
                }
            </View>
            {
                open && <>
                    {
                        (user_owned ?
                            <Button
                                onPress={delete_house}
                                buttonColor='#fff'
                                textColor='#9333ea'>
                                Delete
                            </Button>
                            :
                            <>
                                <Button
                                    onPress={leave_house}
                                    buttonColor='#fff'
                                    textColor='#9333ea'>
                                    Leave
                                </Button>
                                <Text className='text-white text-xl'>Owner:</Text>
                                <UserMiniCard name={house.owner_name} id={house.owner_id} />
                                <View
                                    style={{
                                        height: 1,
                                        width: "100%",
                                        backgroundColor: "white",
                                    }}
                                />
                            </>
                        )
                    }
                    {
                        members.length > 0 &&
                        <View className='gap-4'>

                            <Text className='text-white text-xl'>Members:</Text>
                            {
                                members.map(m =>
                                    <View key={m._id} className='flex-row align-middle justify-between'>
                                        <UserMiniCard name={m.name} id={m._id} />
                                        {
                                            user_owned &&
                                            <Button
                                                buttonColor='white'
                                                textColor='#9333ea'
                                                onPress={() => kick_member(m._id)}
                                            >Kick</Button>
                                        }
                                    </View>)
                            }
                        </View>
                    }
                </>
            }

        </TouchableOpacity>
    )
}

export default HouseCard

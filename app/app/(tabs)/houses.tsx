import { ScrollView, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, DefaultTheme, PaperProvider, Text } from 'react-native-paper';
import { useAPI } from '../components/APIProvider';
import { House, } from '../lib/api/APITypes';
import HouseList from '~/components/HouseList';
import CreateHouseModal from '~/components/CreateHouseModal';
import ProfileScanner from '~/components/ProfileScanner';
import { AggHouse } from '../lib/api/aggregated';

// I just realised ive been using the wrong purple. I will fix later

export const Houses = () =>
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
    const [houses, set_houses] = useState<Array<AggHouse>>([]);
    const [loading, set_loading] = useState(false);
    const [show_create_house_modal, set_show_create_house_modal] = useState(false);
    const [user, set_user] = useState("");
    const [scan_mode, set_scan_mode] = useState(false);
    const [selected_house, set_selected_house] = useState("");

    useEffect(() =>
    {
        api.profile_get().then(u => set_user(u._id))
        load_houses();
    }, [])

    const load_houses = () =>
    {
        set_loading(true);
        api.house_get_all()
            .then((h) =>
            {
                set_houses(h);
                set_loading(false);
            })
            .catch(console.error);
    }

    const invite_user = (p_id: string) =>
    {
        set_scan_mode(false);
        // Add user, then reload
        api.house_member_add(selected_house, p_id)
            .then(load_houses)
            .catch(console.error)
            .finally(() => set_selected_house(""))
    }

    if (loading) return <PaperProvider theme={customTheme}>
        <Text>Loading</Text>
    </PaperProvider>

    return (
        <PaperProvider theme={customTheme}>
            <CreateHouseModal
                created={load_houses}
                open={show_create_house_modal}
                hide={() => set_show_create_house_modal(false)}
            />
            <ProfileScanner
                visible={scan_mode}
                close={() => 
                {
                    set_scan_mode(false)
                }}
                user_scanned={(u) =>
                {
                    set_scan_mode(false);
                    invite_user(u);
                }} />
            <View className="flex-1 p-10 gap-8">
                <Text className='text-4xl'>Houses</Text>

                {
                    houses.length > 0 ?
                        <>
                            <ScrollView>
                                <HouseList
                                    invite={(house) =>
                                    {
                                        set_selected_house(house);
                                        set_scan_mode(true);
                                    }}
                                    user={user}
                                    houses={houses.filter(h => h.owner_id === user)}
                                    reload={load_houses}
                                    title='Your Houses' />
                                <View
                                    style={{
                                        height: 1,
                                        width: "100%",
                                        backgroundColor: "#9333ea",
                                        marginVertical: 20
                                    }}
                                />
                                <HouseList
                                    invite={(house) =>
                                    {
                                        set_selected_house(house);
                                        set_scan_mode(true);
                                    }}
                                    user={user}
                                    houses={houses.filter(h => h.owner_id !== user)}
                                    reload={load_houses}
                                    title='Joined Houses' />
                            </ScrollView>
                            <Button
                                textColor='white'
                                buttonColor='#9333ea'
                                onPress={() =>
                                {
                                    set_show_create_house_modal(true);
                                }}
                            >
                                Create House
                            </Button>
                        </>
                        :
                        <View className='justify-center items-center flex-1'>
                            <Button
                                buttonColor='#9333ea'
                                textColor='white'
                                onPress={() =>
                                {
                                    set_show_create_house_modal(true);
                                }}
                            >
                                <Text className='!text-white text-xl'>Fuck you. Create a house</Text>
                            </Button>
                        </View>
                }
            </View>
        </PaperProvider>
    );
}

export default Houses;
import { ScrollView, StyleSheet, Touchable, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, DefaultTheme, Icon, Modal, PaperProvider, Portal, Text, TextInput } from 'react-native-paper';
import { useAPI } from '../components/APIProvider';
import ItemList from '~/components/ItemList';
import { House, Product } from '../lib/api/APITypes';
import PopupFormContents from '~/components/PopupFormContents';
import HouseList from '~/components/HouseList';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { APIError } from '../lib/api/APIError';
import CreateHouseModal from '~/components/CreateHouseModal';
import { Camera, CameraView } from 'expo-camera';
import ProfileScanner from '~/components/ProfileScanner';

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

    const [houses, set_houses] = useState<Array<House>>([]);
    const [loading, set_loading] = useState(false);
    const [show_create_house_modal, set_show_create_house_modal] = useState(false);
    const [user, set_user] = useState("");
    const [scan_mode, set_scan_mode] = useState(false);
    const [got_scan, set_got_scan] = useState<(user: string) => void>();
    const [no_scan, set_no_scan] = useState<() => void>();

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

    const get_user_from_scan = (): Promise<string> =>
    {
        return new Promise<string>((res, rej) =>
        {
            set_scan_mode(true);
            set_got_scan((id: string) =>
            {
                set_got_scan(undefined);
                res(id)
            });
            set_got_scan(() =>
            {
                set_no_scan(undefined);
                rej()
            });
        })
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
                    console.log("CLOSED")
                    set_scan_mode(false)
                    if (no_scan) no_scan();
                }}
                user_scanned={(u) =>
                {
                    console.log({ up: u })
                    if (got_scan) got_scan(u);
                }} />
            <View className="flex-1 p-10 gap-8">
                <Text className='text-4xl'>Houses</Text>

                <ScrollView className='h-full'>
                    <HouseList
                        invite={get_user_from_scan}
                        user={user}
                        houses={houses.filter(h => h.owner_id === user)}
                        reload={load_houses}
                        title='Your Houses' />
                    <HouseList
                        invite={get_user_from_scan}
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
            </View>
        </PaperProvider>
    );
}
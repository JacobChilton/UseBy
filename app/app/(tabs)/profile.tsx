import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useAPI } from '../components/APIProvider';
import { Button, IconButton, Avatar, Text, Modal, Portal } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { User } from '../lib/api/APITypes';
import QRCode from "react-native-qrcode-svg"
import ImagePickerExample from '~/components/PictureInterface';
import ImageInterface from '~/components/PictureInterface';

export default function Profile()
{
    const [settingsModalVisible, setSettingsModalVisible] = useState(false);
    const [supportModalVisible, setSupportModalVisible] = useState(false);

    const [user, set_user] = useState<Omit<User, "password">>();
    const [img, set_img] = useState("");

    const api = useAPI();

    useEffect(() =>
    {
        load_user();
    }, [])

    const load_user = () =>
    {
        api.profile_get().then((u) =>
        {
            set_user(u);
            api.picture_get(u._id)
                .then((i) =>
                {
                    if (i) set_img(i)
                })
                .catch(console.error)
        }).catch(console.error);
    }

    if (!user) return <Text>Loading</Text>;

    return (
        <View className="flex-1 items-center p-10 pt-28">

            <Portal>
                <Modal
                    visible={settingsModalVisible}
                    onDismiss={() => setSettingsModalVisible(false)}
                    contentContainerStyle={{
                        backgroundColor: 'white',
                        padding: 20,
                        margin: 20,
                        borderRadius: 8,
                    }}
                >
                    <Text style={{ fontSize: 18, marginBottom: 20 }}> Settings page not yet implemented.</Text>
                    <Button mode="contained" onPress={() => setSettingsModalVisible(false)}>
                        Close
                    </Button>
                </Modal>
            </Portal>

            <Portal>
                <Modal
                    visible={supportModalVisible}
                    onDismiss={() => setSupportModalVisible(false)}
                    contentContainerStyle={{
                        backgroundColor: 'white',
                        padding: 20,
                        margin: 20,
                        borderRadius: 8,
                    }}
                >
                    <Text style={{ fontSize: 18, marginBottom: 20 }}> Support page not yet implemented.</Text>
                    <Button mode="contained" onPress={() => setSupportModalVisible(false)}>
                        Close
                    </Button>
                </Modal>
            </Portal>

            {
                user ? <QRCode
                    ecl="H"
                    value={user._id}
                    logo={img && { uri: img }}
                    logoSize={img ? 40 : undefined}
                    logoBackgroundColor='transparent'
                    logoMargin={5}
                    logoBorderRadius={20}
                    size={110} />
                    :
                    <Avatar.Icon size={120} icon="account" />
            }

            <ImageInterface on_chosen={(pic) =>
            {
                api.picture_upload(pic).then(load_user).catch(console.error)
            }} />

            <View className="h-12 w-80 flex-row items-center mt-16 border-2 border-gray-400 rounded-3xl">
                <IconButton
                    icon="account"
                    size={24}
                    className="ml-4 mt-2 m-0 p-0"
                />
                <Text className="ml-2 text-lg">{user.name}</Text>
            </View>

            <View className="h-12 w-80 flex-row items-center mt-4 border-2 border-gray-400 rounded-3xl">
                <IconButton
                    icon="email"
                    size={24}
                    className="ml-4 mt-2 m-0 p-0"
                />
                <Text className="ml-2 text-lg">{user.email}</Text>
            </View>

            <View className="h-12 w-80 flex-row items-center mt-4 border-2 border-gray-400 rounded-3xl">
                <IconButton
                    icon="home"
                    size={24}
                    className="ml-4 mt-2 m-0 p-0"
                />
                <Text className="ml-2 text-lg">Hello world</Text>
            </View>

            <View className="mt-16">
                <Button
                    mode="contained"
                    className="h-12 w-80 flex-row items-center rounded-3xl justify-center"
                    labelStyle={{ fontSize: 16, color: 'white' }}
                    onPress={() => setSettingsModalVisible(true)}
                >
                    Settings
                </Button>
            </View>

            <View className="mt-4">
                <Button
                    mode="contained"
                    className="h-12 w-80 flex-row items-center rounded-3xl justify-center"
                    labelStyle={{ fontSize: 16, color: 'white' }}
                    onPress={() => setSupportModalVisible(true)}
                >
                    Support
                </Button>
            </View>

            <View className="mt-4">
                <Button
                    mode="contained"
                    className="h-12 w-80 flex-row items-center rounded-3xl justify-center"
                    labelStyle={{ fontSize: 16, color: 'white'}}
                    onPress={() => api.logout()}
                >
                    Log Out
                </Button>
            </View>
        </View>
    )
}
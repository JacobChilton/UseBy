import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import APIProvider, { useAPI } from '../components/APIProvider';
import { Button, IconButton, Avatar, DefaultTheme, PaperProvider, Text, Modal, Portal } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { User } from '../lib/api/APITypes';


const customTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        text: 'black',
        primary: '#6F4AAA',
    },
};

export default function Profile()
{
    const [settingsModalVisible, setSettingsModalVisible] = useState(false);
    const [supportModalVisible, setSupportModalVisible] = useState(false);

    const [user, set_user] = useState<Omit<User, "password">>();

    const api = useAPI();

    useEffect(() =>
    {
        api.profile_get().then(set_user)
            .catch(console.log);
    }, [])

    if (!user) return <Text>Loading</Text>;

    return (

        <PaperProvider theme={customTheme}>
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
                        <Text style={{ fontSize: 18, marginBottom: 20 }}> Settings Modal!</Text>
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
                        <Text style={{ fontSize: 18, marginBottom: 20 }}> Support Modal!</Text>
                        <Button mode="contained" onPress={() => setSupportModalVisible(false)}>
                            Close
                        </Button>
                    </Modal>
                </Portal>

                <Avatar.Icon size={120} icon="account" />

                <View className="h-12 w-80 flex-row items-center mt-16 border-2 border-gray-400 rounded-3xl">
                    <IconButton
                        icon="account"
                        size={24}
                        className="ml-4 m-0 p-0"
                    />
                    <Text className="ml-2 text-lg">{user.name}</Text>
                </View>

                <View className="h-12 w-80 flex-row items-center mt-4 border-2 border-gray-400 rounded-3xl">
                    <IconButton
                        icon="email"
                        size={24}
                        className="ml-4 m-0 p-0"
                    />
                    <Text className="ml-2 text-lg">{user.email}</Text>
                </View>

                <View className="h-12 w-80 flex-row items-center mt-4 border-2 border-gray-400 rounded-3xl">
                    <IconButton
                        icon="home"
                        size={24}
                        className="ml-4 m-0 p-0"
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
                        labelStyle={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}
                    >
                        LOGOUT
                    </Button>
                </View>








            </View>
        </PaperProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
});

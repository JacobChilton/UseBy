import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useState } from 'react'
import { View, Text, Image } from 'react-native';
import { Button, Modal, Portal } from 'react-native-paper';
import { useAPI } from '~/app/components/APIProvider';
import { User, UserID } from '~/app/lib/api/APITypes';

interface Props
{
    visible: boolean,
    close: () => void,
    user_scanned: (p_user_id: UserID) => void
}

const ProfileScanner: React.FC<Props> = ({ visible, close, user_scanned }) =>
{
    const [scanned_id, set_scanned_id] = useState<UserID>("");
    const [user, set_user] = useState<Omit<User, "password" | "email">>();
    const [loading_user, set_loading_user] = useState(false);
    const [picture, set_picture] = useState("");
    const api = useAPI();
    const [permission, requestPermission] = useCameraPermissions();

    useEffect(() =>
    {
        if (!scanned_id)
        {
            set_user(undefined);
            set_picture("");
        }
        else
        {
            api.user_get(scanned_id).then((u) => 
            {
                set_user(u);
                if (u.picture) api.picture_get(u.picture).then((p) => set_picture(p || ""))
            }).catch(console.error)
        }
    }, [scanned_id])

    if (!visible) return <></>;

    if (!permission)
    {
        return <></>;
    }

    if (!permission.granted)
    {
        return (
            <View className='bg-red-500 justify-center items-center absolute top-0 left-0 bottom-0 right-0 z-10 gap-8'>
                <Text >We need your permission to show the camera</Text>
                <Button
                    onPress={requestPermission}
                    textColor='#fff'
                    buttonColor='#9333ea'
                >
                    Grant</Button>
            </View>
        );
    }

    return (
        <View className='bg-white absolute top-0 left-0 bottom-0 right-0 z-10 gap-8 justify-between p-10'>
            <View className='justify-center items-center gap-8 flex-1'>
                {
                    !user ?
                        <>
                            <Text className='text-4xl'>Scan Profile</Text>
                            <View className='bg-slate-500 w-10/12 aspect-square max-w-[300px]'>
                                <CameraView style={{ width: "100%", height: "100%", borderRadius: 20 }} barcodeScannerSettings={{ barcodeTypes: ["qr"] }} onBarcodeScanned={(code) =>
                                {
                                    set_scanned_id(code.data);
                                }} />
                            </View>
                        </>
                        :
                        <>
                            <Text className='text-4xl'>Invite {user.name}?</Text>
                            <Image source={{ uri: picture }} style={{ width: "80%", aspectRatio: 1 }} />
                            <Button
                                textColor='#fff'
                                buttonColor='#9333ea'
                                style={{ width: "100%" }}
                                onPress={() =>
                                {
                                    user_scanned(scanned_id);
                                }}
                            >
                                Invite</Button>
                            <Button
                                textColor='#fff'
                                buttonColor='#9333ea'
                                style={{ width: "100%" }}
                                onPress={() =>
                                {
                                    set_scanned_id("");
                                }}
                            >
                                Try again</Button>
                        </>
                }
            </View>
            <Button
                textColor='#fff'
                buttonColor='#9333ea'
                onPress={close}
            >
                Close</Button>
        </View>
    )
}

export default ProfileScanner;

import React, { useState } from 'react'
import { View, Text } from 'react-native';
import { Button, Modal, Portal, TextInput } from 'react-native-paper';
import { useAPI } from '~/app/components/APIProvider';
import { useNotifiction, } from '~/app/components/NotificationProvider';
import { APIError } from '~/app/lib/api/APIError';
import { set_updator, updator } from '~/app/lib/invalidator';

interface Props
{
    created: () => void,
    hide: () => void,
    open: boolean
}

const CreateHouseModal: React.FC<Props> = ({ created, hide, open }) =>
{
    const [error, set_error] = useState("");
    const [name, set_name] = useState("");
    const { notify } = useNotifiction();
    const api = useAPI();

    const create_house = () =>
    {
        api.house_create(name)
            .then(() =>
            {
                set_error("");
                set_name("");
                hide();
                created();
                setTimeout(() => set_updator(Date.now()), 500)
            })
            .catch(e =>
            {
                if (e instanceof APIError) notify("error", e.message);
                else console.error(e);
            })
    }

    return (
        <Portal>
            <Modal
                visible={open}
                onDismiss={hide}
            >
                <View className='bg-white p-10 gap-8'>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <Text style={{ fontSize: 30 }}>New House</Text>
                        <Button
                            mode="contained"
                            onPress={hide}
                        >
                            Close
                        </Button>
                    </View>
                    <View className='gap-2'>
                        <TextInput
                            placeholder='Name'
                            onChangeText={set_name}
                        />
                        {
                            !!error && <Text className='text-red-600'>{error}</Text>
                        }
                    </View>
                    <Button
                        mode='contained'
                        onPress={create_house}
                        disabled={!name.length}
                    >
                        Create
                    </Button>
                </View>
            </Modal>
        </Portal>
    )
}

export default CreateHouseModal;

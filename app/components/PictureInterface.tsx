import * as ImagePicker from 'expo-image-picker';
import { Button } from 'react-native-paper';
import { useAPI } from '~/app/components/APIProvider';

interface Props
{
    on_chosen: (img: string) => void
}

const ImageInterface: React.FC<Props> = ({ on_chosen }) =>
{
    const pickImage = async () =>
    {
        let result = await ImagePicker.launchImageLibraryAsync(
            {
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.2,
            });

        if (!result.canceled) on_chosen(result.assets[0].uri);
    };

    return (
        <Button style={{ margin: 10 }} onPress={pickImage}>Change Profile Pic</Button>
    );
}

export default ImageInterface;
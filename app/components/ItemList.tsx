import { View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';

export default function ItemList(props: any) {



    return (
        <View className="mt-4">
            {props.items.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    style={{
                        backgroundColor: '#6F4AAA',
                        padding: 10,
                        marginVertical: 5,
                        borderRadius: 20,
                    }}
                    onPress={() => console.log(`Touched ${item}`)}
                >
                    <Text
                        style={{
                            color: 'white',
                            paddingLeft: 5
                        }}
                    >
                        {item}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
  );
}
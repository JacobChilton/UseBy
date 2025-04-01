import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';

import { Product } from '~/app/lib/api/APITypes';

interface Props {

    products: Array<Product>
}
const ItemList:React.FC<Props> = ({products}) => {


    return (
        <View className="mt-4"
            style={{ maxHeight: '90%'}}>

            <ScrollView
                style={{ maxHeight: '100%' }}
                contentContainerStyle={{ paddingBottom: 20 }}
            >

                {products.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={{
                            backgroundColor: '#6F4AAA',
                            padding: 10,
                            marginVertical: 5,
                            borderRadius: 20,
                            maxHeight: '80%'
                        }}
                        onPress={() => console.log(`Touched ${item}`)}
                    >

                        

                        <Text
                            style={{
                                color: 'white',
                                paddingLeft: 5
                            }}
                        >
                            {item.name}

                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
  );
}

export default ItemList;
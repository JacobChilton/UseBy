import { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';

import { Product } from '~/app/lib/api/APITypes';

interface Props {

    products: Array<Product>
}

const ItemList:React.FC<Props> = ({products}) => {

    const [visibleProducts, setVisibleProducts] = useState<boolean[]>([]);

    useEffect(() => {

        setVisibleProducts(new Array(products.length).fill(false));

    }, []);
    

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
                        onPress={() => {
                            setVisibleProducts(prev => {
                                const newVisibility = [...prev];
                                newVisibility[index] = !newVisibility[index];
                                return newVisibility;
                              });
                          }}
                    >

                        

                        <Text
                            style={{
                                color: 'white',
                                paddingLeft: 5
                            }}
                        >
                            {item.name}
                        </Text>

                        {visibleProducts[index] && (
                            <Text
                            style={{
                                color: 'white',
                                paddingLeft: 5
                            }}
                            >
                                Owner: {item.owner_id}
                            </Text>
                        )}
                        {visibleProducts[index] && (
                            <Text
                            style={{
                                color: 'white',
                                paddingLeft: 5
                            }}
                            >
                                House: {item.house_id}
                            </Text>
                        )}
                        {visibleProducts[index] && (

                            <Text
                            style={{
                                color: 'white',
                                paddingLeft: 5
                            }}
                            >
                                Use By: {item.use_by}
                            </Text>
                        )}
                        {visibleProducts[index] && (
                            <Text
                            style={{
                                color: 'white',
                                paddingLeft: 5
                            }}
                            >
                                Barcode: {item.upc}
                            </Text>
                        )}
                        {visibleProducts[index] && (
                            <Text
                            style={{
                                color: 'white',
                                paddingLeft: 5
                            }}
                            >
                                Quantity: {item.quantity}
                            </Text>
                        )}
                        {visibleProducts[index] && (
                            <Text
                            style={{
                                color: 'white',
                                paddingLeft: 5
                            }}
                            >
                                Availability: {item.availability}
                            </Text>
                        )}
                        {visibleProducts[index] && (
                            <Text
                            style={{
                                color: 'white',
                                paddingLeft: 5
                            }}
                            >
                                Frozen: {item.frozen}
                            </Text>
                        )} 


                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
  );
}

export default ItemList;
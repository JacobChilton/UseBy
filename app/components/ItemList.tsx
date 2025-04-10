import { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { Product, UserID } from '~/app/lib/api/APITypes';
import { useAPI } from '~/app/components/APIProvider';

interface Props {

    products: Array<Product>
}

const ItemList:React.FC<Props> = ({products}) => {

    const [visibleProducts, setVisibleProducts] = useState<boolean[]>([]);

    const api = useAPI();
    

    useEffect(() => {

        function ownersLookup() {

            for (const productIndex in products) {
    

                (api.user_get(products[productIndex].owner_id)).then((userData) => {
    
                    if (userData) {

                        products[productIndex].owner_id = userData.name;
                    }
                });
            }
        }

        setVisibleProducts(new Array(products.length).fill(false));
        ownersLookup();

    }, [products]);
    

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
                        {visibleProducts[index] && (
                        <Button
                            mode="contained"
                            textColor="black"
                            onPress={() => console.log("Edit button clicked")}
                            style={{ flex: 1, marginTop: 10, backgroundColor: "white"}}
                        >
                            Edit Product Info
                        </Button>
                        )}

                        


                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
  );
}

export default ItemList;
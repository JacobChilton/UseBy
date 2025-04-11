import { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Button, Portal, Modal } from 'react-native-paper';
import { Product, UserID } from '~/app/lib/api/APITypes';
import { useAPI } from '~/app/components/APIProvider';

interface Props {

    products: Array<Product>
}

const ItemList:React.FC<Props> = ({products}) => {

    const [visibleProducts, setVisibleProducts] = useState<boolean[]>([]);
    const [productList, setProductList] = useState<Product[]>([]);
    const [editItemModalVisible, setEditItemModalVisible] = useState(false);
    
    const api = useAPI();

    useEffect(() => {

        function ownersLookup() {

            for (const productIndex in products) {

                (api.user_get(products[productIndex].owner_id)).then((userData) => {
    
                    if (userData) {

                        const newProductList = products.map(product => {

                            if ((product.owner_id === products[productIndex].owner_id)) {
                                
                                return {

                                    ...product,
                                    owner_id: userData.name
                                };
                            }
                            else {
                                
                                return product;
                            }
                        });
                        setProductList(newProductList);
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

                {productList.map((item, index) => (
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
                                House: {item.house_name}
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
                                Frozen: {item.frozen ? "Yes" : "No"}
                            </Text>
                        )}
                        {visibleProducts[index] && (
                        <Button
                            mode="contained"
                            textColor="black"
                            onPress={() => setEditItemModalVisible(true)}
                            style={{ flex: 1, marginTop: 10, backgroundColor: "white"}}
                        >
                            Edit Product Info
                        </Button>
                        )}

                        <Portal>
                            <Modal
                                visible={editItemModalVisible}
                                onDismiss={() => setEditItemModalVisible(false)}
                                contentContainerStyle={{
                                    backgroundColor: 'white',
                                    padding: 20,
                                    margin: 20,
                                    borderRadius: 8,
                                    maxHeight: '80%'
                                }}
                            >
                            <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 20
                                }}>
                                    <Text style={{ fontSize: 36}}>Edit Item</Text>
                                    <Button
                                            mode="contained"
                                            onPress={() =>
                                            {
                                                setEditItemModalVisible(false);
                                            }}
                                            style={{ }}
                                        >
                                            Close
                                    </Button>
                                </View>
                            

                            </Modal>
                        </Portal>

                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
  );
}

export default ItemList;
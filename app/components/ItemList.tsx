import { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Button, Portal, Modal } from 'react-native-paper';
import { Product, UserID } from '~/app/lib/api/APITypes';
import { useAPI } from '~/app/components/APIProvider';
import PopupFormContents from './PopupFormContents';


export default function ItemList(props) {

    const products = props.passProducts;
    const setProducts = props.passSetProducts;

    const [visibleProducts, setVisibleProducts] = useState<boolean[]>([]);
    const [productList, setProductList] = useState<Product[]>([]);

    const api = useAPI();

    useEffect(() => {

        // Refresh product list
        api.house_product_get_all("67ebf33bc50778b4c4b6c531").then(setProducts)
        .catch(console.error);
    }, []);

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

        console.log("setting products");
        console.log(products);

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
                            backgroundColor: 'white',
                            padding: 10,
                            marginVertical: 5,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: 'grey', 
                            maxHeight: '80%',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 3,
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
                                color: '#4A4A4A',
                                paddingLeft: 5,
                                fontWeight: 600,
                            }}
                        >
                            {item.name}
                        </Text>

                        <Text
                            style={{
                                marginTop: 8,
                                paddingLeft: 5,
                                color: 'grey',
                            }}
                        >
                            Quantity: {item.quantity}
                        </Text>

                        {visibleProducts[index] && (
                            <Text
                            style={{
                                marginTop: 5,
                                color: 'grey',
                                paddingLeft: 5
                            }}
                            >
                                Owner: {item.owner_id}
                            </Text>
                        )}
                        {visibleProducts[index] && (
                            <Text
                            style={{
                                marginTop: 5,
                                color: 'grey',
                                paddingLeft: 5
                            }}
                            >
                                House: {item.house_name}
                            </Text>
                        )}
                        {visibleProducts[index] && (

                            <Text
                            style={{
                                marginTop: 5,
                                color: 'grey',
                                paddingLeft: 5
                            }}
                            >
                                Use By: {item.use_by}
                            </Text>
                        )}
                        {visibleProducts[index] && (
                            <Text
                            style={{
                                marginTop: 5,
                                color: 'grey',
                                paddingLeft: 5
                            }}
                            >
                                Barcode: {item.upc}
                            </Text>
                        )}
                        {visibleProducts[index] && (
                            <Text
                            style={{
                                marginTop: 5,
                                color: 'grey',
                                paddingLeft: 5
                            }}
                            >
                                Quantity: {item.quantity}
                            </Text>
                        )}
                        {visibleProducts[index] && (
                            <Text
                            style={{
                                marginTop: 5,
                                color: 'grey',
                                paddingLeft: 5
                            }}
                            >
                                Availability: {item.availability}
                            </Text>
                        )}
                        {visibleProducts[index] && (
                            <Text
                            style={{
                                marginTop: 5,
                                color: 'grey',
                                paddingLeft: 5
                            }}
                            >
                                Frozen: {item.frozen ? "Yes" : "No"}
                            </Text>
                        )}
                        {visibleProducts[index] && (
                            <PopupFormContents formType="Edit Item" currentItem={item} passProducts={products} passSetProducts={setProducts}/>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
  );
}
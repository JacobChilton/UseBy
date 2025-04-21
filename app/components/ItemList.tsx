import { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Text, Button, Portal, Modal } from 'react-native-paper';
import { Product, UserID } from '~/app/lib/api/APITypes';
import { useAPI } from '~/app/components/APIProvider';
import PopupFormContents from './PopupFormContents';


export default function ItemList(props) {

    const products = props.passProducts;
    const setProducts = props.passSetProducts;

    const [expired, setExpired] = useState<Product[]>([]);
    const [expiringThisMonth, setExpiringThisMonth] = useState<Product[]>([]);
    const [expiringLater, setExpiringLater] = useState<Product[]>([]);

    const [visibleProducts, setVisibleProducts] = useState<boolean[]>([]);
    const [productList, setProductList] = useState<Product[]>([]);

    const api = useAPI();

    useEffect(() => {

        // Refresh product list
        api.house_product_get_all("6803011913572dd35b206ef9").then((products) => {

            // Sort the product list by order of expiration
            products.sort(function(a, b) {
                return (a.use_by < b.use_by) ? -1 : ((a.use_by > b.use_by) ? 1 : 0);
            });

            setProducts(products);
        })
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

        function checkDates() {

            let newExpiring: Product[] = [];
            let newExpiringThisMonth: Product[] = [];
            let newExpiringLater: Product[] = [];

            for (let product of products) { // Check when each product is expiring

                // Get today's date
                let todayDate = new Date();
                let dd = String(todayDate.getDate()).padStart(2, '0');
                let mm = String(todayDate.getMonth() + 1).padStart(2, '0');
                let yyyy = todayDate.getFullYear();
                let today = yyyy + '-' + mm + '-' + dd;

                // Get date a month from today
                mm = String(todayDate.getMonth() + 2).padStart(2, '0');
                let nextMonth = yyyy + '-' + mm + '-' + dd;

                console.log("next month " + nextMonth);

                // Put product's expiry date in same form
                const productExpiry = product.use_by.split("T")[0];
    
                if (productExpiry < today) { // If product expired

                    newExpiring.push(product);
                }
                else if (productExpiry < nextMonth) { // If product expiring this month

                    newExpiringThisMonth.push(product);
                }
                else { // If product not expiring soon
                    
                    newExpiringLater.push(product);
                }
            }

            // Set expiration groups
            setExpired(newExpiring);
            setExpiringThisMonth(newExpiringThisMonth);
            setExpiringLater(newExpiringLater);
        }

        setVisibleProducts(new Array(products.length).fill(false));
        ownersLookup();
        checkDates();

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

                <h1>Expired</h1>
                {expired.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={{
                            backgroundColor: visibleProducts[index] ? '#6F4AAA' : 'white', 
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
                                color: visibleProducts[index] ? 'white' : '#4A4A4A',
                                paddingLeft: 5,
                                fontWeight: 700,
                                fontFamily: Platform.OS === 'ios' ? 'Verdana-Bold' : 'monospace',
                            }}
                        >
                            {item.name}
                        </Text>

                        <Text
                            style={{
                                color: visibleProducts[index] ? 'white' : 'grey',
                                marginTop: 8,
                                paddingLeft: 5,
                                fontFamily: Platform.OS === 'ios' ? 'Verdana' : 'monospace',
                            }}
                        >
                            Quantity: {item.quantity}
                        </Text>

                        {visibleProducts[index] && (
                            <Text
                            style={{
                                marginTop: 5,
                                color: 'white',
                                paddingLeft: 5,
                                fontFamily: Platform.OS === 'ios' ? 'Verdana' : 'monospace',
                            }}
                            >
                                Owner: {item.owner_id}
                            </Text>
                        )}
                        {visibleProducts[index] && (
                            <Text
                            style={{
                                marginTop: 5,
                                color: 'white',
                                fontFamily: Platform.OS === 'ios' ? 'Verdana' : 'monospace',
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
                                color: 'white',
                                fontFamily: Platform.OS === 'ios' ? 'Verdana' : 'monospace',
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
                                color: 'white',
                                fontFamily: Platform.OS === 'ios' ? 'Verdana' : 'monospace',
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
                                color: 'white',
                                fontFamily: Platform.OS === 'ios' ? 'Verdana' : 'monospace',
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
                                color: 'white',
                                fontFamily: Platform.OS === 'ios' ? 'Verdana' : 'monospace',
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
                                color: 'white',
                                fontFamily: Platform.OS === 'ios' ? 'Verdana' : 'monospace',
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

                <h1>Expiring This Month</h1>
                {expiringThisMonth.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={{
                            backgroundColor: visibleProducts[index] ? '#6F4AAA' : 'white', 
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
                                color: visibleProducts[index] ? 'white' : '#4A4A4A',
                                paddingLeft: 5,
                                fontWeight: 700,
                                fontFamily: Platform.OS === 'ios' ? 'Verdana-Bold' : 'monospace',
                            }}
                        >
                            {item.name}
                        </Text>

                        <Text
                            style={{
                                color: visibleProducts[index] ? 'white' : 'grey',
                                marginTop: 8,
                                paddingLeft: 5,
                                fontFamily: Platform.OS === 'ios' ? 'Verdana' : 'monospace',
                            }}
                        >
                            Quantity: {item.quantity}
                        </Text>

                        {visibleProducts[index] && (
                            <Text
                            style={{
                                marginTop: 5,
                                color: 'white',
                                paddingLeft: 5,
                                fontFamily: Platform.OS === 'ios' ? 'Verdana' : 'monospace',
                            }}
                            >
                                Owner: {item.owner_id}
                            </Text>
                        )}
                        {visibleProducts[index] && (
                            <Text
                            style={{
                                marginTop: 5,
                                color: 'white',
                                fontFamily: Platform.OS === 'ios' ? 'Verdana' : 'monospace',
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
                                color: 'white',
                                fontFamily: Platform.OS === 'ios' ? 'Verdana' : 'monospace',
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
                                color: 'white',
                                fontFamily: Platform.OS === 'ios' ? 'Verdana' : 'monospace',
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
                                color: 'white',
                                fontFamily: Platform.OS === 'ios' ? 'Verdana' : 'monospace',
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
                                color: 'white',
                                fontFamily: Platform.OS === 'ios' ? 'Verdana' : 'monospace',
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
                                color: 'white',
                                fontFamily: Platform.OS === 'ios' ? 'Verdana' : 'monospace',
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

                <h1>Expiring Later</h1>

                {expiringLater.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={{
                            backgroundColor: visibleProducts[index] ? '#6F4AAA' : 'white', 
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
                                color: visibleProducts[index] ? 'white' : '#4A4A4A',
                                paddingLeft: 5,
                                fontWeight: 700,
                                fontFamily: Platform.OS === 'ios' ? 'Verdana-Bold' : 'monospace',
                            }}
                        >
                            {item.name}
                        </Text>

                        <Text
                            style={{
                                color: visibleProducts[index] ? 'white' : 'grey',
                                marginTop: 8,
                                paddingLeft: 5,
                                fontFamily: Platform.OS === 'ios' ? 'Verdana' : 'monospace',
                            }}
                        >
                            Quantity: {item.quantity}
                        </Text>

                        {visibleProducts[index] && (
                            <Text
                            style={{
                                marginTop: 5,
                                color: 'white',
                                paddingLeft: 5,
                                fontFamily: Platform.OS === 'ios' ? 'Verdana' : 'monospace',
                            }}
                            >
                                Owner: {item.owner_id}
                            </Text>
                        )}
                        {visibleProducts[index] && (
                            <Text
                            style={{
                                marginTop: 5,
                                color: 'white',
                                fontFamily: Platform.OS === 'ios' ? 'Verdana' : 'monospace',
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
                                color: 'white',
                                fontFamily: Platform.OS === 'ios' ? 'Verdana' : 'monospace',
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
                                color: 'white',
                                fontFamily: Platform.OS === 'ios' ? 'Verdana' : 'monospace',
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
                                color: 'white',
                                fontFamily: Platform.OS === 'ios' ? 'Verdana' : 'monospace',
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
                                color: 'white',
                                fontFamily: Platform.OS === 'ios' ? 'Verdana' : 'monospace',
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
                                color: 'white',
                                fontFamily: Platform.OS === 'ios' ? 'Verdana' : 'monospace',
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
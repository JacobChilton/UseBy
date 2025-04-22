import { useEffect, useState } from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { Product } from '~/app/lib/api/APITypes';
import { useAPI } from '~/app/components/APIProvider';
import PopupFormContents from './PopupFormContents';


export default function ItemListGroup(props) {

    const groupProducts = props.groupProducts;

    const products = props.passProducts;
    const setProducts = props.passSetProducts;
    const refresh = props.passRefresh;
    const setRefresh = props.passSetRefresh;

    const [visibleProducts, setVisibleProducts] = useState<boolean[]>([]);
    const [productList, setProductList] = useState<Product[]>([]);

    const api = useAPI();

    useEffect(() => {

        async function ownerLookup(owner_id) {

            try {

                const userData = await api.user_get(owner_id);

                if (userData) {

                    return userData.name;
                }
            }
            catch (error) {

                console.error("Error looking up owner");
                return "Error";
            }
        }
        async function formatDisplayedDate(dateToFormat: Date) {
            
            let date = new Date(dateToFormat);

            let dd = String(date.getDate()).padStart(2, '0');
            let mm = String(date.getMonth() + 1).padStart(2, '0');
            let yyyy = date.getFullYear();

            let formattedDate = dd + '/' + mm + '/' + yyyy;

            return formattedDate;
        }

        async function updateProductList() {

            const newProductList = await Promise.all(
                groupProducts.map(async product => {

                    const ownerName = await ownerLookup(product.owner_id);
                    const useByDate = await formatDisplayedDate(product.use_by);
                
                    return {
                        ...product,
                        use_by: useByDate,
                        owner_name: ownerName,
                    };
                })
            );
            setProductList(newProductList);
        }
        setVisibleProducts(new Array(groupProducts.length).fill(false));
        updateProductList();

    }, [products, groupProducts]);

    return (
        <>
            {productList.map((item, index) => (
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
                            Owner: {item.owner_name}
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
                        <PopupFormContents formType="Edit Item" currentItem={item} passRefresh={refresh} passSetRefresh={setRefresh} passProducts={products} passSetProducts={setProducts}/>
                    )}
                </TouchableOpacity>
            ))}
        </>
  );
}
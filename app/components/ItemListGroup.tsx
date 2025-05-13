import { useEffect, useState } from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Product } from '~/app/lib/api/APITypes';
import { useAPI } from '~/app/components/APIProvider';
import PopupFormContents from './PopupFormContents';


export default function ItemListGroup(props)
{

    const groupProducts = props.groupProducts;

    const products = props.passProducts;
    const setProducts = props.passSetProducts;
    const refresh = props.passRefresh;
    const setRefresh = props.passSetRefresh;

    const deleteItem = props.passDeleteItem;

    const [visibleProducts, setVisibleProducts] = useState<boolean[]>([]);
    const [productList, setProductList] = useState<Product[]>([]);

    const api = useAPI();

    console.log(products);

    async function deleteItems()
    {

        for (let product of productList)
        {

            deleteItem(product._id);
        }
    }

    useEffect(() =>
    {

        async function ownerLookup(owner_id)
        {
            try
            {
                const userData = await api.user_get(owner_id);

                if (userData)
                {

                    return userData.name;
                }
            }
            catch (error)
            {

                console.error("Error looking up owner");
                return "Error";
            }
        }

        async function updateProductList()
        {

            const newProductList = await Promise.all(
                groupProducts.map(async product =>
                {
                    const ownerName = await ownerLookup(product.owner_id);
                    return {
                        ...product,
                        owner_name: ownerName,
                    };
                })
            );
            setProductList(newProductList);
        }
        setVisibleProducts(new Array(groupProducts.length).fill(false));
        updateProductList();

    }, [products, groupProducts]);

    function formatDisplayedDate(dateToFormat: Date)
    {

        let date = new Date(dateToFormat);

        let dd = String(date.getDate()).padStart(2, '0');
        let mm = String(date.getMonth() + 1).padStart(2, '0');
        let yyyy = date.getFullYear();

        let formattedDate = dd + '/' + mm + '/' + yyyy;

        return formattedDate;
    }

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
                        maxHeight: '100%',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 3,
                    }}
                    onPress={() =>
                    {
                        setVisibleProducts(prev =>
                        {
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
                        }}
                    >
                        {item.name}
                    </Text>

                    <Text
                        style={{
                            color: visibleProducts[index] ? 'white' : 'grey',
                            marginTop: 8,
                            paddingLeft: 5,
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
                                paddingLeft: 5
                            }}
                        >
                            Use By: {formatDisplayedDate(item.use_by)}
                        </Text>
                    )}
                    {visibleProducts[index] && (
                        <Text
                            style={{
                                marginTop: 5,
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
                                marginTop: 5,
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
                                marginTop: 5,
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
                                marginTop: 5,
                                color: 'white',
                                paddingLeft: 5
                            }}
                        >
                            Frozen: {item.frozen ? "Yes" : "No"}
                        </Text>
                    )}
                    {visibleProducts[index] && (
                        <PopupFormContents
                            key={item._id}
                            formType="Edit Item"
                            selectedHouse={props.selectedHouse}
                            passDeleteItem={deleteItem}
                            currentItem={item}
                            passRefresh={refresh}
                            passSetRefresh={setRefresh}
                        />
                    )}
                </TouchableOpacity>
            ))}
            {(props.group === "expired") && (
                <Button
                    mode="outlined"
                    className="h-12 w-40 rounded-3xl"
                    labelStyle={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}
                    contentStyle={{ backgroundColor: '#6F4AAA' }}
                    style={{ borderColor: 'white', borderWidth: 2 }}
                    onPress={() => deleteItems()}
                >
                    Delete All
                </Button>
            )}
        </>
    );
}
import { Stack } from 'expo-router';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { Button, IconButton, Avatar, TextInput, DefaultTheme, PaperProvider, Text, Modal, Portal } from 'react-native-paper';
import { useAPI } from '../components/APIProvider';
import BarcodeScanner from '~/components/BarcodeScanner';
import ItemList from '~/components/ItemList';
import { Availability, Product } from '../lib/api/APITypes';


export default function MyFood()
{
    const customTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            text: 'black',
            primary: '#6F4AAA',
        },
    };

    const [addItemModalVisible, setAddItemModalVisible] = useState(false);
    const [itemName, setItemName] = useState('');
    const [barcode, setBarcode] = useState("");
    const [items, setItems] = useState<Array<string>>([]);
    const [useByDate, setUseByDate] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [availability, setAvailability] = useState(Availability.PRIVATE);
    const [freeze, setFreeze] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);

    const api = useAPI();

    const handleAddItem = () =>
    {
        if (itemName.trim())
        {
            const product:Omit<Product, "_id" | "owner_id" | "house_id"> = {
                name: "product test",
                upc: "01787481",
                use_by: new Date(2025, 4, 7),
                quantity: 1,
                availability: Availability.UP_FOR_GRABS,
                frozen: false
            }
            

            api.house_product_add("67ebf33bc50778b4c4b6c531", product);


            setItems([...items, itemName]);
            setItemName('');
            setAddItemModalVisible(false);
        }
    };

    // Looks up the barcode and sets the product name to the generated name
    function barcodeLookup()
    {
        setItemName("Loading...");
        (api.barcode_fetch(barcode)).then((productData) =>
        {
            if (productData)
            {
                setItemName(productData.name);
            }
        });
    }

    function scanBarcode()
    {
        setCameraActive(!cameraActive);
    }

    function incrementQuantity() {

        setQuantity(String(Number(quantity) + 1));
    }

    function decrementQuantity() {

        if (Number(quantity) === 1) {
            return;
        }

        setQuantity(String(Number(quantity) - 1));
    }

    return (
        <PaperProvider theme={customTheme}>
            <View className="flex-1 p-10 pt-28">
                <Text>myFood</Text>

                

                <ItemList items={items}/>

                <Portal>
                    <Modal
                        visible={addItemModalVisible}
                        onDismiss={() => setAddItemModalVisible(false)}
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
                            <Text style={{ fontSize: 36}}>Add Item</Text>
                            <Button
                                    mode="contained"
                                    onPress={() =>
                                    {
                                        setItemName(''); // Clear input on cancel
                                        setAddItemModalVisible(false);
                                    }}
                                    style={{ }}
                                >
                                    Close
                            </Button>
                        </View>

                        <ScrollView
                            style={{ maxHeight: '90%' }}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        >

                            <Text style={{ fontSize: 18, marginBottom: 20 }}>Barcode</Text>
                            <TextInput
                                placeholder='Enter barcode number'
                                mode="outlined"
                                style={{ backgroundColor: 'transparent', width: '100%', marginBottom: 20 }}
                                value={barcode}
                                onChangeText={setBarcode} // Update barcode state as user types
                            />

                            <div className={cameraActive ? "" : "hidden"}>
                                <BarcodeScanner />
                            </div>

                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: 20
                            }}>
                                <Button
                                    mode="contained"
                                    onPress={barcodeLookup} // Call handler to look up barcode
                                    style={{ flex: 1, marginRight: 10, marginBottom: 10 }}
                                >
                                    Lookup Item
                                </Button>

                                <Button
                                    mode="contained"
                                    onPress={scanBarcode} // Call handler to scan barcode
                                    style={{ flex: 1, marginRight: 10, marginBottom: 10 }}
                                >
                                    Scan Barcode
                                </Button>
                            </View>

                            <Text style={{ fontSize: 18, marginBottom: 20 }}>Product Name</Text>
                            <TextInput
                                placeholder='Enter item name'
                                mode="outlined"
                                style={{ backgroundColor: 'transparent', width: '100%', marginBottom: 20 }}
                                value={itemName}
                                onChangeText={setItemName} // Update itemName state as user types
                            />

                            <Text style={{ fontSize: 18, marginBottom: 20 }}>Use By Date</Text>
                            <TextInput
                                placeholder='Enter use by date dd/mm/yyyy'
                                mode="outlined"
                                style={{ backgroundColor: 'transparent', width: '100%', marginBottom: 20 }}
                                value={useByDate}
                                onChangeText={setUseByDate} // Update use by date
                            />

                            <Text style={{ fontSize: 18, marginBottom: 20 }}>Quantity</Text>
                            <TextInput
                                placeholder='1'
                                defaultValue='1'
                                mode="outlined"
                                style={{ backgroundColor: 'transparent', width: '100%', marginBottom: 20 }}
                                value={quantity}
                                onChangeText={setQuantity} // Update quantity
                            />

                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: 20
                            }}>
                                <Button
                                    mode="contained"
                                    onPress={decrementQuantity} // Call handler to scan barcode
                                    style={{ flex: 1, marginRight: 10, marginBottom: 10 }}
                                >
                                    -
                                </Button>

                                <Button
                                    mode="contained"
                                    onPress={incrementQuantity} // Call handler to look up barcode
                                    style={{ flex: 1, marginRight: 10, marginBottom: 10 }}
                                >
                                    +
                                </Button>
                            </View>

                            <Text style={{ fontSize: 18, marginBottom: 20 }}>Availability: {availability}</Text>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: 20
                            }}>
                                <Button
                                    mode="contained"
                                    onPress={() => {
                                        setAvailability(Availability.PRIVATE);
                                    }} // Call handler to set availability to private
                                    style={{ flex: 1, marginRight: 10, marginBottom: 10 }}
                                >
                                    Private
                                </Button>

                                <Button
                                    mode="contained"
                                    onPress={() => {
                                        setAvailability(Availability.COMMUNAL);
                                    }} // Call handler to set availability to communal
                                    style={{ flex: 1, marginRight: 10, marginBottom: 10 }}
                                >
                                    Communal
                                </Button>

                                <Button
                                    mode="contained"
                                    onPress={() => {
                                        setAvailability(Availability.UP_FOR_GRABS);
                                    }} // Call handler to set availability to up for grabs
                                    style={{ flex: 1, marginRight: 10, marginBottom: 10 }}
                                >
                                    Up For Grabs
                                </Button>
                            </View>

                            <Text style={{ fontSize: 18, marginBottom: 20 }}>Frozen: {freeze.toString()}</Text>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: 20
                            }}>

                                <Button
                                    mode="contained"
                                    onPress={() => {
                                        setFreeze(!freeze);
                                    }} // Call handler to set frozen status
                                    style={{ flex: 1, marginRight: 10, marginBottom: 10 }}
                                >
                                    Freeze
                                </Button>
                            </View>

                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: 20,
                            }}>
                                <Button
                                    mode="contained"
                                    onPress={handleAddItem} // Call handler to add item
                                    style={{ flex: 1, marginRight: 10 }}
                                >
                                    List Item
                                </Button>
                            </View>

                        </ScrollView>
                    </Modal>
                </Portal>

                <View className="mt-4 flex-row justify-center">
                    <Button
                        mode="contained"
                        icon="plus"
                        className="h-12 w-40 rounded-3xl"
                        labelStyle={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}
                        onPress={() => setAddItemModalVisible(true)}
                    >
                        Add Item
                    </Button>
                </View>

            </View>
        </PaperProvider>
    );
}
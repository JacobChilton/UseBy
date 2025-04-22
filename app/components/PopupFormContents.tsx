import { Stack } from 'expo-router';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { Button, IconButton, Avatar, TextInput, DefaultTheme, PaperProvider, Text, Modal, Portal } from 'react-native-paper';
import BarcodeScanner from '~/components/BarcodeScanner';
import ItemList from '~/components/ItemList';
import { Availability, Product } from '~/app/lib/api/APITypes';
import { useAPI } from '~/app/components/APIProvider';

export default function PopupFormContents(props)
{
    const customTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            text: 'black',
            primary: '#6F4AAA',
        },
    };

    const api = useAPI();

    const refresh = props.passRefresh;
    const setRefresh = props.passSetRefresh;
    
    const [addItemModalVisible, setAddItemModalVisible] = useState(false);
    const [itemName, setItemName] = useState('');
    const [barcode, setBarcode] = useState("");
    const [items, setItems] = useState<Array<Product>>([]);
    const [useByDate, setUseByDate] = useState<Date>();
    const [quantity, setQuantity] = useState("1");
    const [availability, setAvailability] = useState(Availability.PRIVATE);
    const [freeze, setFreeze] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);

    if ((props.formType === "Edit Item") && (itemName != props.currentItem.name)) {

        console.log(props.currentItem);

        if (itemName != props.currentItem.name) {

            setItemName(props.currentItem.name);
        }
        if (barcode != props.currentItem.upc) {

            setBarcode(props.currentItem.upc);
        }
        if (useByDate != props.currentItem.use_by) {

            setUseByDate(props.currentItem.use_by);
        }
        if (quantity != props.currentItem.quantity) {

            setQuantity(props.currentItem.quantity);
        }
        if (availability != props.currentItem.availability) {

            setAvailability(props.currentItem.availability);
        }
        if (freeze != props.currentItem.frozen) {

            setFreeze(props.currentItem.frozen);
        }
    }

    const handleAddItem = () => {

        if (itemName.trim())
        {
            const product:Omit<Product, "_id" | "owner_id" | "house_id"> = {
                name: itemName,
                upc: barcode,
                use_by: useByDate, // still hardcoded
                quantity: +quantity,
                availability: availability,
                frozen: freeze
            }

            if (props.formType === "Add Item") {

                api.house_product_add("6806b5858798a785965c01f1", product).then(setRefresh(!refresh));
            }
            else if (props.formType === "Edit Item") {

                api.house_product_update("6806b5858798a785965c01f1", props.currentItem._id, product).then(setRefresh(!refresh));
            } 

            setAddItemModalVisible(false);

            setItemName('');
            setBarcode("");
            setItems([]);
            setUseByDate("");
            setQuantity("1");
            setAvailability(Availability.PRIVATE);
            setFreeze(false);
            setCameraActive(false);
        }
    };

    function clearForm() {

        setItemName('');
        setBarcode("");
        setItems([]);
        setUseByDate("");
        setQuantity("1");
        setAvailability(Availability.PRIVATE);
        setFreeze(false);
        setCameraActive(false);
    }

    // Looks up the barcode and sets the product name to the generated name
    function barcodeLookup()
    {
        setItemName("Loading...");
        (api.barcode_fetch(barcode)).then((productData) =>
        {
            if (productData)
            {
                setItemName(productData.name.substring(1, productData.name.length - 1));
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
        <>
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
                        <Text style={{ fontSize: 36}}>{props.formType}</Text>
                        <Button
                                mode="contained"
                                onPress={() =>
                                {
                                    clearForm(); // Clear input on cancel
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

                        <Text style={{ fontSize: 18, marginBottom: 20 }}>Barcode (optional)</Text>
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

                        <Text style={{ fontSize: 18, marginBottom: 20}}>Use By Date</Text>
                        <input
                            type="date"
                            id="useByDate"
                            style={{maxWidth: 130, marginBottom: 20, borderWidth: 1}}
                            onChange={(e) => setUseByDate(e.target.value)}
                            >
                        </input>

                        <Text style={{ fontSize: 18, marginBottom: 20 }}>Quantity</Text>
                        <TextInput
                            placeholder='1'
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
                                {props.formType}
                            </Button>
                        </View>

                    </ScrollView>
                </Modal>
            </Portal>
            <View className="mt-4 flex-row justify-center">
                <Button
                    mode="outlined"
                    className="h-12 w-40 rounded-3xl"
                    labelStyle={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}
                    contentStyle={{ backgroundColor: '#6F4AAA' }} 
                    style={{ borderColor: 'white', borderWidth: 2 }}
                    onPress={() => setAddItemModalVisible(true)}
                >
                    {props.formType}
                </Button>
            </View>
        </>
    )
}
import { Stack } from 'expo-router';
import { StyleSheet, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { Button, IconButton, Avatar, TextInput, DefaultTheme, PaperProvider, Text, Modal, Portal } from 'react-native-paper';
import BarcodeScanner from '~/components/BarcodeScanner';
import ItemList from '~/components/ItemList';
import { Availability, House, HouseID, Product } from '~/app/lib/api/APITypes';
import { useAPI } from '~/app/components/APIProvider';
import { AggHouse } from '~/app/lib/api/aggregated';
import { useNotifiction } from '~/app/components/NotificationProvider';
import { APIError } from '~/app/lib/api/APIError';
import { Calendar, LocaleConfig } from 'react-native-calendars';

interface Props
{
    passRefresh?: boolean,
    passSetRefresh?: (bool: boolean) => void,
    formType: string,
    currentItem?: Product,
    passDeleteItem: (product: string) => void,
    selectedHouse?: AggHouse
}

const PopupFormContents: React.FC<Props> = (props: Props) =>
{
    const api = useAPI();

    const refresh = props.passRefresh;
    const setRefresh = props.passSetRefresh;

    const deleteItem = props.passDeleteItem;

    let currentItemID;
    if (props.currentItem)
    {

        currentItemID = props.currentItem?._id;
    }
    else
    {
        currentItemID = "";
    }

    const [addItemModalVisible, setAddItemModalVisible] = useState(false);
    const [itemName, setItemName] = useState<string>(props.currentItem?.name || "");
    const [barcode, setBarcode] = useState<string>(props.currentItem?.upc || "");
    const [scannedBarcode, setScannedBarcode] = useState<string>(props.currentItem?.upc || "");
    const [items, setItems] = useState<Array<Product>>([]);
    const [useByDate, setUseByDate] = useState<Date>(props.currentItem?.use_by ? new Date(props.currentItem?.use_by) : new Date());
    const [quantity, setQuantity] = useState(props.currentItem?.quantity || 1);
    const [availability, setAvailability] = useState(props.currentItem?.availability || Availability.PRIVATE);
    const [freeze, setFreeze] = useState(!!props.currentItem?.frozen);
    const [cameraActive, setCameraActive] = useState(false);
    const { notify } = useNotifiction();


    const handleAddItem = () =>
    {

        if (itemName.trim())
        {
            const product: Omit<Product, "_id" | "owner_id" | "house_id"> = {
                name: itemName,
                upc: barcode,
                use_by: useByDate || new Date(0), // still hardcoded
                quantity: quantity,
                availability: availability,
                frozen: freeze
            }

            if (props.formType === "Add Item")
            {

                api.house_product_add(props.selectedHouse._id, product)
                    .then(() => 
                    {
                        if (setRefresh) setRefresh(!refresh)
                    })
                    .catch(e =>
                    {
                        notify("error", e.toString());
                    })
            }
            else if (props.formType === "Edit Item")
            {

                api.house_product_update(props.selectedHouse._id, props.currentItem?._id || "", product)
                    .then(() => 
                    {
                        if (setRefresh)
                        {
                            setRefresh(!refresh)
                        }
                    })
                    .catch(e =>
                    {
                        notify("error", e.toString());
                    })
            }
            setAddItemModalVisible(false);
        }
    };

    // Looks up the barcode and sets the product name to the generated name
    function barcodeLookup(barcode: string)
    {

        setCameraActive(false);
        console.log("boop");
        setItemName("Loading...");
        (api.barcode_fetch(barcode)).then((productData) =>
        {
            if (productData)
            {
                setItemName(productData.name.substring(1, productData.name.length - 1));
            }
        }).catch(e =>
        {

            if (e instanceof APIError)
            {

                console.log(e.message);
                if (e.message === "unauthorized")
                {
                    return;
                }
            }

            notify("error", e.toString());
        });
    }

    function scanBarcode()
    {
        setCameraActive(!cameraActive);
    }

    function incrementQuantity()
    {

        setQuantity(quantity + 1);
    }

    function decrementQuantity()
    {

        if (quantity === 1)
        {
            return;
        }

        setQuantity(quantity - 1);
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
                        <Text style={{ fontSize: 36 }}>{props.formType}</Text>
                        <Button
                            mode="contained"
                            onPress={() =>
                            {
                                //clearForm(); // Clear input on cancel
                                setAddItemModalVisible(false);
                            }}
                            style={{}}
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

                        <View className={cameraActive ? "" : "hidden"}>
                            <BarcodeScanner key={new Date()} passBarcode={barcodeLookup} />
                        </View>

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


                        <View style={{ paddingBottom: 15 }}>


                            <Calendar
                                current={useByDate.toISOString().split('T')[0]}
                                onDayPress={day =>
                                {
                                    setUseByDate(new Date(day.timestamp));
                                }}
                                markedDates={{ [useByDate.toISOString().split('T')[0]]: { selected: true } }}
                            />

                        </View>

                        <Text style={{ fontSize: 18, marginBottom: 20 }}>Quantity</Text>
                        <TextInput
                            placeholder='1'
                            mode="outlined"
                            style={{ backgroundColor: 'transparent', width: '100%', marginBottom: 20 }}
                            value={quantity + ""}
                            onChangeText={(t) => setQuantity(Number(t))} // Update quantity
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

                        <Text style={{ fontSize: 18, marginBottom: 20 }}>Availability</Text>

                        <Button
                            mode="contained"
                            onPress={() =>
                            {
                                setAvailability(Availability.PRIVATE);
                            }} // Call handler to set availability to private
                            style={{ flex: 1, marginRight: 10, marginBottom: 10, backgroundColor: availability == Availability.PRIVATE ? "#6F4AAA" : "gray" }}

                        >
                            Private
                        </Button>

                        <Button
                            mode="contained"
                            onPress={() =>
                            {
                                setAvailability(Availability.COMMUNAL);
                            }} // Call handler to set availability to communal
                            style={{ flex: 1, marginRight: 10, marginBottom: 10, backgroundColor: availability == Availability.COMMUNAL ? "#6F4AAA" : "gray" }}
                        >
                            Communal
                        </Button>

                        <Button
                            mode="contained"
                            onPress={() =>
                            {
                                setAvailability(Availability.UP_FOR_GRABS);
                            }} // Call handler to set availability to up for grabs
                            style={{ flex: 1, marginRight: 10, marginBottom: 10, backgroundColor: availability == Availability.UP_FOR_GRABS ? "#6F4AAA" : "gray" }}
                        >
                            Up For Grabs
                        </Button>

                        <Text style={{ fontSize: 18, marginTop: 20, marginBottom: 20 }}>Frozen</Text>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: 20
                        }}>

                            <Button
                                mode="contained"
                                onPress={() =>
                                {
                                    setFreeze(!freeze);
                                }} // Call handler to set frozen status
                                style={{ flex: 1, marginRight: 10, marginBottom: 10 }}
                            >
                                {freeze ? "Frozen" : "Unfrozen"}
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
            <View className="mt-4 flex-row justify-evenly">
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
                {(props.formType === "Edit Item") && (
                    <Button
                        mode="outlined"
                        className="h-12 w-40 rounded-3xl"
                        labelStyle={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}
                        contentStyle={{ backgroundColor: '#6F4AAA' }}
                        style={{ borderColor: 'white', borderWidth: 2 }}
                        onPress={() => deleteItem(currentItemID)}
                    >
                        Delete Item
                    </Button>
                )}

            </View>
        </>
    )
}

export default PopupFormContents;
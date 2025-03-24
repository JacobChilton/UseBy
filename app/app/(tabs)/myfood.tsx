import { Stack } from 'expo-router';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { Button, IconButton, Avatar, TextInput, DefaultTheme, PaperProvider, Text, Modal, Portal } from 'react-native-paper';

export default function MyFood() {
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
  const [items, setItems] = useState([]);

  const handleAddItem = () => {
    if (itemName.trim()) { 
      setItems([...items, itemName]); 
      setItemName('');
      setAddItemModalVisible(false);
    }
  };

  return (
    <PaperProvider theme={customTheme}>
      <View className="flex-1 p-10 pt-28">
        <Text>myFood</Text>

        <View className="mt-4">
  {items.map((item, index) => (
    <TouchableOpacity 
      key={index}
      style={{
        backgroundColor: '#6F4AAA',
        padding: 10,
        marginVertical: 5,
        borderRadius: 20,
      }}
      onPress={() => console.log(`Touched ${item}`)}
    >
      <Text 
        style={{ 
          color: 'white',
          paddingLeft: 5 
        }}
      >
        {item}
      </Text>
    </TouchableOpacity>
  ))}
</View>

        <Portal>
          <Modal
            visible={addItemModalVisible}
            onDismiss={() => setAddItemModalVisible(false)}
            contentContainerStyle={{
              backgroundColor: 'white',
              padding: 20,
              margin: 20,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 18, marginBottom: 20 }}>Product Name</Text>
            <TextInput
              placeholder='Enter item name'
              mode="outlined"
              style={{ backgroundColor: 'transparent', width: '100%', marginBottom: 20 }}
              value={itemName}
              onChangeText={setItemName} // Update itemName state as user types
            />

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

              <Button 
                mode="contained"
                onPress={() => {
                  setItemName(''); // Clear input on cancel
                  setAddItemModalVisible(false);
                }}
                style={{ flex: 1 }}
              >
                Close
              </Button>
            </View>
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
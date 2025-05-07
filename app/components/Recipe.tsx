import { ScrollView, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, DefaultTheme, Text } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
// I just realised ive been using the wrong purple. I will fix later - bitch

export const Recipe = () =>
{
    const [visible, setVisible] = useState<boolean>(false);

    return(
        <View>
            <TouchableOpacity
                key={0}
                style={{
                    backgroundColor: visible ? '#6F4AAA' : 'white',
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
                    setVisible(!visible);
                }}
            >
                <Text
                    style={{
                        color: visible ? 'white' : 'grey',
                        marginTop: 8,
                        paddingLeft: 5,
                    }}
                >
                    Carbonara
                </Text>

                {visible && (
                    <Text
                        style={{
                            marginTop: 5,
                            color: 'white',
                            paddingLeft: 5,
                        }}
                    >
                        Cheese, Pasta lol shit
                        
                    </Text>
                )}
                {visible && (
                    <Text
                        style={{
                            marginTop: 5,
                            color: 'white',
                            paddingLeft: 5,
                        }}
                    >
                        Cheese, Pasta again
                        
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

export default Recipe;
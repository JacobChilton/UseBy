import { ScrollView, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, DefaultTheme, Text } from 'react-native-paper';
import { useAPI } from '../components/APIProvider';
import { House, } from '../lib/api/APITypes';
import HouseList from '~/components/HouseList';
import CreateHouseModal from '~/components/CreateHouseModal';
import ProfileScanner from '~/components/ProfileScanner';
import { AggHouse } from '../lib/api/aggregated';
import Recipe from '~/components/Recipe';


// I just realised ive been using the wrong purple. I will fix later

export const Houses = () =>
{
   return(
    <View className="flex-1 p-10 gap-8">
    <Text className='text-4xl'>Recipes</Text>
        <div style={{ borderRadius: 10,
            borderWidth: 5,
            borderColor: 'grey',
            padding: 10,
            marginTop: 10
            }}>
            <h1>Recipe of the week</h1>
            <Recipe/>
        </div>            
   </View>);
}

export default Houses;
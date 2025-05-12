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
    return (
        <View className="flex-1 p-10 gap-8">
            <Text className='text-4xl'>Recipes</Text>
            <ScrollView>
                <View style={{
                    borderRadius: 10,
                    borderWidth: 5,
                    borderColor: '#7e4186',
                    padding: 10,
                    marginTop: 10
                }}>
                    <Text>Recommended Recipes:</Text>
                    <Recipe title="Carbonara"
                        ingredients="Spaghetti, 
                            Pancetta, 
                            Egg yolks, 
                            Pecorino Romano, 
                            Black pepper, 
                            Salt."
                        description="Uses 3 of your ingredients." />
                    <Recipe title="Greek Salad"
                        ingredients="Cucumber, 
                            Tomato, 
                            Red Onion, 
                            Kalamata Olives, 
                            Feta Cheese, 
                            Olive Oil, 
                            Oregano."
                        description="Uses 5 of your ingredients." />
                    <Recipe title="Ratatouille"
                        ingredients="Eggplant, 
                            Zucchini, 
                            Bell Pepper, 
                            Tomato, 
                            Onion, 
                            Garlic, 
                            Olive Oil."
                        description="Uses 6 of your ingredients."
                    />

                </View>
                <View style={{
                    borderRadius: 10,
                    borderWidth: 5,
                    borderColor: '#f3e37c',
                    padding: 10,
                    marginTop: 10
                }}>
                    <Text>Sponsored Recipes:</Text>
                    <Recipe title="Shakshuka"
                        ingredients="Eggs, 
                            Tomato, 
                            Bell Pepper, 
                            Onion, Garlic, 
                            Paprika, 
                            Cumin."
                        description="Uses 5 of your ingredients."
                        sponsor="Follow My socials @HarryLovesCooking on TikTok for more!"
                    />

                </View>
                <View style={{
                    borderRadius: 10,
                    borderWidth: 5,
                    borderColor: 'grey',
                    padding: 10,
                    marginTop: 10
                }}>
                    <Text>Previously used Recipes:</Text>
                    <Recipe title="Chicken and Egg Noodles"
                        ingredients="  Egg,
                            Egg Noodles,
                            Chicken,
                            Garlic,
                            Paprika,
                            Salt."
                        description="Uses 2 of your ingredients." />

                    <Recipe title="Tomato Basil Soup"
                        ingredients="Tomatoes, 
                            Basil, 
                            Garlic, 
                            Onion, 
                            Olive Oil, 
                            Salt, 
                            Pepper."
                        description="Uses 4 of your ingredients." />
                    <Recipe title="Beef Curry"
                        ingredients="Beef, 
                            Onion, 
                            Garlic, 
                            Curry Powder, 
                            Coconut Milk, 
                            Ginger, 
                            Salt."
                        description="Uses 4 of your ingredients."
                    />
                    <Recipe title="Spaghetti Bolognese"
                        ingredients="Ground Beef, 
                            Onion, 
                            Garlic, 
                            Tomato Paste, 
                            Carrot, 
                            Celery, 
                            Spaghetti."
                        description="Uses 5 of your ingredients."
                    />
                    <Recipe title="Cheese Toastie"
                        ingredients="Bread, 
                        Cheddar Cheese, 
                        Butter."
                        description="Uses 2 of your ingredients."
                    />
                </View>
            </ScrollView>
        </View>);
}

export default Houses;
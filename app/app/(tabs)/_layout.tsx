import { Link, Tabs } from 'expo-router';

import { HeaderButton } from '../../components/HeaderButton';
import { TabBarIcon } from '../../components/TabBarIcon';
import APIProvider from '../components/APIProvider';

export default function TabLayout()
{
    return (
        <APIProvider>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: 'black',
                }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
                    }}
                />
                <Tabs.Screen
          name="myfood" 
          options={{
            title: 'My Food',
            tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          }}
        />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                        tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
                    }}
                />
            </Tabs>
        </APIProvider>
    );
}

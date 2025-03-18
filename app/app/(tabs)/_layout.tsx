import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { TabBarIcon } from '../../components/TabBarIcon';
import APIProvider from '../components/APIProvider';
import { useNavigation } from 'expo-router';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Route } from '@react-navigation/native';


type TabParamList = { //screen for each tab
  index: undefined;
  myfood: undefined;
  profile: undefined;
};



// component that renders the tab bar with animations
const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    return (
      <View style={styles.tabBar}>
        {state.routes.map((route: Route<string>, index: number) => {
          const { options } = descriptors[route.key]; // getting options for each tab route
          const label = options.title || route.name; // label for each tab
          const isFocused = state.index === index; //checks if the tab is currently active
  
          const onPress = () => {
            if (!isFocused) {
              navigation.navigate(route.name as keyof TabParamList); // navigates to selected tab
            }
          };
  
          // ANIMATIONS!!!
          const scale = useSharedValue(1); // Initail scale value of each nav btn
          const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ scale: scale.value }],
          }));
  
          const handlePressIn = () => {
            scale.value = withSpring(1.3); // changes the scale of the btn when user is pressing it 
          };
  
          const handlePressOut = () => {
            scale.value = withSpring(1); // adds this springing annimation when you stop holding the btn down
          };
  
          const icons: Record<string, string> = { // the icons
            index: 'home',
            myfood: 'list',
            profile: 'user',
          };
  
          return (
            <TouchableOpacity
              key={route.key} //gives each tab a unique key
              onPress={onPress} // handling tab press events
              onPressIn={handlePressIn} 
              onPressOut={handlePressOut}
              style={styles.tabItem}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
            >
              <Animated.View style={[styles.iconContainer, animatedStyle]}>
                <TabBarIcon
                  name={(icons[route.name] || 'code') as any} // choosing the icon
                  color={isFocused ? '#6F4AAB' : '#666666'} // colour for when focused
                />
                <Text style={[styles.label, { color: isFocused ? '#6F4AAB' : '#666666' }]}>
                  {label}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  

export default function TabLayout() {
  return (
    <APIProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
          }}
        />
        <Tabs.Screen
          name="myfood"
          options={{
            title: 'My Food',
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
          }}
        />
      </Tabs>
    </APIProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
});
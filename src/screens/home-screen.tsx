import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeTabParamList } from '@/nav/types';
import PopularScreen from './popular-screen';
import AboutScreen from './about-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const HomeScreen = () => {
  const Tab = createBottomTabNavigator<HomeTabParamList>();
  return (
    <Tab.Navigator
      screenOptions={() => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#151515',
          borderTopWidth: 0
        },
        tabBarLabelStyle: {
          fontWeight: 'bold'
        }
      })}
    >
      <Tab.Screen
        name="Popular"
        component={PopularScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" color={color} size={30} />
          )
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="info" color={color} size={30} />
          )
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeScreen;

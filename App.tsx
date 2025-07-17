import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Feather from "react-native-vector-icons/Feather";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './Components/screens/HomeScreen';
import DiscoverScreen from './Components/screens/DiscoverScreen';
import LikeScreen from './Components/screens/LikeScreen';
import { colors } from './Components/theme';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { LikeImagesProvider } from './Components/context/LikeImageContext';



const Tab=createBottomTabNavigator();
const App = () => {
  return (
    <LikeImagesProvider>
      <NavigationContainer>
      <Tab.Navigator screenOptions={{
        headerShown:false,
        tabBarStyle:{
          backgroundColor:colors.primary,
        },
        tabBarInactiveTintColor:colors.inactiveTabColor,
        tabBarActiveTintColor:colors.activeTabColor,
        tabBarShowLabel:false,

      }}>
        <Tab.Screen name="Home" component={HomeScreen}
        options={{
          tabBarIcon:({color,focused,size})=><Feather name={"home"} color={color} size={size}></Feather>
        }}
        ></Tab.Screen>
        <Tab.Screen name="Discover" component={DiscoverScreen}
        options={{
          tabBarIcon:({color,focused,size})=><Feather name={"globe"} color={color} size={size}></Feather>
        }}></Tab.Screen>
        <Tab.Screen name="Likes" component={LikeScreen}
        options={{
          tabBarIcon:({color,focused,size})=><Feather name={"heart"} color={color} size={size}></Feather>
        }}></Tab.Screen>
      </Tab.Navigator>
      </NavigationContainer>
    </LikeImagesProvider>
  )
}

export default App

const styles = StyleSheet.create({})
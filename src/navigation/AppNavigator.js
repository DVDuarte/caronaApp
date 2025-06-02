import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import CreateCaronaScreen from "../screens/CreateCaronaScreen";
import CaronaDetailScreen from "../screens/CaronaDetailScreen";
import QRScannerScreen from "../screens/QRScannerScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CreateCarona" component={CreateCaronaScreen} />
        <Stack.Screen name="CaronaDetail" component={CaronaDetailScreen} />
        <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

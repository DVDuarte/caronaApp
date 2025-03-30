import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import CreateCaronaScreen from "../screens/CreateCaronaScreen";
import CaronaDetailScreen from "../screens/CaronaDetailScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CriarCarona" component={CreateCaronaScreen} />
        <Stack.Screen name="DetalhesCarona" component={CaronaDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

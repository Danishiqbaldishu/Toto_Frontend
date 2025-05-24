// Toto_Frontend/navigation/AppNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import OtpVerificationScreen from "../screens/OTPScreen";
import RoleSelectionScreen from "../screens/RoleSelectionScreen";  
import HomeScreen from "../screens/HomeScreen";
import LocationScreen from "../screens/LocationScreen";
import VehicleSelectScreen from "../screens/VehicleSelectScreen";
import ConfirmBookingScreen from "../screens/ConfirmBookingScreen";

// Naya FormScreen import karna hai
import FormScreen from "../screens/FormScreen";  // <-- Yeh file aapko banana hoga

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="OtpVerification"
          component={OtpVerificationScreen}
        />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} /> 
        {/* FormScreen add kar diya */}
        <Stack.Screen name="FormScreen" component={FormScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Location" component={LocationScreen} />
        <Stack.Screen name="VehicleSelect" component={VehicleSelectScreen} />
        <Stack.Screen name="ConfirmBooking" component={ConfirmBookingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

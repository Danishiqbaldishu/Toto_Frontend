import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import OtpVerificationScreen from "../screens/OTPScreen";
import RoleSelectionScreen from "../screens/RoleSelectionScreen";
import HomeScreen from "../screens/HomeScreen";
import LocationScreen from "../screens/LocationScreen";
import VehicleSelectScreen from "../screens/VehicleSelectScreen";
import ConfirmBookingScreen from "../screens/ConfirmBookingScreen";
import FormScreen from "../screens/FormScreen";
import SendParcelScreen from "../role/Parcel/SendParcelScreen";
import PickupLocationScreen from "../role/Parcel/PickupLocationScreen";
import MapSelectionScreen from "../role/Parcel/MapSelectionScreen";

// 👇 Import UserProvider
import { UserProvider } from "../context/UserContext";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <UserProvider>
      {/* Wrap everything inside UserProvider */}
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
          <Stack.Screen name="FormScreen" component={FormScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Location" component={LocationScreen} />
          <Stack.Screen name="VehicleSelect" component={VehicleSelectScreen} />
          <Stack.Screen
            name="ConfirmBooking"
            component={ConfirmBookingScreen}
          />
          <Stack.Screen name="SendParcelScreen" component={SendParcelScreen} />
          <Stack.Screen
            name="PickupLocationScreen"
            component={PickupLocationScreen}
          />
          <Stack.Screen
            name="MapSelectionScreen"
            component={MapSelectionScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

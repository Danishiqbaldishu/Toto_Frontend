// Toto_Frontend/screens/VehicleSelectScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function VehicleSelectScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Select Vehicle Type</Text>
      <Button title="Confirm Booking" onPress={() => navigation.navigate('ConfirmBooking')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 22, marginBottom: 20 },
});

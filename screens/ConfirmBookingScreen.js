// Toto_Frontend/screens/ConfirmBookingScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ConfirmBookingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Booking Confirmed!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 25, fontWeight: 'bold' },
});

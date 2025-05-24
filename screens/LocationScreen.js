// Toto_Frontend/screens/LocationScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function LocationScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Select Pickup & Drop Location</Text>
      <Button title="Select Vehicle" onPress={() => navigation.navigate('VehicleSelect')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 22, marginBottom: 20, textAlign: 'center' },
});

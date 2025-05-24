import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

export default function FormScreen({ route, navigation }) {
  const { selectedRole } = route.params;

  // Common state fields (adjust as needed)
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  
  // Role-specific state
  const [bikeModel, setBikeModel] = useState(""); // Rider
  const [carLicense, setCarLicense] = useState(""); // Driver
  const [courierDetails, setCourierDetails] = useState(""); // Porter

  const handleSubmit = () => {
    // Simple validation example
    if (!name || !phone) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    // Role specific validation
    if (selectedRole === "rider" && !bikeModel) {
      Alert.alert("Error", "Please enter your bike model");
      return;
    }
    if (selectedRole === "driver" && !carLicense) {
      Alert.alert("Error", "Please enter your car license number");
      return;
    }
    if (selectedRole === "porter" && !courierDetails) {
      Alert.alert("Error", "Please enter courier details");
      return;
    }

    // TODO: Send data to backend or move to next screen
    Alert.alert("Success", `Form submitted for role: ${selectedRole}`);
    // navigation.navigate("Home"); // Example next screen
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Fill details for {selectedRole.toUpperCase()}</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      {/* Role-specific inputs */}
      {selectedRole === "rider" && (
        <>
          <Text style={styles.label}>Bike Model</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your bike model"
            value={bikeModel}
            onChangeText={setBikeModel}
          />
        </>
      )}

      {selectedRole === "driver" && (
        <>
          <Text style={styles.label}>Car License Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your car license number"
            value={carLicense}
            onChangeText={setCarLicense}
          />
        </>
      )}

      {selectedRole === "porter" && (
        <>
          <Text style={styles.label}>Courier Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter courier details"
            value={courierDetails}
            onChangeText={setCourierDetails}
          />
        </>
      )}

      <View style={{ marginTop: 30 }}>
        <Button title="Submit" onPress={handleSubmit} color="#fc5731" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    marginTop: 12,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
});

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

export default function SendParcelScreen({ navigation, route }) {
  const [pickupLocation, setPickupLocation] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [selecting, setSelecting] = useState("pickup");

  useEffect(() => {
    const setupInitialLocation = async () => {
      const passedLocation = route.params?.location;

      if (!passedLocation) {
        Alert.alert("Error", "No location passed from previous screen.");
        return;
      }

      const { latitude, longitude } = passedLocation;

      const addressResult = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      const address = addressResult[0];

      const parts = [
        address.street,
        address.city,
        address.region,
        address.postalCode,
        address.country,
      ].filter(Boolean);

      const addressLine = parts.join(", ");

      setPickupLocation({ latitude, longitude, address: addressLine });
    };

    setupInitialLocation();
  }, []);

  useEffect(() => {
    const selected = route.params?.selectedLocation;
    if (selected) {
      (async () => {
        const addressResult = await Location.reverseGeocodeAsync(selected);
        const address = addressResult[0];

        const parts = [
          address.street,
          address.city,
          address.region,
          address.postalCode,
          address.country,
        ].filter(Boolean);

        const addressLine = parts.join(", ");

        const locationData = { ...selected, address: addressLine };
        if (selecting === "pickup") {
          setPickupLocation(locationData);
        } else {
          setDeliveryLocation(locationData);
        }
      })();
    }
  }, [route.params?.selectedLocation]);

  const handleLocationSelect = (type) => {
    setSelecting(type);
    navigation.navigate("PickupLocationScreen", { selecting: type });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Send Parcel</Text>

        <TouchableOpacity style={styles.helpButton}>
          <Text style={styles.helpIcon}>?</Text>
          <Text style={styles.helpText}>Help</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={[styles.contentArea, { backgroundColor: "#fef5e7" }]}>
        <View style={styles.locationBlock}>
          <View style={styles.locationBar}>
            <Ionicons name="location-sharp" size={18} color="#000" />
            <Text style={styles.locationLabel}>
              {selecting === "pickup" ? "Pick up from" : "Deliver to"}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#000" />
          </View>

          <TouchableOpacity
            style={styles.fullAddressBar}
            onPress={() => handleLocationSelect(selecting)}
          >
            <Text numberOfLines={3} style={styles.fullAddressText}>
              {selecting === "pickup"
                ? pickupLocation?.address || "Fetching address..."
                : deliveryLocation?.address || "Tap to select"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Selection Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.selectButton,
              selecting === "pickup" && styles.selectButtonActive,
            ]}
            onPress={() => handleLocationSelect("pickup")}
          >
            <Text
              style={[
                styles.selectButtonText,
                selecting === "pickup" && styles.selectButtonTextActive,
              ]}
            >
              Select Pickup Location
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.selectButton,
              selecting === "delivery" && styles.selectButtonActive,
            ]}
            onPress={() => handleLocationSelect("delivery")}
          >
            <Text
              style={[
                styles.selectButtonText,
                selecting === "delivery" && styles.selectButtonTextActive,
              ]}
            >
              Select Delivery Location
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.imageWrapper}>
          <Image
            source={require("../../assets/map-placeholder.png")}
            style={styles.topImage}
            resizeMode="contain"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#000" },
  helpIcon: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
    backgroundColor: "#eee",
    borderRadius: 10,
    width: 18,
    height: 18,
    textAlign: "center",
    lineHeight: 18,
    marginRight: 6,
  },
  helpButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  helpText: {
    color: "#000",
    fontWeight: "600",
  },
  contentArea: {
    flex: 1,
  },
  topImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  locationBlock: {
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  locationBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 5,
  },
  locationLabel: {
    marginHorizontal: 5,
    fontWeight: "bold",
    color: "#000",
    fontSize: 14,
  },
  fullAddressBar: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 1,
  },
  fullAddressText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
  },
  selectButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#fc5731",
  },
  selectButtonActive: { backgroundColor: "#fc5731" },
  selectButtonText: { color: "#fc5731", fontWeight: "600" },
  selectButtonTextActive: { color: "#fff" },
  imageWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
});

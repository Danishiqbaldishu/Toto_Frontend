import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

export default function PickupLocationScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = async (text) => {
    setQuery(text);

    if (text.length > 2) {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          text
        )}&addressdetails=1&limit=5&countrycodes=IN`; // India filter add kiya

        const response = await fetch(url, {
          headers: {
            "User-Agent": "TotoApp/1.0 (danish00iqbal786@gmail.com)",
            "Accept-Language": "en",
          },
        });

        const data = await response.json();

        const mappedSuggestions = data.map((item) => ({
          place_id: item.place_id,
          display_name: item.display_name,
          lat: item.lat,
          lon: item.lon,
          address: item.address,
        }));

        setSuggestions(mappedSuggestions);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleUseCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    navigation.navigate("SendParcelScreen", {
      selectedLocation: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: "Current Location",
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          placeholder="Where is your PickUp?"
          value={query}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.place_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => {
              navigation.navigate("SendParcelScreen", {
                selectedLocation: {
                  latitude: parseFloat(item.lat),
                  longitude: parseFloat(item.lon),
                  address: item.display_name,
                },
              });
            }}
          >
            <Ionicons name="location-outline" size={18} color="#fc5731" />
            <Text style={styles.suggestionText}>{item.display_name}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      />

      <View style={styles.bottomRow}>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() =>
            navigation.navigate("MapSelectionScreen", {
              useCurrentLocation: true,
            })
          }
        >
          <Ionicons name="navigate" size={18} color="#fff" />
          <Text style={styles.bottomButtonText}>Use Current Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => navigation.navigate("MapSelectionScreen")}
        >
          <Ionicons name="map" size={18} color="#fff" />
          <Text style={styles.bottomButtonText}>Locate on the Map</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fef5e7",
    paddingTop: 50,
  },
  topBar: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  suggestionText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#333",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  bottomButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fc5731",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
  },
  bottomButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 6,
  },
});

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Animated,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

const roles = [
  { id: "rider", label: "As a Rider", icon: "bicycle" },
  { id: "driver", label: "As a Driver", icon: "car-sport" },
  { id: "porter", label: "Use for send parcel", icon: "cube" },
];

export default function RoleSelectionScreen({ navigation }) {
  const [pressedItem, setPressedItem] = useState(null);

const handleSelectRole = async (role) => {
  if (role === "porter") {
    try {
      // Always ask for permission directly
      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        if (canAskAgain) {
          alert("Location permission is required to send parcels.");
        } else {
          alert(
            "Location permission has been permanently denied. Please enable it from app settings."
          );
        }
        return;
      }

      // Fetch location after permission is granted
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      navigation.navigate("SendParcelScreen", {
        location: { latitude, longitude },
      });

    } catch (error) {
      console.warn("Error fetching location:", error);
      alert("Could not fetch location. Please try again.");
    }

  } else {
    navigation.navigate("FormScreen", { selectedRole: role });
  }
};


  const renderItem = ({ item }) => {
    const scale = new Animated.Value(1);

    const handlePressIn = () => {
      setPressedItem(item.id);
      Animated.spring(scale, {
        toValue: 0.97,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start(() => {
        handleSelectRole(item.id);
        setPressedItem(null);
      });
    };

    return (
      <Animated.View style={{ transform: [{ scale }], width: "100%" }}>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          style={styles.cardWrapper}
        >
          <LinearGradient
            colors={["#ed3436", "#fc5731"]}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name={item.icon} size={36} color="#fff" />
            <Text style={styles.cardText}>{item.label}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topContainer}>
        <Image
          source={require("../assets/role-banner.png")}
          style={styles.banner}
        />
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.title}>How do you want to login in Toto?</Text>
        <View style={styles.underline} />

        <FlatList
          data={roles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  sectionContainer: {
    flex: 1,
    justifyContent: "flex-start",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  topContainer: {
    backgroundColor: "#ffece8",
    paddingHorizontal: 0,
  },
  banner: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 10,
    color: "#333",
  },
  underline: {
    width: 180,
    height: 2,
    backgroundColor: "#fc5731",
    alignSelf: "center",
    marginVertical: 10,
    borderRadius: 2,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardWrapper: {
    marginBottom: 20,
    borderRadius: 50,
    overflow: "hidden",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 25,
    paddingHorizontal: 25,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cardText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
  },
});

import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";
import { UserContext } from "../../context/UserContext";
import { AntDesign } from '@expo/vector-icons';

const SCREEN_HEIGHT = Dimensions.get("window").height;
const PANEL_MIN_HEIGHT = 120;
const PANEL_MAX_HEIGHT = SCREEN_HEIGHT * 0.75;

export default function PickupLocationScreen({ navigation, route }) {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("Fetching address...");
  const [house, setHouse] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderMobile, setSenderMobile] = useState("");
  const [useMyMobile, setUseMyMobile] = useState(false);
  const [saveAs, setSaveAs] = useState("");
  const [otherSaveAs, setOtherSaveAs] = useState("");
  const { loggedInMobile } = useContext(UserContext);

  const panY = useRef(
    new Animated.Value(SCREEN_HEIGHT - PANEL_MIN_HEIGHT)
  ).current;
  const lastPanY = useRef(SCREEN_HEIGHT - PANEL_MIN_HEIGHT);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderMove: (evt, gestureState) => {
        let newPos = lastPanY.current + gestureState.dy;
        if (newPos < SCREEN_HEIGHT - PANEL_MAX_HEIGHT)
          newPos = SCREEN_HEIGHT - PANEL_MAX_HEIGHT;
        else if (newPos > SCREEN_HEIGHT - PANEL_MIN_HEIGHT)
          newPos = SCREEN_HEIGHT - PANEL_MIN_HEIGHT;
        panY.setValue(newPos);
      },

      onPanResponderRelease: (evt, gestureState) => {
        let shouldExpand = false;
        if (gestureState.vy < -0.3) shouldExpand = true;
        else if (gestureState.vy > 0.3) shouldExpand = false;
        else
          shouldExpand =
            panY._value <
            SCREEN_HEIGHT - (PANEL_MIN_HEIGHT + PANEL_MAX_HEIGHT) / 2;

        const toValue = shouldExpand
          ? SCREEN_HEIGHT - PANEL_MAX_HEIGHT
          : SCREEN_HEIGHT - PANEL_MIN_HEIGHT;

        Animated.spring(panY, {
          toValue,
          useNativeDriver: false,
          bounciness: 10,
        }).start(() => {
          lastPanY.current = toValue;
        });
      },
    })
  ).current;

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      let latitude, longitude;

      if (route.params?.useCurrentLocation) {
        const loc = await Location.getCurrentPositionAsync({});
        latitude = loc.coords.latitude;
        longitude = loc.coords.longitude;
      } else {
        const loc = await Location.getCurrentPositionAsync({});
        latitude = loc.coords.latitude;
        longitude = loc.coords.longitude;
      }

      setLocation({
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      const addressResult = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (addressResult.length > 0) {
        const addr = addressResult[0];
        const parts = [
          addr.name,
          addr.street,
          addr.city,
          addr.region,
          addr.postalCode,
          addr.country,
        ].filter(Boolean);
        setAddress(parts.join(", "));
      }
    })();
  }, []);

  useEffect(() => {
    if (useMyMobile) setSenderMobile(loggedInMobile);
    else setSenderMobile("");
  }, [useMyMobile, loggedInMobile]);

  const onConfirm = () => {
    const finalSaveAs = saveAs === "Other" ? otherSaveAs : saveAs;
    if (!location) {
      alert("Location not found yet");
      return;
    }
    if (!senderName.trim()) {
      alert("Please enter sender's name");
      return;
    }
    if (!senderMobile.trim()) {
      alert("Please enter sender's mobile number");
      return;
    }
    navigation.navigate("SendParcelScreen", {
      selectedLocation: {
        latitude: location.latitude,
        longitude: location.longitude,
        address,
        house,
        senderName,
        senderMobile,
        saveAs: finalSaveAs,
      },
    });
  };

  const mapHeight = panY.interpolate({
    inputRange: [
      SCREEN_HEIGHT - PANEL_MAX_HEIGHT,
      SCREEN_HEIGHT - PANEL_MIN_HEIGHT,
    ],
    outputRange: [SCREEN_HEIGHT * 0.7, SCREEN_HEIGHT - PANEL_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Location</Text>
        <View style={{ width: 28 }} />
      </View>

      {location && (
        <Animated.View style={{ height: mapHeight }}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={location}
            region={location}
            onRegionChangeComplete={(region) => {
              setLocation(region);
              Location.reverseGeocodeAsync({
                latitude: region.latitude,
                longitude: region.longitude,
              }).then((addressResult) => {
                if (addressResult.length > 0) {
                  const addr = addressResult[0];
                  const parts = [
                    addr.name,
                    addr.street,
                    addr.city,
                    addr.region,
                    addr.postalCode,
                    addr.country,
                  ].filter(Boolean);
                  setAddress(parts.join(", "));
                }
              });
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
            loadingEnabled={true}
          />
          <View pointerEvents="none" style={styles.pinContainer}>
            <Ionicons name="location-sharp" size={40} color="#fc5731" />
          </View>
        </Animated.View>
      )}

      <Animated.View
        style={[
          styles.bottomPanel,
          {
            height: PANEL_MAX_HEIGHT,
            position: "absolute",
            left: 0,
            right: 0,
            top: panY,
          },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Handle bar */}
        <View style={styles.handleBarContainer}>
          <View style={styles.handleBar} />
        </View>
        
          <ScrollView
            style={{ paddingHorizontal: 20 }}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 20,paddingBottom: 0 }}
             showsVerticalScrollIndicator={false}
          >
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={25} color="#fc5731" />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.locationLabel}>Location</Text>
                <Text style={styles.locationAddress} numberOfLines={2}>
                  {address}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => alert("Change address functionality")}
                style={styles.changeButton}
              >
                <Text style={{ color: "#fc5731", fontWeight: "bold" }}>
                  Change
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="House/Apartment/Shop (Optional)"
              style={styles.input}
              value={house}
              onChangeText={setHouse}
            />
            <TextInput
              placeholder="Sender's Name"
              style={styles.input}
              value={senderName}
              onChangeText={setSenderName}
            />
            <View style={styles.mobileRow}>
              <TextInput
                placeholder="Sender's Mobile Number"
                style={[styles.input, { flex: 1 }]}
                value={senderMobile}
                keyboardType="phone-pad"
                onChangeText={setSenderMobile}
              />
            </View>
            <View style={styles.checkboxRow}>
              <Switch
                value={useMyMobile}
                onValueChange={setUseMyMobile}
                trackColor={{ false: "#aaa", true: "#fc5731" }}
                thumbColor={useMyMobile ? "#fff" : "#f4f3f4"}
              />
              <Text style={{ marginLeft: 8 }}>
                Use my mobile number: {loggedInMobile || ""}
              </Text>
            </View>
            <Text style={styles.saveAsLabel}>Save as (Optional):</Text>
            <View style={styles.saveAsButtons}>
              {["Home", "Shop", "Other"].map((label) => (
                <TouchableOpacity
                  key={label}
                  style={[
                    styles.saveAsBtn,
                    saveAs === label && styles.saveAsBtnSelected,
                  ]}
                  onPress={() => setSaveAs(label)}
                >
                  {label === "Home" && (
                    <Ionicons
                      name="home-outline"
                      size={20}
                      color={saveAs === "Home" ? "#fff" : "#fc5731"}
                    />
                  )}
                  {label === "Shop" && (
                    <MaterialIcons
                      name="storefront"
                      size={20}
                      color={saveAs === "Shop" ? "#fff" : "#fc5731"}
                    />
                  )}
                  {label === "Other" && (
                    <AntDesign
                      name="hearto"
                      size={20}
                      color={saveAs === "Other" ? "#fff" : "#fc5731"}
                    />
                  )}
                  <Text
                    style={[
                      styles.saveAsBtnText,
                      saveAs === label && { color: "#fff" },
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {saveAs === "Other" && (
              <TextInput
                placeholder="Specify other"
                style={[styles.input, { marginTop: 10 }]}
                value={otherSaveAs}
                onChangeText={setOtherSaveAs}
              />
            )}

            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
              <Text style={styles.confirmBtnText}>Confirm and Proceed</Text>
            </TouchableOpacity>
          </ScrollView>
      
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 15,
    paddingBottom: 10,
    backgroundColor: "#fef5e7",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#000" },
  map: { flex: 1 },
  bottomPanelWrapper: {
    height: 380,
    backgroundColor: "transparent",
  },
  bottomPanel: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  handleBarContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  handleBar: {
    width: 40,
    height: 6,
    backgroundColor: "#ccc",
    borderRadius: 3,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  locateBtn: {
    backgroundColor: "#fc5731",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  locateBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  locationLabel: { fontWeight: "bold", fontSize: 16 },
  locationAddress: { color: "#666", fontSize: 14 },
  changeButton: { paddingHorizontal: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    marginVertical: 8,
    fontSize: 16,
  },
  mobileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  saveAsLabel: { marginTop: 12, fontWeight: "bold", color: "#333" },
  saveAsButtons: {
    flexDirection: "row",
    marginTop: 10,
  },
  saveAsBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#fc5731",
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  saveAsBtnSelected: {
    backgroundColor: "#fc5731",
  },
  saveAsBtnText: {
    marginLeft: 6,
    color: "#fc5731",
    fontWeight: "600",
  },
  confirmBtn: {
    backgroundColor: "#fc5731",
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 20,
    alignItems: "center",
  },
  confirmBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  pinContainer: {
  position: "absolute",
  top: "40%", // adjust depending on how you want it
  left: "50%",
  marginLeft: -20, // half icon size
  marginTop: -40, // half icon height
  zIndex: 10,
},
});

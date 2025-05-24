import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient"; // ✅ Correct import for Expo
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState("");
  const isValid = phone.length === 10;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Banner + Help */}
        <View style={styles.topContainer}>
          <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpIcon}>?</Text>
            <Text style={styles.helpText}>Help</Text>
          </TouchableOpacity>

          <Image
            source={require("../assets/banner.png")}
            style={styles.banner}
          />
        </View>

        {/* Phone Input */}
        <View style={styles.sectionContainer}>
          <View style={styles.inputBox}>
            <Text style={styles.title}>What's your number?</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.prefix}>+91</Text>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                placeholder="Enter your phone number"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
              />
            </View>
          </View>

          {/* Bottom */}
          <View style={styles.bottomSection}>
            <Text style={styles.terms}>
              By continuing, you agree to the{" "}
              <Text
                style={styles.link}
                onPress={() => navigation.navigate("Terms")}
              >
                T&C
              </Text>{" "}
              and{" "}
              <Text
                style={styles.link}
                onPress={() => navigation.navigate("Privacy")}
              >
                Privacy Policy
              </Text>
            </Text>

            {isValid ? (
              <TouchableOpacity onPress={() => navigation.navigate("OtpVerification", { phone })}>
                <LinearGradient
                  colors={["#ed3436", "#fc5731"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.nextButton}
                >
                  <Text style={styles.nextText}>Next</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <View style={[styles.nextButton, { backgroundColor: "#ccc" }]}>
                <Text style={styles.nextText}>Next</Text>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    justifyContent: "flex-start",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  topContainer: {
    position: "relative",
  },
  helpButton: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 164,
    right: 5,
    zIndex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
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
  helpText: {
    color: "#000",
    fontWeight: "600",
  },
  banner: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginTop: 0,
  },
  inputBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1, // changed from borderBottomWidth to borderWidth
    borderColor: "#ccc",
    paddingHorizontal: 10, // thoda horizontal padding diya
    paddingVertical: 3, // thoda vertical padding diya
    borderRadius: 30, // rounded corners
    marginBottom: 15, // thoda niche space
  },
  prefix: {
    fontSize: 18,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 18,
  },
  bottomSection: {
    marginTop: "auto",
    paddingHorizontal: 20,
    paddingVertical: 3,
    paddingBottom: 30,
  },
  terms: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  link: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  nextButton: {
    paddingVertical: 15,
    borderRadius: 25, // thoda zyada radius for smoother corners
    alignItems: "center",
    paddingHorizontal: 20, // thoda horizontal padding bhi add kar sakte hain
  },
  nextText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
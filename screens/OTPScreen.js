import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

export default function OTPScreen({ navigation, route }) {
  const { phone } = route.params;
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [counter, setCounter] = useState(30);
  const inputsRef = useRef([]);
  const TEMP_OTP = "123456"; // Temporary OTP for development

  useEffect(() => {
    let timer;
    if (counter > 0) {
      timer = setTimeout(() => setCounter(counter - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [counter]);

  const onChangeOtp = (text, index) => {
    if (/^\d*$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (text && index < 5) {
        inputsRef.current[index + 1].focus();
      }
      if (!text && index > 0) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  const onResendPress = () => {
    if (counter === 0) {
      setCounter(30);
      alert("OTP resent");
    }
  };

  const onSendViaWhatsapp = () => {
    alert("Send OTP via WhatsApp triggered");
  };

  const handleNextPress = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp === TEMP_OTP) {
      navigation.replace("RoleSelection");
    } else {
      Alert.alert("Invalid OTP", "Please enter the correct OTP to continue.");
    }
  };

  const isValid = otp.every((digit) => digit.length === 1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Verify OTP</Text>

        <TouchableOpacity style={styles.helpButton}>
          <Text style={styles.helpIcon}>?</Text>
          <Text style={styles.helpText}>Help</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.enterCodeContainer}>
          <Text style={styles.subtitle}>Enter Verification Code</Text>
        </View>
        <Text style={styles.sentTo}>Sent to +91 {phone}</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              style={styles.otpBox}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => onChangeOtp(text, index)}
              textAlign="center"
              selectionColor="#ed3436"
            />
          ))}
        </View>

        <View style={styles.resendContainer}>
          <TouchableOpacity onPress={onResendPress} disabled={counter !== 0}>
            <Text
              style={[
                styles.resendText,
                counter !== 0 ? styles.disabled : styles.resendEnabled,
              ]}
            >
              {counter === 0 ? "Resend" : `Resend in ${counter}s`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onSendViaWhatsapp} style={styles.whatsappButton}>
            <FontAwesome name="whatsapp" size={20} color="#25D366" style={styles.whatsappIcon} />
            <Text style={styles.whatsappText}>Send via WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.agreeText}>
          By tapping on "Send via WhatsApp", you agree to receive important
          communications such as OTP and payment details, over WhatsApp
        </Text>
        {isValid ? (
          <TouchableOpacity onPress={handleNextPress}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  enterCodeContainer: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 10,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  sentTo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 25,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  otpBox: {
    borderWidth: 1,
    borderColor: "#ed3436",
    borderRadius: 10,
    width: 45,
    height: 50,
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  resendText: {
    fontWeight: "600",
    fontSize: 16,
  },
  disabled: {
    color: "#aaa",
  },
  resendEnabled: {
    color: "#ed3436",
  },
  whatsappButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  whatsappIcon: {
    marginRight: 4,
  },
  whatsappText: {
    color: "#000",
    fontWeight: "500",
    fontSize: 15,
  },
  agreeText: {
    fontSize: 12,
    color: "#444",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 18,
    marginLeft: 20,
    marginRight: 20,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  nextButton: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  nextText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

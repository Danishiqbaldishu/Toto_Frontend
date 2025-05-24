import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login');
    }, 3000); // 3 seconds delay
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/toto-logo.png')} // save logo as toto-logo.png
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fef5e7' },
  logo: { width: 200, height: 200 },
});

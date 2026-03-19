import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Image,
  Easing,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import HLogo from '../assets/images/hlogo.png';
import { useAuth } from '../context/AuthContext';

type Props = StackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1200,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      if (user) {
        navigation.replace('Main');
      } else {
        navigation.replace('Login');
      }
    }, 2000); // 2 sec-es splash

    return () => clearTimeout(timeout);
  }, [user]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={HLogo}
        style={[
          styles.logo,
          {
            transform: [{ scale: scaleAnim }],
            opacity: scaleAnim,
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbe9d0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 300,
  },
});

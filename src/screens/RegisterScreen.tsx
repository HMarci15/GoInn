import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  Image,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faHotel} from '@fortawesome/free-solid-svg-icons/faHotel';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash';
import HLogo from  '../assets/images/hlogo.png'
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../types/navigation';
import auth from '@react-native-firebase/auth';
import { useAuth } from '../context/AuthContext';
import Toast from 'react-native-toast-message';
import firestore from '@react-native-firebase/firestore';

type Props = StackScreenProps<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({navigation}) => {

  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [vezeteknev, setVezeteknev] = useState('');
  const [keresztnev, setKeresztnev] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Toast.show({
      type: 'error',
      text1: 'Hibás email formátum',
      text2: 'Kérlek, adj meg egy érvényes email címet.',
      position: 'bottom',
      visibilityTime: 3000,
      bottomOffset: 40,
    });
    return;
  }

  if (password.length < 8) {
  Toast.show({
    type: 'error',
    text1: 'Gyenge jelszó',
    text2: 'A jelszónak legalább 8 karakter hosszúnak kell lennie.',
    position: 'bottom',
    visibilityTime: 3000,
    bottomOffset: 40,
  });
  return;
}

     try {
      const result = await auth().createUserWithEmailAndPassword(email, password);
      const user = result.user;

      await firestore().collection('users').doc(user.uid).set({
       email,
       vezeteknev,
       keresztnev,
       createdAt: firestore.FieldValue.serverTimestamp(),
      });

      //await auth().signOut();

      Toast.show({
        type: 'success',
        text1: 'Sikeres regisztráció!',
        position: 'bottom',
        visibilityTime: 3000,
        autoHide: true,
        bottomOffset: 40,
      });

      navigation.replace('Main');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        Toast.show({
          type: 'error',
          text1: 'Ez az email cím már regisztrálva van!',
          text2: 'Kérlek, használj másik email címet.',
          position: 'bottom',
          visibilityTime: 3000,
          autoHide: true,
          bottomOffset: 40,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Hiba',
          text2: error.message,
          position: 'bottom',
          visibilityTime: 3000,
          autoHide: true,
          bottomOffset: 40,
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
      source={HLogo}
      style = {styles.iconcontainerrs}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Vezetéknév"
          placeholderTextColor="#424242"
          onChangeText={setVezeteknev}
          value={vezeteknev}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Keresztnév"
          placeholderTextColor="#424242"
          onChangeText={setKeresztnev}
          value={keresztnev}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email-cím"
          placeholderTextColor="#424242"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />
      </View>

      <View style={[styles.inputContainer, { flexDirection: 'row', alignItems: 'center' }]}>
        <TextInput
          style={[styles.input, { flex: 1 , marginLeft: 36, /* paddingLeft: 20 */}]} 
          placeholder="Jelszó"
          placeholderTextColor="#424242"
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
          value={password}
        />

        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={{ paddingHorizontal: 8 }}
        >
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            size={20}
            color="#424242"
          />
        </TouchableOpacity>
      </View>



      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}>
        <Text style={styles.buttonText}>Regisztráció és belépés</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Vissza a belépéshez</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbe9d0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconcontainerrs: {
    marginBottom: 30,
    width: 265,
    height: 265,
    resizeMode: 'contain'
  },
  inputContainer: {
    width: '90%',
    padding: 5,
    borderWidth: 1.5,
    borderColor: '#000000',
    borderRadius: 15,
    backgroundColor: '#ffd18b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  input: {
    width: '90%',
    height: 45,
    backgroundColor: '#fbe9d0',
    borderWidth: 1.5,
    borderColor: '#000000',
    borderRadius: 10,
    textAlign: 'center',
    //fontStyle: 'italic',
    fontSize: 18,
    color: '#000',
    //paddingHorizontal: 90
  },
  button: {
    backgroundColor: '#ffd18b',
    borderWidth: 1.5,
    borderColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;

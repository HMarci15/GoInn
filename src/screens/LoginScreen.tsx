import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';
import {StackScreenProps} from '@react-navigation/stack';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faHotel} from '@fortawesome/free-solid-svg-icons/faHotel';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash';
import HLogo from  '../assets/images/hlogo.png'
import auth from '@react-native-firebase/auth';
import { useAuth } from '../context/AuthContext';
import Toast from 'react-native-toast-message';

type Props = StackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({navigation}) => {

  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
  if (user && navigation.isFocused() && navigation.canGoBack()) {
    navigation.replace('Main');
  }
}, [user]);


  const handleLogin = async () => {

     try {
    await login(email, password);
    Toast.show({
      type: 'success',
      text1: 'Sikeres belépés!',
      position: 'bottom',
      visibilityTime: 3000,
      autoHide: true,
      bottomOffset: 40,
    });
    navigation.replace('Main');
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Hibás e-mail-cím vagy jelszó!',
      text2: error.message,
      position: 'bottom',
      visibilityTime: 3000,
      autoHide: true,
      bottomOffset: 40,
    });
  }
  };

  return (
    <View style={styles.container}>
      <Image
      source={HLogo}
      style = {styles.iconcontainerls}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="E-mail-cím"
          placeholderTextColor="#424242"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
        />
      </View>

    {/*<View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Jelszó"
          placeholderTextColor="#424242"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
      </View> */}

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

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}>
          <Text style={styles.buttonText}>Belépés</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Register')}>
          <Text style={styles.buttonText}>Regisztráció</Text>
        </TouchableOpacity>
      </View>
       
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
  iconcontainerls: {
    marginBottom: 30,
    width: 350,
    height: 350,
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
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '93%',
  },
  button: {
    flex: 1,
    backgroundColor: '#ffd18b',
    borderWidth: 1.5,
    borderColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;

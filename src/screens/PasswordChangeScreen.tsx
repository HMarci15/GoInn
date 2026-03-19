import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator  } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleLeft } from '@fortawesome/free-regular-svg-icons/faCircleLeft';
import { faKey } from '@fortawesome/free-solid-svg-icons/faKey';
import auth from '@react-native-firebase/auth';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash';
import Toast from 'react-native-toast-message';

type Props = StackScreenProps<RootStackParamList, 'PasswordChange'>;

const PasswordChangeScreen: React.FC<Props> = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
       Toast.show({
        type: 'error',
        text1: 'Hiba',
        text2: 'A két új jelszó nem egyezik!',
        position: 'bottom',
        visibilityTime: 3000,
        autoHide: true,
        bottomOffset: 40,
      });
      return;
    }

    setLoading(true);

    try {
      const user = auth().currentUser;
      if (user) {
        const credential = auth.EmailAuthProvider.credential(user.email!, oldPassword);
        await user.reauthenticateWithCredential(credential); //regi ell.

        await user.updatePassword(newPassword); //uj beallit
        Toast.show({
          type: 'success',
          text1: 'Siker',
          text2: 'A jelszó sikeresen módosítva!',
          position: 'bottom',
          visibilityTime: 3000,
          autoHide: true,
          bottomOffset: 40,
        });
      }
    } catch (error) {
      console.error('Jelszó módosítása hiba:', error);
      Toast.show({
        type: 'error',
        text1: 'Hiba',
        text2: 'Nem sikerült módosítani a jelszót. Ellenőrizd a régi jelszót és próbáld újra.',
        position: 'bottom',
        visibilityTime: 3000,
        autoHide: true,
        bottomOffset: 40,
      });
      } finally { 
      setLoading(false); 
    }
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faCircleLeft} size={40} color="black" />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.headerText}>Jelszó módosítása</Text>
        </View>
        <View style={styles.iconButton} />
      </View>

      <FontAwesomeIcon icon={faKey} size={110} color="#000000" style={styles.keyIcon} />

    <View style={styles.formContainer}>
      {/* <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Régi jelszó"
          secureTextEntry
          value={oldPassword}
          onChangeText={setOldPassword}
        />
        </View> */}

        <View style={[styles.inputContainer, { flexDirection: 'row', alignItems: 'center' }]}>
        <TextInput
          style={[styles.input, { flex: 1 , marginLeft: 36, /* paddingLeft: 20 */}]} 
          placeholder="Régi jelszó"
          placeholderTextColor="#424242"
          secureTextEntry={!showOldPassword}
          onChangeText={setOldPassword}
          value={oldPassword}
        />
        
        <TouchableOpacity
          onPress={() => setShowOldPassword(!showOldPassword)}
          style={{ paddingHorizontal: 8 }}
        >
          <FontAwesomeIcon
            icon={showOldPassword ? faEyeSlash : faEye}
            size={20}
            color="#424242"
          />
        </TouchableOpacity>
      </View>

      {/* <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Új jelszó"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
      </View>   */}  

      <View style={[styles.inputContainer, { flexDirection: 'row', alignItems: 'center' }]}>
        <TextInput
          style={[styles.input, { flex: 1 , marginLeft: 36, /* paddingLeft: 20 */}]} 
          placeholder="Új jelszó"
          placeholderTextColor="#424242"
          secureTextEntry={!showNewPassword}
          onChangeText={setNewPassword}
          value={newPassword}
        />
        
        <TouchableOpacity
          onPress={() => setShowNewPassword(!showNewPassword)}
          style={{ paddingHorizontal: 8 }}
        >
          <FontAwesomeIcon
            icon={showNewPassword ? faEyeSlash : faEye}
            size={20}
            color="#424242"
          />
        </TouchableOpacity>
      </View>
    
      {/* <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Új jelszó megerősítése"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View> */}

      <View style={[styles.inputContainer, { flexDirection: 'row', alignItems: 'center' }]}>
        <TextInput
          style={[styles.input, { flex: 1 , marginLeft: 36, /* paddingLeft: 20 */}]} 
          placeholder="Új jelszó megerősítése"
          placeholderTextColor="#424242"
          secureTextEntry={!showConfirmPassword}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
        />
        
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={{ paddingHorizontal: 8 }}
        >
          <FontAwesomeIcon
            icon={showConfirmPassword  ? faEyeSlash : faEye}
            size={20}
            color="#424242"
          />
        </TouchableOpacity>
      </View>    
    </View>

    {loading ? ( 
        <ActivityIndicator size="large" color="#000000" style={styles.loadingIndicator} /> 
      ) : (  
        <TouchableOpacity style={styles.button} onPress={handlePasswordChange}>
          <Text style={styles.buttonText}>Jelszó módosítása</Text>
        </TouchableOpacity>
      )}
      
    </View>
  );
};

const styles = StyleSheet.create({
   container: {
    flexGrow: 1,
    backgroundColor: '#fbe9d0',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 80,
  },
    topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
    backgroundColor: '#fbe9d0',
    paddingVertical: 4,
    borderColor: '#000000',
    marginBottom: 25,
  },
  iconButton: {
    padding: 10,
    width: 60,
    alignItems: 'center',
  },
  header: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffd18b',
    borderRadius: 25,
    borderWidth: 1.5,
    padding: 8,
  },
  headerText: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#000',
  },
  keyIcon: {
    marginTop: 40,
  },
   formContainer: {
    width: '90%',
    //backgroundColor: '#fff2d5',
    //borderRadius: 20,
    //borderWidth: 1.5,
    //borderColor: '#000',
    marginTop: 60,
    alignItems: 'center', 
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
    fontSize: 17,
    color: '#000',
  },
  loadingIndicator: { 
    marginTop: 20,
  },
  button: {
    backgroundColor: '#ffd18b',
    width: '60%', 
    alignSelf: 'center', 
    marginTop: 20, 
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#000',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PasswordChangeScreen;

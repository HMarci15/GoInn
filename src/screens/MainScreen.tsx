import React, { useState } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../types/navigation';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowRightFromBracket} from '@fortawesome/free-solid-svg-icons/faArrowRightFromBracket';
import {faCircleUser} from '@fortawesome/free-regular-svg-icons/faCircleUser';
import {faLocationArrow} from '@fortawesome/free-solid-svg-icons/faLocationArrow';
import {faBed} from '@fortawesome/free-solid-svg-icons/faBed';
import {faAward} from '@fortawesome/free-solid-svg-icons/faAward';
import {faUtensils} from '@fortawesome/free-solid-svg-icons/faUtensils';
import {faNewspaper} from '@fortawesome/free-solid-svg-icons/faNewspaper';
import {faTriangleExclamation} from '@fortawesome/free-solid-svg-icons/faTriangleExclamation';
import { useAuth } from '../context/AuthContext'; 
import Toast from 'react-native-toast-message';

type Props = StackScreenProps<RootStackParamList, 'Main'>;

const MainScreen: React.FC<Props> = ({navigation}) => {

  const { logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      Toast.show({
        type: 'success',
        text1: 'Sikeres kijelentkezés!',
        position: 'bottom',
        visibilityTime: 3000,
        autoHide: true,
        bottomOffset: 40,
    });
      navigation.replace('Login'); // visszalepes elkerulese
    } catch (error: any) {
      console.error('Kijelentkezés hiba:', error.message);
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
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setModalVisible(true)}>
          <FontAwesomeIcon
            icon={faArrowRightFromBracket}
            size={40}
            color="black"
          />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.headerText}>Főoldal</Text>
        </View>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('Profile')}>
          <FontAwesomeIcon icon={faCircleUser} size={40} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Location')}>
          <FontAwesomeIcon icon={faLocationArrow} size={70} color="black" />
          <View style={styles.menuTextBox}>
            <Text style={styles.menuText}>Navigáció</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Booking', {})}>
          <FontAwesomeIcon icon={faBed} size={70} color="black" />
          <View style={styles.menuTextBox}>
            <Text style={styles.menuText}>Szobafoglalás</Text>
          </View>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.menuButton}>
          <FontAwesomeIcon icon={faAward} size={70} color="black" />
          <Text style={styles.menuText}>Szolgáltatások & Szobaszervíz</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Gastronomy')}>
          <FontAwesomeIcon icon={faUtensils} size={70} color="black" />
          <View style={styles.menuTextBox}>
            <Text style={styles.menuText}>Gasztronómia</Text>
          </View>
        </TouchableOpacity>

{/*         <TouchableOpacity style={styles.menuButton}>
          <FontAwesomeIcon icon={faNewspaper} size={70} color="black" />
          <Text style={styles.menuText}>Programok & Újdonságok</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.menuButton}
        onPress={() => navigation.navigate('Issue', {
          photoPath: undefined,
          tempRoom: undefined,
          tempDescription: undefined,
        })}>
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            size={70}
            color="black"
          />
          <View style={styles.menuTextBox}>
            <Text style={styles.menuText}>Probléma bejelentése</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Kijelentkezés megerősítő Modal */}
<Modal
  transparent
  visible={modalVisible}
  animationType="fade"
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>
      <Text style={styles.modalTitle}>Kijelentkezés</Text>
      <Text style={styles.modalText}>Biztosan ki szeretnél jelentkezni?</Text>

      <View style={styles.modalButtons}>
        <TouchableOpacity
          style={[styles.modalButton, styles.cancelButton]}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.modalButtonTextNo}>Mégse</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modalButton, styles.confirmButton]}
          onPress={() => {
            setModalVisible(false);
            handleLogout();
          }}
        >
          <Text style={styles.modalButtonTextYes}>Igen</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbe9d0',
    alignItems: 'center',
    paddingTop: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
    backgroundColor: '#fbe9d0',
    paddingVertical: 4,
    //borderWidth: 1.5,
    borderColor: '#000000',
    marginBottom: 25,
  },
  iconButton: {
    padding: 10,
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
  grid: {
    marginTop: 18.1,
    width: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  menuButton: {
    width: '95%',
    height: 125,
    backgroundColor: '#ffd18b',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 30, 
    marginTop: 8,
  },
  menuTextBox: {
    marginLeft: 40,
    //borderWidth: 1,
    width: 150,
  },
  menuText: {
    fontSize: 22,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#000',
    //marginLeft: 40,
    textAlign: 'center',
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalBox: {
  backgroundColor: '#fbe9d0',
  borderRadius: 12,
  padding: 20,
  width: '80%',
  alignItems: 'center',
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 10,
  textAlign: 'center',
},
modalText: {
  fontSize: 15,
  marginBottom: 20,
  textAlign: 'center',
},
modalButtons: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
},
modalButton: {
  flex: 1,
  paddingVertical: 10,
  marginHorizontal: 5,
  borderWidth: 1.5,
  borderRadius: 8,
  alignItems: 'center',
},
cancelButton: {
  backgroundColor: '#ffd18b',
},
confirmButton: {
  backgroundColor: '#fd6969e3',
},
modalButtonTextNo: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#000',
},
modalButtonTextYes: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#000',
},


});

export default MainScreen;

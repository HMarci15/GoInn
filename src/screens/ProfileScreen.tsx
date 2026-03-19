import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Modal } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleLeft } from '@fortawesome/free-regular-svg-icons/faCircleLeft';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons/faCircleUser';
import { faHouse } from '@fortawesome/free-solid-svg-icons/faHouse';
import { faKey } from '@fortawesome/free-solid-svg-icons/faKey';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons/faLocationDot';
import { faUserGear } from '@fortawesome/free-solid-svg-icons/faUserGear';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons/faBookOpen';
import { faBookBookmark } from '@fortawesome/free-solid-svg-icons/faBookBookmark';
import {faBed} from '@fortawesome/free-solid-svg-icons/faBed';
import {faTriangleExclamation} from '@fortawesome/free-solid-svg-icons/faTriangleExclamation';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const avatars = [
{ id: 'avatar1', source: require('../assets/avatars/avatar1.png') },
{ id: 'avatar2', source: require('../assets/avatars/avatar2.png') },
{ id: 'avatar3', source: require('../assets/avatars/avatar3.png') },
{ id: 'avatar4', source: require('../assets/avatars/avatar4.png') },
{ id: 'avatar5', source: require('../assets/avatars/avatar5.png') },
{ id: 'avatar6', source: require('../assets/avatars/avatar6.png') },
];

type Props = StackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {

    const [vezeteknev, setVezeteknev] = useState('');
    const [keresztnev, setKeresztnev] = useState('');
    const [email, setEmail] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
    const [avatarModalVisible, setAvatarModalVisible] = useState(false);

    useEffect(() => {
    const fetchData = async () => {
      const user = auth().currentUser;
      if (user) {
        setEmail(user.email || '');
        const doc = await firestore().collection('users').doc(user.uid).get();
        const data = doc.data();
        if (data) {
          setVezeteknev(data.vezeteknev || '');
          setKeresztnev(data.keresztnev || '');
          setSelectedAvatar(data.profilePicture || null);
        }
      }
    };
    fetchData();
  }, []);

  const handleAvatarSelect = async (avatarId: string) => {
    const uid = auth().currentUser?.uid;
    if (!uid) return;
    await firestore().collection('users').doc(uid).update({ profilePicture: avatarId });
    setSelectedAvatar(avatarId);
    setAvatarModalVisible(false);
  };

  return (
     <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faCircleLeft} size={40} color="black" />
        </TouchableOpacity>
        <View style={styles.header}><Text style={styles.headerText}>Fiókom</Text></View>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Main')}>
          <FontAwesomeIcon icon={faHouse} size={40} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileContentBox}>
        <TouchableOpacity onPress={() => setAvatarModalVisible(true)}>
          {selectedAvatar ? (
            <Image
              source={avatars.find(a => a.id === selectedAvatar)?.source}
              style={styles.avatarImage}
            />
          ) : (
          <FontAwesomeIcon icon={faCircleUser} size={80} color="#000000" style={{ marginBottom: 12 }} />
          )}
        </TouchableOpacity>
        <Text style={styles.name}>{vezeteknev} {keresztnev}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionButton}
         onPress={() => navigation.navigate('PasswordChange')}>
          <FontAwesomeIcon icon={faKey} size={20} color="black" style={styles.optionIcon} />
          <Text style={styles.optionText}>Jelszó módosítása</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton}
        onPress={() => navigation.navigate('EarlierFav')}>
          <FontAwesomeIcon icon={faLocationDot} size={20} color="black" style={styles.optionIcon} />
          <Text style={styles.optionText}>Útvonalaim</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton}
        onPress={() => navigation.navigate('MyBookings')}>
          <FontAwesomeIcon icon={faBed} size={20} color="black" style={styles.optionIcon} />
          <Text style={styles.optionText}>Szobafoglalásaim</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton}
        onPress={() => navigation.navigate('MyTableBookings')}>
          <FontAwesomeIcon icon={faBookBookmark} size={20} color="black" style={styles.optionIcon} />
          <Text style={styles.optionText}>Asztalfoglalásaim</Text>
        </TouchableOpacity>

        <TouchableOpacity 
        style={styles.optionButton}
        onPress={() => navigation.navigate('MyIssues')}>
          <FontAwesomeIcon icon={faTriangleExclamation} size={20} color="black" style={styles.optionIcon} />
          <Text style={styles.optionText}>Bejelentett hibák</Text>
        </TouchableOpacity>

        <TouchableOpacity 
        style={styles.optionButton}
        onPress={() => navigation.navigate('Settings')}>
          <FontAwesomeIcon icon={faUserGear} size={20} color="black" style={styles.optionIcon} />
          <Text style={styles.optionText}>Beállítások</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={avatarModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Válassz avatárt</Text>
            <View style={styles.avatarGrid}>
              {avatars.map(avatar => (
                <TouchableOpacity key={avatar.id} onPress={() => handleAvatarSelect(avatar.id)}>
                  <Image
                    source={avatar.source}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      margin: 8,
                      borderWidth: avatar.id === selectedAvatar ? 2.6 : 1,
                      borderColor: avatar.id === selectedAvatar ? '#000' : '#ccc',
                    }}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={() => setAvatarModalVisible(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Bezárás</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
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
  profileContentBox: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#fff2d5',
    borderRadius: 15,
    borderWidth: 2.5,
    paddingVertical: 20,
    paddingHorizontal: 26,
  },
  avatarImage: {
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    borderWidth: 2.5, 
    marginBottom: 12
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#000',
  },
  optionsContainer: {
    width: '90%',
  },
  optionButton: {
    backgroundColor: '#ffd18b',
    padding: 14,
    borderRadius: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#000',
  },
  optionIcon: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fbe9d0',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  modalClose: {
    marginTop: 15,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderRadius: 10,
    backgroundColor: '#ffd18b',
  },
  modalCloseText: {
    color: '#000', 
    fontWeight: 'bold'
  },
});

export default ProfileScreen;

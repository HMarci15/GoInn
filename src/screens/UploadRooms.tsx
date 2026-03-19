import React from 'react';
import { Button, View, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import roomsData from '../store/room2.json'; 
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../types/navigation';

type Props = StackScreenProps<RootStackParamList, 'UploadRooms'>;

const UploadRooms: React.FC<Props> = ({navigation}) => {
  const handleUpload = async () => {
    try {
      const entries = Object.entries(roomsData);
      for (const [id, room] of entries) {
        await firestore().collection('rooms').doc(id).set({
          ...room,
          floor: Number(room.floor),
          maxGuests: Number(room.maxGuests),
          basePrice: Number(room.basePrice),
        });
      }
      Alert.alert('Sikeres feltöltés', 'Az összes szoba fel lett töltve Firestore-ba!');
    } catch (error) {
      console.error('Hiba történt:', error);
      Alert.alert('Hiba', 'Nem sikerült feltölteni.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Szobák feltöltése Firestore-ba" onPress={handleUpload} />
      <Button title="Vissza" onPress={() => navigation.navigate('Main')}/>
    </View>

    
  );
};

export default UploadRooms;


/* import React from 'react';
import { Button, View, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import menuData from '../store/kajapiak1.json'; 
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type Props = StackScreenProps<RootStackParamList, 'UploadRooms'>;

const UploadRooms: React.FC<Props> = ({ navigation }) => {
  const handleUpload = async () => {
    try {
      const entries = Object.entries(menuData);
      for (const [id, item] of entries) {
        await firestore().collection('menuitems').doc(id).set({
          ...item,
          price: Number(item.price),
          orderInCategory: Number(item.orderInCategory),
        });
      }
      Alert.alert('Feltöltve', 'Az étel- és itallap elemei sikeresen mentve!');
    } catch (error) {
      console.error('Hiba történt:', error);
      Alert.alert('Hiba', 'Nem sikerült feltölteni az adatokat.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Ételek/Italok feltöltése" onPress={handleUpload} />
      <Button title="Vissza" onPress={() => navigation.navigate('Main')} />
    </View>
  );
};

export default UploadRooms; */

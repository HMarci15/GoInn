import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform, FlatList, Image, ScrollView} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../types/navigation';
import { useRoute, RouteProp } from '@react-navigation/native';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import { faCircleLeft } from '@fortawesome/free-regular-svg-icons/faCircleLeft';
import {faCircleUser} from '@fortawesome/free-regular-svg-icons/faCircleUser';
import {faTriangleExclamation} from '@fortawesome/free-solid-svg-icons/faTriangleExclamation';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../context/AuthContext'; 
import Toast from 'react-native-toast-message';
import { graphData } from '../store/graphData';

type Props = StackScreenProps<RootStackParamList, 'Issue'>;

const IssueScreen: React.FC<Props> = ({navigation, route}) => {
  const { user } = useAuth();
  const [room, setRoom] = useState('');
  const [description, setDescription] = useState('');
  /* const [suggestions, setSuggestions] = useState<string[]>([]); */
  const [suggestions, setSuggestions] = useState<{ name: string; floor: number }[]>([]);

  const [photoUri, setPhotoUri] = useState<string | null>(null);

  /* useEffect(() => {
    if (route.params?.photoPath) {
      const path = route.params.photoPath;
      const uri = path.startsWith('file://') ? path : `file://${path}`;
      setPhotoUri(uri);

      navigation.setParams({ photoPath: undefined });
    }
  }, [route.params?.photoPath, navigation]); */

  /* useEffect(() => {
  if (route.params?.photoPath) {
    const path = route.params.photoPath;
    const uri = path.startsWith('file://') ? path : `file://${path}`;
    setPhotoUri(uri);
  }
}, [route.params?.photoPath]); */

/* useEffect(() => {
  if (!route.params?.photoPath) return;

  const path = route.params.photoPath;
  const uri = path.startsWith('file://') ? path : `file://${path}`;
  setPhotoUri(uri);

  navigation.setParams({ photoPath: undefined });
}, [route.params?.photoPath]);  */

useEffect(() => {
  if (route.params?.photoPath) {
    const path = route.params.photoPath;
    const uri = path.startsWith('file://') ? path : `file://${path}`;
    setPhotoUri(uri);

    if (route.params?.tempRoom) setRoom(route.params.tempRoom);
    if (route.params?.tempDescription) setDescription(route.params.tempDescription);

    navigation.setParams({ 
      photoPath: undefined,
      tempRoom: undefined,
      tempDescription: undefined
    });
  }
}, [route.params?.photoPath]);





 /*  const basePlaces = graphData.vertices
  .map(v => v.objectName)
  .filter((name): name is string => !!name); */
  const basePlaces = graphData.vertices
  .filter(v => !!v.objectName)
  .map(v => ({
    name: v.objectName!,
    floor: (v.floor ?? 0) + 1,
  }));


  /* const extraPlaces = [
    "1. emeleti folyosó",
    "2. emeleti folyosó",
    "3. emeleti folyosó",
  ]; */

  const extraPlaces = [
  { name: '1. emeleti folyosó', floor: 1 },
  { name: '2. emeleti folyosó', floor: 2 },
  { name: '3. emeleti folyosó', floor: 3 },
];


  /* const placeOptions = [...new Set([...basePlaces, ...extraPlaces])];  */

  /* const merged = [...basePlaces, ...extraPlaces];

const placeOptions = merged.filter((item, index, self) =>
  index === self.findIndex(
    other => other.name === item.name && other.floor === item.floor
  )
); */


  const placeOptions = [...basePlaces, ...extraPlaces];



  /* const handleRoomChange = (text: string) => {
    setRoom(text);
    if (text.length > 0) {
      const matches = placeOptions.filter(place =>
        place.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(matches.slice(0, 4)); 
    } else {
      setSuggestions([]);
    }
  }; */
const handleRoomChange = (text: string) => {
  setRoom(text);
  if (text.length > 0) {
    const matches = placeOptions.filter(place =>
      place.name.toLowerCase().includes(text.toLowerCase())
    );
    setSuggestions(matches.slice(0, 4));
  } else {
    setSuggestions([]);
  }
};



  const handleSubmit = async () => {
    if (!room.trim()) {
    Toast.show({
      type: 'error',
      text1: 'Kérlek, add meg a szobát vagy helyiséget.',
      position: 'bottom',
      visibilityTime: 3000,
      autoHide: true,
      bottomOffset: 40,
    });
    return;
  }

    if (!description.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Kérlek, add meg a problémát.',
        position: 'bottom',
        visibilityTime: 3000,
        autoHide: true,
        bottomOffset: 40,
      });
      return;
    }

    if (description.trim().length < 10) {
    Toast.show({
      type: 'error',
      text1: 'A leírásnak min. 10 karakter hosszúnak kell lennie.',
      position: 'bottom',
      visibilityTime: 3000,
      autoHide: true,
      bottomOffset: 40,
    });
    return;
  }

    try {
    const userId = user?.uid;

    let fullName = 'ismeretlen';
    if (userId) {
      const userDoc = await firestore().collection('users').doc(userId).get();
        if (userDoc.exists()) {
        const userData = userDoc.data();
        const firstName = userData?.keresztnev ?? '';
        const lastName = userData?.vezeteknev ?? '';
        fullName = `${lastName} ${firstName}`.trim();
        }
    }

    await firestore().collection('reports').add({
      userId: userId ?? 'ismeretlen',
      userName: fullName,
      room: room.trim(),
      description: description.trim(),
      photoUri: photoUri ?? null,
      timestamp: firestore.FieldValue.serverTimestamp(),
    });

      Toast.show({
        type: 'success',
        text1: 'Sikeresen elküldve!',
        position: 'bottom',
        visibilityTime: 3000,
        autoHide: true,
        bottomOffset: 40,
      });

      setRoom('');
      setDescription('');
      setPhotoUri(null);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Hiba történt a küldés során.',
        position: 'bottom',
        visibilityTime: 3000,
        autoHide: true,
        bottomOffset: 40,
      });
      console.error('Report hiba:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Main')}>
          <FontAwesomeIcon icon={faCircleLeft} size={40} color="black" />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.headerText}>Probléma bejelentése</Text>
        </View>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Profile')}>
          <FontAwesomeIcon icon={faCircleUser} size={40} color="black" />
        </TouchableOpacity>
      </View>

    <ScrollView 
    style={{ width: '100%', paddingTop: 5}}
    contentContainerStyle={{ alignItems: 'center', paddingBottom: 30 }}
    showsVerticalScrollIndicator={false}
    >
    <View style={styles.inputBox}>
      <Text style={styles.inputTitle}>Bejelentő űrlap</Text>
      <TextInput
        style={styles.input}
        placeholder="Szoba vagy helyiség"
        value={room}
        onChangeText={handleRoomChange}
        placeholderTextColor="#555"
      />
      {/* {suggestions.length > 0 && (
        <View style={styles.searchResults}>
          {suggestions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.resultItem}
              onPress={() => {
                setRoom(item);
                setSuggestions([]);
              }}
            >
              <Text style={styles.textResults}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )} */}
      {suggestions.length > 0 && (
  <View style={styles.searchResults}>
    {suggestions.map((item, index) => (
      <TouchableOpacity
        key={index}
        style={styles.resultItem}
        onPress={() => {
          setRoom(`${item.name} (${item.floor}. emelet)`);
          setSuggestions([]);
        }}
      >
        <Text style={styles.textResults}>
          {item.name} ({item.floor}. emelet)
        </Text>
      </TouchableOpacity>
    ))}
  </View>
)}


      <TextInput
        style={[styles.inputProblem, styles.textArea]}
        placeholder="Probléma megnevezése"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={6}
        placeholderTextColor="#555"
      />

      {/* Fotó készítése gomb */}
        <TouchableOpacity
          style={styles.photoButton}
          onPress={() => navigation.navigate('PhotoCapture', {
            tempRoom: room,
            tempDescription: description,
          })}>


          <Text style={styles.photoText}>
            {photoUri ? 'Új fotó készítése' : 'Fotó készítése'}
          </Text>
        </TouchableOpacity>

        {/* Előnézet */}
        {photoUri && (
          <View style={styles.photoBox}>
            <Image
              source={{ uri: photoUri }}
              style={styles.photo}
            />
            <TouchableOpacity
              onPress={() => setPhotoUri(null)}
              style={styles.deletePhoto}
            >
              <Text style={styles.deletePhotoText}>Fotó eltávolítása</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.submitBox}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Küldés</Text>
          </TouchableOpacity>
        </View>
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
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
  inputBox: {
    width: '90%',
    backgroundColor: '#fff2d5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingTop: 30,
    marginTop: 10,
    marginBottom: 15,
    borderWidth: 1.5,
    borderColor: '#000',
    alignItems: "center",
  },
  inputTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  input: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    //marginBottom: 20,
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    borderWidth: 1.5,
    borderColor: '#000',
    color: '#000',
  },
  textArea: {
    height: 130,
    textAlignVertical: 'top',
  },  
  searchResults: {
    maxHeight: 200,
    width: '90%',
    backgroundColor: '#fff2d5',
    borderRadius: 10,
    borderColor: '#000',
    //borderWidth: 1,
    marginTop: 8,
    zIndex: 10,
    paddingVertical: 1,
  },
  resultItem: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginVertical: 3,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  textResults: {
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
    color: '#000',
  },
  inputProblem: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    //marginBottom: 20,
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    borderWidth: 1.5,
    borderColor: '#000',
    color: '#000',
  },
  photoButton: {
    backgroundColor: '#ffd18b',
    paddingVertical: 10, 
    paddingHorizontal: 15,
    borderRadius: 12, 
    borderWidth: 1.5, 
    borderColor: '#000', 
    marginTop: 30,
  },
  photoText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#000' 
  },
  photoBox: {
    alignItems: 'center', 
    marginTop: 10
  },
  photo: {
    width: 220, 
    height: 220, 
    borderRadius: 12, 
    borderWidth: 1.5, 
    borderColor: '#000', 
    marginTop: 10,
  },
  deletePhoto: {
    marginTop: 18, 
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    borderWidth: 1.5, 
    borderColor: '#000', 
    borderRadius: 10, 
    backgroundColor: '#ffd18b'
  },
  deletePhotoText: {
    fontWeight: 'bold', 
    color: '#000'
  },
  submitBox: {
    backgroundColor: '#fff2d5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderBottomWidth: 0.2,
    borderColor: '#000',
    marginTop: 30,
    width: '108%',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#ffd18b',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#000',
    maxWidth: '40%',
    
  },
  submitText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default IssueScreen;

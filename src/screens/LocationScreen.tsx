import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, ActivityIndicator} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../types/navigation';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCircleLeft} from '@fortawesome/free-regular-svg-icons/faCircleLeft';
import {faCircleUser} from '@fortawesome/free-regular-svg-icons/faCircleUser';
import {faQrcode} from '@fortawesome/free-solid-svg-icons/faQrcode';
import { faCalendarXmark } from '@fortawesome/free-regular-svg-icons/faCalendarXmark';
import Floor1Map from '../assets/svg/hotelelso3.svg'; 
import { Dimensions } from 'react-native';




type Props = StackScreenProps<RootStackParamList, 'Location'>;

type RoomDoc = {
  id: string;
  name?: string;
  floor?: number;
  nodeId?: string;
};

const LocationScreen: React.FC<Props> = ({navigation}) => {
  const [inputId, setInputId] = useState('');
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const user = auth().currentUser;

  const toDate = (v: any): Date | null => {
    if (!v) return null;
    if (typeof v?.toDate === 'function') return v.toDate();
    try { return new Date(v); } catch { return null; }
  };

  const overlapsToday = (start: Date, end: Date) => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfToday   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return start <= endOfToday && end >= startOfToday;
  };

  useEffect(() => {
    let mounted = true;
    const fetchActiveRooms = async () => {
      if (!user) { setRooms([]); setLoading(false); return; }
      setLoading(true);

      try {
        //osszes foglalas
        const snap = await firestore()
          .collection('bookings')
          .where('userId', '==', user.uid)
          .get();

        //aktív foglalasok
        const activeRoomIdsSet = new Set<string>();
        snap.docs.forEach(doc => {
          const d = doc.data();
          const start = toDate(d.startDate);
          const end   = toDate(d.endDate);
          if (start && end && overlapsToday(start, end)) {
            if (typeof d.roomId === 'string' && d.roomId) {
              activeRoomIdsSet.add(d.roomId);
            }
          }
        });

        const activeRoomIds = Array.from(activeRoomIdsSet);
        if (activeRoomIds.length === 0) {
          if (mounted) setRooms([]);
          return;
        }

        const roomDocs = await Promise.all(
          activeRoomIds.map(async (rid) => {
            const rs = await firestore().collection('rooms').doc(rid).get();
            return { id: rs.id, ...(rs.data() || {}) } as RoomDoc;
          })
        );

        // csak node-os szobak
        const usable = roomDocs.filter(r => typeof r.nodeId === 'string' && r.nodeId!.length > 0);

        if (mounted) setRooms(usable);
      } catch (e) {
        console.error('Aktív foglalások / szobák lekérdezés hiba:', e);
        if (mounted) setRooms([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchActiveRooms();
    return () => { mounted = false; };
  }, [user]);


  const handleStartFromRoom = (nodeId: string | undefined) => {
    if (!nodeId) return;
    navigation.navigate('Target', { startId: nodeId });
  };

  
  const handlenavigate = () => {
    if (inputId.trim().length>0){
      navigation.navigate('Target', {startId: inputId.trim()});
    }
  };

   const windowWidth = Dimensions.get('window').width;
    const renderHeight = 300;
    const svgOriginalWidth = 297;
    const svgOriginalHeight = 215;
  
    const widthScale = windowWidth / svgOriginalWidth;
    const heightScale = renderHeight / svgOriginalHeight;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Main')}>
          <FontAwesomeIcon
            icon={faCircleLeft}
            size={40}
            color="black"
          />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.headerText}>Kiindulási pont</Text>
        </View>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('Profile')}>
          <FontAwesomeIcon icon={faCircleUser} size={40} color="black" />
        </TouchableOpacity>
      </View>

      {/* <View style={styles.mapContainer}>
        <Floor1Map width= "100%" height={300}/>        
      </View> */}

      {/* <TextInput
        style={styles.input}
        placeholder="Induló node-ID"
        value={inputId}
        onChangeText={setInputId}
      /> 
 */}
       {/* <TouchableOpacity style={styles.startButton} onPress={handlenavigate}>
       
       <Text>Betölt</Text>
      </TouchableOpacity> */}
{/*  <FontAwesomeIcon icon={faQrcode} size={125} color="black" /> */}
      <Text style={styles.label1}>Kérem adja meg indulási helyét!</Text>

      <Text style={styles.label2}>Indulás QR-kóddal</Text>

      {/* QR-kód indulás */}
      <TouchableOpacity 
        style={styles.qrButton}
        onPress={() => navigation.navigate('QRScanner')}> 
        <FontAwesomeIcon icon={faQrcode} size={125} color="black" />
      </TouchableOpacity>

      {/* Szobámból indulás */}
      <View style={{ width: '90%', marginTop: 15 }}>
        <Text style={styles.label2}>Indulás a szobámból</Text>

        {loading && (
          <View style={{ paddingVertical: 12 }}>
            <ActivityIndicator size="large" color="#000" style={{ marginVertical: 20 }} />
          </View>
        )}

        {!loading && rooms.length === 0 && (
          <View style={styles.noBookingBox}>
            <Text style={{ textAlign: 'center', color: '#000', fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
              Jelenleg nincs aktív foglalása
            </Text>
            <FontAwesomeIcon icon={faCalendarXmark} size={40} color="black" />
          </View>
        )}

        {!loading && rooms.length > 0 && (
          <FlatList
            data={rooms}
            keyExtractor={(item) => item.id}
            style={{ maxHeight: 300 }} 
            contentContainerStyle={{ paddingBottom: 10 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.startButton,
                  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
                ]}
                onPress={() => handleStartFromRoom(item.nodeId)}
                disabled={!item.nodeId}
              >
                <Text style={styles.startText}>{item.name || item.id}</Text>
                <Text style={{ fontSize: 14, color: '#000' }}>
                  {typeof item.floor === 'number' ? `${item.floor + 1}. emelet` : ''}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      
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
  label1: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 24,
    //marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
    //borderWidth: 1,
  },
  label2: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 21,
    marginTop: 15,
    marginBottom: 8,
    textAlign: 'center',
    //borderWidth: 1,
  },
  mapContainer: {
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    position: 'relative',
  },  
  input: {
    width: '90%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 15,
    fontSize: 16,
    marginTop: 20,
  },
  qrButton: {
    backgroundColor: '#ffd18b',
    padding: 14,
    borderRadius: 25,
    borderWidth: 1.5,
    marginTop: 20,
    alignItems: 'center'
  },
  noBookingBox: {
    backgroundColor: '#ffd18b',
    padding: 14,
    borderRadius: 25,
    borderWidth: 1.5,
    marginTop: 20,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#ffd18b',
    padding: 14,
    borderRadius: 25,
    borderWidth: 1.5,
    marginTop: 15,
    alignItems: 'center',
  },
  startText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    //borderWidth: 1,
  },
});

export default LocationScreen;

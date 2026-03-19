import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ActivityIndicator} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../types/navigation';
import { useRoute, RouteProp } from '@react-navigation/native';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import { faCircleLeft } from '@fortawesome/free-regular-svg-icons/faCircleLeft';
import {faCircleUser} from '@fortawesome/free-regular-svg-icons/faCircleUser';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import {faUtensils} from '@fortawesome/free-solid-svg-icons/faUtensils';
import {faMartiniGlassCitrus} from '@fortawesome/free-solid-svg-icons/faMartiniGlassCitrus';
import {faClipboardList} from '@fortawesome/free-solid-svg-icons/faClipboardList';
import {faCalendarDays} from '@fortawesome/free-solid-svg-icons/faCalendarDays';
import {faBookBookmark} from '@fortawesome/free-solid-svg-icons/faBookBookmark';
import {faWebAwesome} from '@fortawesome/free-solid-svg-icons/faWebAwesome';
import {faCircleInfo} from '@fortawesome/free-solid-svg-icons/faCircleInfo';

import DatePicker from 'react-native-date-picker';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../context/AuthContext'; 
import auth from '@react-native-firebase/auth';

import Toast from 'react-native-toast-message';

const mealTimeOptions: Record<string, string[]> = {
  breakfast: ['07:00','07:30','08:00','08:30','09:00','09:30'],
  lunch: ['12:00','12:30','13:00','13:30','14:00','14:30'],
  dinner: ['18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30'],
}

type Props = StackScreenProps<RootStackParamList, 'TableBooking'>;

const TableBookingScreen: React.FC<Props> = ({navigation, route}) => {
  const { prefillData } = route.params || {};

  const [date, setDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(date);
  const [showDatePicker, setShowDatePicker] = useState(false);


  const [mealType, setMealType] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  //const [tableSize, setTableSize] = useState<number | null>(null);
  //const [specialRequest, setSpecialRequest] = useState('');
  const [tableSize, setTableSize] = useState<number | null>(prefillData?.tableSize ?? null);
  const [specialRequest, setSpecialRequest] = useState(prefillData?.specialRequest ?? '');
  
  const [isHotelGuest, setIsHotelGuest] = useState(false);
  const [availableMeals, setAvailableMeals] = useState<string[]>([]);

  const tableOptions = [2, 4, 6, 8];

  const user = auth().currentUser; 

  const [loading, setLoading] = useState(true);

  useEffect(() => {
  let isMounted = true;
  setLoading(true); // indulaskor

  const checkBooking = async () => {
    if (!user) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0); //a nap szamit 
  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    if (isMounted) {
      setIsHotelGuest(false);
      setAvailableMeals([]);
      setMealType(null);
      setSelectedTime(null);
    }
    return; 
  }

    try {
      const snapshot = await firestore()
        .collection('bookings')
        .where('userId', '==', user.uid)
        .get();

      if (!isMounted) return;

      let foundBooking = false;
      let newMeals: string[] = [];
      const dStr = date.toISOString().split('T')[0];
      const todayStr = new Date().toISOString().split('T')[0];
      const isToday = dStr === todayStr;

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);

        const startStr = start.toISOString().split('T')[0];
        const endStr = end.toISOString().split('T')[0];

        // ha a mai nap endDate csak reggeli
        if (dStr === endStr) {
          foundBooking = true;
          newMeals.push('breakfast');
        } 
        else if (start <= date && date <= end) {
          foundBooking = true;
        // ha a mai nap startDate ebed, vacsora
          if (dStr === startStr) {
            newMeals.push('lunch', 'dinner');
          } else {
            newMeals.push('breakfast', 'lunch', 'dinner');
          }
        }
      });

      //szures aktualis ido alapjan
      if (isToday) {
        const now = new Date();
        const nowHM = now.getHours() * 60 + now.getMinutes();
        const lastTimes: Record<string, string> = {
          breakfast: "09:30",
          lunch: "14:30",
          dinner: "21:30",
        };

        newMeals = newMeals.filter(meal => {
          const [h, m] = lastTimes[meal].split(":").map(Number);
          return nowHM <= h * 60 + m;
        });
      }

      if (isMounted) {
        setIsHotelGuest(foundBooking);

        if (foundBooking) {
          if (isToday && newMeals.length === 0) {
            setAvailableMeals([]);
            setMealType(null);
            /* Toast.show({
              type: 'info',
              text1: 'Ma már nem tudsz asztalt foglalni',
              position: 'bottom',
              visibilityTime: 4000,
              autoHide: true,
            }); */
          } else {
            setAvailableMeals([...new Set(newMeals)]);

            setMealType(null);
          }
        } else {
          //kulsos vendeg
          if (isToday) {
            const now = new Date();
            const nowHM = now.getHours() * 60 + now.getMinutes();
            const dinnerLimitHM = 21 * 60 + 30; // 21:30
            if (nowHM > dinnerLimitHM) {
              setAvailableMeals([]);
              setMealType(null);
            } else {
              setAvailableMeals(['dinner']);
              setMealType('dinner');
            }
          } else {
            setAvailableMeals(['dinner']);
            setMealType('dinner');
          }
        }

        setSelectedTime(null);
      }
    } catch (error) {
      console.error('Foglalás ellenőrzési hiba:', error);
    } finally {
      if (isMounted) {
        setLoading(false); 
      }
    }
  };

  checkBooking();

  return () => {
    isMounted = false;
  };
}, [date, user]);





  const handleBooking = async () => {
    if (!date || !selectedTime || !tableSize || !mealType) {
      Toast.show({
        type: 'error',
        text1: 'Kérlek tölts ki minden mezőt!',
        position: 'bottom',
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Be kell jelentkezned a foglaláshoz!',
        position: 'bottom',
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    try {
    const dStr = date.toISOString().split('T')[0];

    const tableSnapshot = await firestore()
      .collection('tablebookings')
      .where('userId', '==', user.uid)
      .where('date', '==', dStr)
      .get();

    const existingCount = tableSnapshot.size;

    let limit = 3; //kulsos limit
    if (isHotelGuest) {
      // belsos limit
      const roomSnapshot = await firestore()
        .collection('bookings')
        .where('userId', '==', user.uid)
        .get();

      const activeRooms = roomSnapshot.docs.filter(doc => {
        const data = doc.data();
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        return start <= date && date <= end;
      });

      limit = activeRooms.length; 
    }

    if (existingCount >= limit) {
      Toast.show({
        type: 'error',
        text1: 'Elérte a napi foglalási limitet',
        text2: isHotelGuest
          ? `Max. ${limit} foglalás engedélyezett, mert ${limit} szobafoglalása van.`
          : 'Külsős vendégként naponta max. 3 foglalás engedélyezett.',
        position: 'bottom',
        visibilityTime: 4000,
        autoHide: true,
      });
      return;
    }

    await firestore().collection('tablebookings').add({
      userId: user.uid,
      date: dStr,
      mealType,
      time: selectedTime,
      tableSize,
      specialRequest,
      status: 'active',
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    Toast.show({
      type: 'success',
      text1: 'Foglalás sikeresen rögzítve!',
      position: 'bottom',
      visibilityTime: 3000,
      autoHide: true,
    });

      // mezok reset
      //setDate(new Date());
      if (isHotelGuest) {
        setMealType(null);
      } else {
        // kulsos- vacsora barmikor
        setMealType('dinner');
      }
      setSelectedTime(null);
      setTableSize(null);
      setSpecialRequest('');
    } catch (error) {
      console.error('Hiba az asztalfoglalásnál:', error);
      Toast.show({
        type: 'error',
        text1: 'Hiba történt a mentés során.',
        position: 'bottom',
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  const dStr = date.toISOString().split('T')[0];
  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = dStr === todayStr;

  const filteredTimes = mealType
    ? mealTimeOptions[mealType].filter(time => {
        if (!isToday) return true;

        const now = new Date();
        const nowHM = now.getHours() * 60 + now.getMinutes();

        const [h, m] = time.split(':').map(Number);
        const timeHM = h * 60 + m;

        return timeHM >= nowHM;
      })
    : [];


  

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.goBack()}>
          <FontAwesomeIcon
            icon={faCircleLeft}
            size={40}
            color="black"
          />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.headerText}>Asztalfoglalás</Text>
        </View>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('Profile')}>
          <FontAwesomeIcon icon={faCircleUser} size={40} color="black" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 250  }}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
      <ScrollView 
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContentContainer} 
      showsVerticalScrollIndicator={false}
      >
        
        {/* Dátum */}
        <View style={styles.dateColumn}>
          <View style={styles.labelBox}>
            <Text style={styles.label}>Dátum</Text>
          </View>
          <View
            style={[
              styles.arriveContainer,
              showDatePicker && styles.arriveContainerOpen,
              !showDatePicker && styles.arriveContainerInactive,
            ]}
          >
            <TouchableOpacity
              style={styles.dateBox}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateBoxText}>{date.toLocaleDateString('hu-HU')}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <View style={styles.pickerContainer}>
                <View style={styles.datePickerContainer}>
                  <DatePicker
                    date={tempDate}
                    onDateChange={setTempDate}
                    mode="date"
                    locale="hu"
                    minimumDate={new Date()}
                  />
                </View>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => {
                    setDate(tempDate);
                    setShowDatePicker(false);
                  }}
                >
                  <Text style={styles.buttonText}>Beállít</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Étkezés választó (ha hotel guest) */}
        {/* Étkezés választó (ha hotel guest) */}
        {isHotelGuest && availableMeals.length > 0 && (
          <>
          <View style={styles.labelBox}>
            <Text style={styles.label}>Étkezés</Text>
            </View>
            <View style={styles.optionRow}>
              {availableMeals.map(m => (
                <TouchableOpacity
                  key={m}
                  style={[styles.optionButtonType, mealType === m && styles.optionButtonTypeSelected]}
                  onPress={() => setMealType(m)}
                >
                  <Text style={styles.optionText}>
                    {m === 'breakfast' ? 'Reggeli' : m === 'lunch' ? 'Ebéd' : 'Vacsora'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {availableMeals.length === 0 && (
  <View style={{ padding: 20,/* backgroundColor: '#fff2d5', borderWidth: 1.5, borderColor: '#000',borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14, margin: 4,width: 85, */ }}>
    <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
      Ma már nem tudsz asztalt foglalni
    </Text>
  </View>
)}



        {/* Időpont választó */}
        {mealType && (
          <>
            <View style={styles.labelBox}>
              <Text style={styles.label}>Időpont</Text>
            </View>
            <View style={styles.optionRow}>
              {filteredTimes.map(time => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.optionButton,
                    selectedTime === time && styles.optionButtonSelected,
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={styles.optionText}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}


        {/* Asztalméret */}
        <View style={styles.labelBox}>
        <Text style={styles.label}>Hány fős asztal?</Text>
        </View>
        <View style={styles.optionRow}>
          {tableOptions.map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.optionButton,
                tableSize === size && styles.optionButtonSelected,
              ]}
              onPress={() => setTableSize(size)}
            >
              <Text style={styles.optionText}>{size} fő</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Megjegyzés */}
        <View style={styles.labelBox}>
        <Text style={styles.label}>Megjegyzés</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Pl. ablak mellé, gyerek etetőszék..."
          value={specialRequest}
          onChangeText={setSpecialRequest}
        />

      </ScrollView>
      )}

      {/* Foglalás gomb */}
      <View style={styles.bookingBlock}>
        <TouchableOpacity style={styles.bookingButton} onPress={handleBooking}>
          <Text style={styles.bookingButtonText}>Foglalás</Text>
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
  scrollContainer: {
    width: '100%',
    //borderWidth: 1,
    flexGrow: 1

  },
  scrollContentContainer: {
    paddingBottom: 120, 
    paddingHorizontal: 15,
    //alignItems: 'center',
  },
  dateColumn: {
    alignItems: 'center',
    maxWidth: 400,
    //borderWidth: 1,
  },
  labelBox: {
    width: '100%',
    alignItems: 'flex-start',
    //borderWidth: 1,
    marginBottom: 1,
    marginLeft: 5,
    //borderWidth: 1,
  },
  label: {
    fontSize: 21.2,
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 5,
    textAlign: 'left',
    //borderWidth: 1,
  },
  /* labelBoxIdopont: {
    width: '100%',
    alignItems: 'flex-start',
    //borderWidth: 1,
    marginBottom: 1,
    marginTop: 15,
    borderWidth: 1,
  },
  labelIdopont: {
    fontSize: 21.2,
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 5,
    textAlign: 'left',
    borderWidth: 1,
  }, */
  arriveContainer: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    marginTop: 10,
    backgroundColor: '#fff2d5',
    maxWidth: 250,
    marginBottom: 8,
  },
  arriveContainerOpen: {
    borderWidth: 1.5,
    paddingTop: 5,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  arriveContainerInactive: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  dateBox: {
    backgroundColor: '#ffd18b',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#000',
    width: 150,
    alignItems: 'center',
    marginBottom: 5,
  },
  dateBoxText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  pickerContainer: { 
    alignItems: 'center' 
  },
  datePickerContainer: { 
    alignItems: 'center', 
    maxWidth: 190 
  },
  confirmButton: {
    backgroundColor: '#ffd18b',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 10,
  },
  buttonText: { 
    color: '#000', 
    fontWeight: 'bold' 
  },
  optionRow: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginBottom: 15,
    //borderWidth: 1,
    //width: '100%',
    //minWidth: 350,
    paddingLeft: 30.5, 
    paddingRight: 5, 
  },
  optionButtonType: {
    backgroundColor: '#fff2d5', 
    borderWidth: 1.5, 
    borderColor: '#000',
    borderRadius: 8, 
    paddingVertical: 8, 
    paddingHorizontal: 14, 
    margin: 4,
    width: 85,
  },
  optionButtonTypeSelected: {
    backgroundColor: '#ffd18b'
  },
  optionButton: {
    backgroundColor: '#fff2d5', 
    borderWidth: 1.5, 
    borderColor: '#000',
    borderRadius: 8, 
    paddingVertical: 8, 
    paddingHorizontal: 14, 
    margin: 4,
    width: 67,
  },
  optionButtonSelected: {
    backgroundColor: '#ffd18b'
  },
  optionText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff2d5', 
    borderWidth: 1.5, 
    borderColor: '#000',
    borderRadius: 8, 
    padding: 10, 
    fontSize: 15,
    width: 292.5,
    marginTop: 5,
    marginLeft: 34.5,
  },
  bookingBlock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fbe9d0',
    padding: 10,
    borderWidth: 1.5,
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
    borderTopColor: '#000',
    borderBottomColor: '#fbe9d0',
    alignItems: 'center',
  },
  bookingButton: {
    backgroundColor: '#ffd18b',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderWidth: 1.5,
    marginVertical: 10,
  },
  bookingButtonText: {
    fontWeight: 'bold', 
    fontSize: 17
  },
});

export default TableBookingScreen;

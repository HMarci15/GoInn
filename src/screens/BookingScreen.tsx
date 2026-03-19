import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert, FlatList, Image} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Toast from 'react-native-toast-message';


import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../types/navigation';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCircleLeft} from '@fortawesome/free-regular-svg-icons/faCircleLeft';
import {faCircleUser} from '@fortawesome/free-regular-svg-icons/faCircleUser';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons/faCaretLeft';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight';
import { faWifi } from '@fortawesome/free-solid-svg-icons/faWifi';
import { faSnowflake } from '@fortawesome/free-solid-svg-icons/faSnowflake';
import { faVault } from '@fortawesome/free-solid-svg-icons/faVault';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
//import { collection, addDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
//import { FIRESTORE_DB } from '../firebase';

//import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
//import { app } from '../firebase'; 
//import { firestore } from '../firebase';






type Props = StackScreenProps<RootStackParamList, 'Booking'>;

const BookingScreen: React.FC<Props> = ({navigation, route}) => {
  const { prefillData } = route.params || {};
  /* const [arrivalDate, setArrivalDate] = useState(new Date());
  const [departureDate, setDepartureDate] = useState(new Date()); */

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [arrivalDate, setArrivalDate] = useState(today);
  const [departureDate, setDepartureDate] = useState(
    new Date(today.getTime() + 24 * 60 * 60 * 1000) // érkezés + 1 nap
  );


  const [showArrivalPicker, setShowArrivalPicker] = useState(false);
  const [tempArrivalDate, setTempArrivalDate] = useState(arrivalDate);

  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [tempDepartureDate, setTempDepartureDate] = useState(departureDate);

  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const floorOptions = [
    '1. emelet - Standard',
    '2. emelet - Családi',
    '3. emelet - Üzleti',
  ];
  const getFloorNumberFromSelection = (selection: string | null): number | null => {
    switch (selection) {
      case '1. emelet - Standard':
        return 0;
      case '2. emelet - Családi':
        return 1;
      case '3. emelet - Üzleti':
        return 2;
      default:
        return null;
    }
  };

  const [showFloorDropdown, setShowFloorDropdown] = useState(false);

  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(
  prefillData?.roomId || null
);
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [isRoomAvailable, setIsRoomAvailable] = useState(true);


  
  //emeletek betoltese
  useEffect(() => {
  if (prefillData?.roomDetails?.floor !== undefined) {
    const floorNumber = prefillData.roomDetails.floor;
    const selection = floorOptions[floorNumber]; //pl. 0 → "1. emelet - Standard" 
    setSelectedFloor(selection);
  }
}, [prefillData?.roomDetails?.floor]);

//szoba adatok betoltese
  useEffect(() => {
  if (prefillData?.roomDetails) {
    setSelectedRoom(prefillData.roomDetails);
    setSelectedRoomId(prefillData.roomId ?? null);
  } else if (prefillData?.roomId) {
    firestore()
      .collection('rooms')
      .doc(prefillData.roomId)
      .get()
      .then(doc => {
        if (doc.exists()) {
          setSelectedRoomId(doc.id);
          setSelectedRoom(doc.data());
        }
      });
  }
}, [prefillData]);



  useEffect(() => {
    if (!selectedFloor || !arrivalDate || !departureDate) return;

    const floorNumber = getFloorNumberFromSelection(selectedFloor);
    if (floorNumber === null) return;

    const unsubscribe = firestore()
      .collection('rooms')
      .where('floor', '==', floorNumber)
      .onSnapshot(async (snapshot) => {
        const allRooms = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const bookingsSnapshot = await firestore().collection('bookings').get();
        const bookings = bookingsSnapshot.docs.map(doc => doc.data());

        const filteredRooms = allRooms.filter(room => {
          const isBooked = bookings.some(booking => {
            if (booking.roomId !== room.id) return false;

            const bookingStart = booking.startDate.toDate?.() ?? new Date(booking.startDate);
            const bookingEnd = booking.endDate.toDate?.() ?? new Date(booking.endDate);

            return (
              arrivalDate < bookingEnd &&
              departureDate > bookingStart
            );
          });

          return !isBooked;
        });

        setAvailableRooms(filteredRooms);
      });

    return () => unsubscribe();
  }, [selectedFloor, arrivalDate, departureDate]);

//kivalasztott szoba foglalhato-e a megadott datumokra
  useEffect(() => {
    if (!selectedRoomId || !arrivalDate || !departureDate) return;

    const checkAvailability = async () => {
      const snapshot = await firestore()
        .collection('bookings')
        .where('roomId', '==', selectedRoomId)
        .get();

      const conflict = snapshot.docs.some(doc => {
        const data = doc.data();
        const bookingStart = data.startDate.toDate?.() ?? new Date(data.startDate);
        const bookingEnd = data.endDate.toDate?.() ?? new Date(data.endDate);

        return arrivalDate < bookingEnd && departureDate > bookingStart;
      });

      if (conflict) {
      setIsRoomAvailable(false);
      Toast.show({
        type: 'error',
        text1: 'Ez a szoba nem elérhető a kiválasztott időpontban!',
        position: 'bottom',
        visibilityTime: 3000,
        autoHide: true,
        bottomOffset: 40,
      });
    } else {
      setIsRoomAvailable(true);
    }
  };

    checkAvailability();
  }, [selectedRoomId, arrivalDate, departureDate]);

  const handleBooking = async () => {
    if (!selectedFloor) {
      Toast.show({
        type: 'error',
        text1: 'Kérlek, válassz emeletet!',
        position: 'bottom',
        visibilityTime: 3000,
        autoHide: true,
        bottomOffset: 40,
      });
      return;
    }

    if (!selectedRoomId) {
      Toast.show({
        type: 'error',
        text1: 'Kérlek, válassz szobát!',
        position: 'bottom',
        visibilityTime: 3000,
        autoHide: true,
        bottomOffset: 40,
      });
      return;
    }

    if (departureDate <= arrivalDate) {
      Toast.show({
        type: 'error',
        text1: 'Érvénytelen dátum',
        text2: 'A távozás nem lehet korábbi vagy azonos az érkezéssel.',
        position: 'bottom',
        visibilityTime: 3000,
        autoHide: true,
        bottomOffset: 40,
      });
      return;
    }

    if (!isRoomAvailable) {
  Toast.show({
    type: 'error',
    text1: 'Ez a szoba nem elérhető a kiválasztott időpontban!',
    position: 'bottom',
    visibilityTime: 3000,
    autoHide: true,
    bottomOffset: 40,
  });
  return;
}


    const user = auth().currentUser;

    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Be kell jelentkezned a foglaláshoz!',
        position: 'bottom',
        visibilityTime: 3000,
        autoHide: true,
        bottomOffset: 40,
      });
      return;
    }

    try {
          await firestore().collection('bookings').add({
            roomId: selectedRoomId,
            startDate: arrivalDate.toISOString(),
            endDate: departureDate.toISOString(),
            userId: user.uid,
            timestamp: firestore.FieldValue.serverTimestamp(),
          });

          Toast.show({
            type: 'success',
            text1: 'Foglalás sikeresen rögzítve!',
            position: 'bottom',
            visibilityTime: 3000,
            autoHide: true,
            bottomOffset: 40,
          });
          

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const nextDay = new Date(today.getTime() + 24 * 60 * 60 * 1000);

          setArrivalDate(today);
          setDepartureDate(nextDay);
          setTempArrivalDate(today);
          setTempDepartureDate(nextDay);

          setSelectedFloor(null);
          setShowFloorDropdown(false);//??
          setAvailableRooms([]);
          setSelectedRoomId(null);
          setSelectedRoom(null);
          setShowArrivalPicker(false);
          setShowDeparturePicker(false);
        } catch (error) {
        console.error('Foglalási hiba:', error);
        Toast.show({
          type: 'error',
          text1: 'Hiba történt a foglalás során.',
          position: 'bottom',
          visibilityTime: 3000,
          autoHide: true,
          bottomOffset: 40,
        });
      }
  };

  const getEstimatedPrice = () => {
    if (!selectedRoom) return '0 Ft';

    const nights = Math.max(
      Math.ceil((departureDate.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24)),
      1
    );

    const total = selectedRoom.basePrice * nights;

    return total.toLocaleString('hu-HU') + ' Ft';
  };

  const getImageSource = (imageKey: string) => {
    switch (imageKey) {
      case 'roomType1':
        return require('../assets/roomImages/roomType1.png');
      case 'roomType2':
        return require('../assets/roomImages/roomType2.png');
      case 'roomType3':
        return require('../assets/roomImages/roomType3.png');
      case 'roomType4':
        return require('../assets/roomImages/roomType4.png');
      default:
        return undefined; 
    }
  };

  const currentImageKey = selectedRoom?.imageUrl?.[currentImageIndex] || '';
  const currentImageSource = getImageSource(currentImageKey);

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
          <Text style={styles.headerText}>Szobafoglalás</Text>
        </View>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('Profile')}>
          <FontAwesomeIcon icon={faCircleUser} size={40} color="black" />
        </TouchableOpacity>
      </View>

      {/* Tartalom */}

      <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}>

        {/* Érkezés-Távozás */}
        <View
          style={[
            styles.datePickersRow,
            (showArrivalPicker || showDeparturePicker) && styles.datePickersRowSingle,
          ]}
        >
          {/* Érkezés */}
          {(!showDeparturePicker || showArrivalPicker) && (
            <View style={styles.dateColumn}>
              <View style={styles.labelBox}>
              <Text style={styles.label}>Érkezés</Text>
              </View>
              <View
                style={[
                  styles.arriveDepartContainer,
                  showArrivalPicker && styles.arriveDepartContainerOpen,
                  !showArrivalPicker && styles.arriveDepartContainerInactive,
                ]}
              >
                <TouchableOpacity
                  style={styles.dateBox}
                  onPress={() => {
                    setShowArrivalPicker(true);
                    setShowDeparturePicker(false);
                  }}
                >
                  <Text style={styles.dateBoxText}>{arrivalDate.toLocaleDateString('hu-HU')}</Text>
                </TouchableOpacity>

                {showArrivalPicker && (
                  <View style={styles.pickerContainer}>
                    <View style={styles.datePickerContainer}>
                      <DatePicker
                        date={tempArrivalDate}
                        onDateChange={setTempArrivalDate}
                        mode="date"
                        locale="hu"
                        minimumDate={new Date()}
                      />
                    </View>
                    <TouchableOpacity
                      /* style={styles.confirmButton}
                      onPress={() => {
                        setArrivalDate(tempArrivalDate);
                        setShowArrivalPicker(false);
                      }} */
                     style={styles.confirmButton}
                      onPress={() => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0); // az ido nem szamit, csak a datum

                        let chosenDate = tempArrivalDate;
                        if (chosenDate < today) {
                          chosenDate = today;
                          Toast.show({
                            type: 'info',
                            text1: 'Érvénytelen dátum',
                            text2: 'Az érkezés nem lehet korábbi a mai napnál.',
                            position: 'bottom',
                            visibilityTime: 3000,
                            autoHide: true,
                            bottomOffset: 40,
                          });
                        }

                        setArrivalDate(chosenDate);
                        setTempArrivalDate(chosenDate);

                         //ha a tavozas nem jo, +1 nap
                        if (departureDate <= chosenDate) {
                          const nextDay = new Date(chosenDate.getTime() + 24 * 60 * 60 * 1000);
                          setDepartureDate(nextDay);
                          setTempDepartureDate(nextDay);
                        }

                        setShowArrivalPicker(false);
                      }}
                    >
                      <Text style={styles.buttonText}>Beállít</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          )}
          {/* Érkezés-vége */}

          {/* Távozás */}
          {(!showArrivalPicker || showDeparturePicker) && (
            <View style={styles.dateColumn}>
              <View style={styles.labelBox}>
              <Text style={styles.label}>Távozás</Text>
              </View>
              <View
                style={[
                  styles.arriveDepartContainer,
                  showDeparturePicker && styles.arriveDepartContainerOpen,
                  !showDeparturePicker && styles.arriveDepartContainerInactive,
                ]}
              >
                <TouchableOpacity
                  style={styles.dateBox}
                  onPress={() => {
                    setShowDeparturePicker(true);
                    setShowArrivalPicker(false);
                  }}
                >
                  <Text style={styles.dateBoxText}>{departureDate.toLocaleDateString('hu-HU')}</Text>
                </TouchableOpacity>

                {showDeparturePicker && (
                  <View style={styles.pickerContainer}>
                    <View style={styles.datePickerContainer}>
                      <DatePicker
                        date={tempDepartureDate}
                        onDateChange={setTempDepartureDate}
                        mode="date"
                        locale="hu"
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.confirmButton}
                      onPress={() => {
                        const isInvalid = tempDepartureDate <= arrivalDate;
                        const correctedDate = isInvalid
                          ? new Date(arrivalDate.getTime() + 24 * 60 * 60 * 1000)
                          : tempDepartureDate;

                          if (isInvalid) {
                            Toast.show({
                              type: 'info',
                              text1: 'Érvénytelen dátum',
                              text2: 'A távozás nem lehet korábbi vagy azonos az érkezéssel.',
                              position: 'bottom',
                              visibilityTime: 3000,
                              autoHide: true,
                              bottomOffset: 40,
                            });
                          }

                          setDepartureDate(correctedDate);
                        setTempDepartureDate(correctedDate);
                        setShowDeparturePicker(false);
                      }}
                    >
                      <Text style={styles.buttonText}>Beállít</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          )}
          {/* Távozás-vége */}
        </View>
        {/* Érkezés-Távozás-vége */}

        {/* Szoba kiválasztása */}
        <View style={styles.floorSelectContainer}>
          <View style={styles.labelBoxSzoba}>
            <Text style={styles.labelSzoba}>Szoba kiválasztása</Text>
          </View>

          <TouchableOpacity
            onPress={() => setShowFloorDropdown(!showFloorDropdown)}
            style={styles.dropdownButton}
          >
            <Text
              style={[
                styles.dropdownButtonText,
                !selectedFloor && styles.dropdownPlaceholderText,
              ]}
            >
              {selectedFloor ?? 'Emelet...'}
            </Text>
            <FontAwesomeIcon
              icon={showFloorDropdown ? faCaretUp : faCaretDown}
              size={22}
              color="black"
            />
          </TouchableOpacity>

          {showFloorDropdown && (
            <View style={styles.dropdownList}>
              {floorOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.dropdownItem,
                    option === selectedFloor && styles.dropdownItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedFloor(option);
                    setShowFloorDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.roomButtonsContainer}
          >
            {availableRooms.map((room) => (
              <TouchableOpacity
                key={room.id}
                onPress={() => {
                  setSelectedRoomId(room.id);
                  setSelectedRoom(room);
                }}
                style={[
                  styles.roomsButton,
                  {
                    backgroundColor: selectedRoomId === room.id ? '#ffd18b' : '#fff2d5',
                    borderColor: selectedRoomId === room.id ? 'black' : 'black',
                  },
                ]}
              >
                <Text style={styles.roomsButtonText}>{room.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {/* Szoba kiválasztása-vége */}

        {/* Szoba adatlap */}
        {selectedRoom && (
          <View style={styles.roomDetailsContainer}>
            <Text style={styles.sectionTitle}>Szoba adatlap</Text>
            <View style={styles.roomDetailsContent}>
              {/* Bal oldal: adatok */}
              <View style={styles.roomDetailsText}>
                <Text style={styles.detailLabel}>
                  Férőhely:{' '}
                  <Text style={styles.detailValue}>{selectedRoom.maxGuests} fő</Text>
                </Text>
                <Text style={styles.detailLabel}>
                  Ágyak:{' '}
                  <Text style={styles.detailValue}>
                    {selectedRoom.bedType}
                    {selectedRoom.extraBeds ? `, ${selectedRoom.extraBeds}` : ''}
                  </Text>
                </Text>
                <Text style={styles.detailLabel}>
                  Típus:{' '}
                  <Text style={styles.detailValue}>{selectedRoom.type}</Text>
                </Text>
              </View>

              {/* Jobb oldal: ikonok */}
              <View style={styles.roomIcons}>
                <FontAwesomeIcon icon={faWifi} size={22} style={styles.icon} />
                <FontAwesomeIcon icon={faSnowflake} size={22} style={styles.icon} />
                <FontAwesomeIcon icon={faVault} size={22} style={styles.icon} />
              </View>
            </View>
            <View style={styles.roomDescriptionBlock}>
              <Text style={styles.descriptionTitle}>Leírás:</Text>
              <Text style={styles.descriptionText}>{selectedRoom.description}</Text>
            </View>

          </View>
        )}
        {/* Szoba adatlap-vége */}

        {/* Ár */}
        <View style={styles.priceBlock}>
          <Text style={styles.priceLabel}>Alap ár</Text>
          <View style={styles.priceBox}>
            <Text style={styles.priceText}>{getEstimatedPrice()}</Text>
          </View>
        </View>
        {/* Ár-vége */}

        {/* Kép */}
        {selectedRoom &&
          selectedRoom.imageUrl?.length > 0 &&
          currentImageSource && (

          <View style={styles.pictureBlock}> 
             <Text style={styles.pictureLabel}>Galéria</Text>
          <View style={styles.imageGalleryContainer}>
            <Image
              source={currentImageSource}
              style={styles.roomImage}
              resizeMode="cover"
            />
            {selectedRoom.imageUrl.length > 1 && (
              <View style={styles.imageNavButtons}>
                <TouchableOpacity
                  onPress={() => {
                    setCurrentImageIndex((prev) =>
                      prev === 0 ? selectedRoom.imageUrl.length - 1 : prev - 1
                    );
                  }}
                  style={styles.imageNavButton}
                >
                  <FontAwesomeIcon icon={faCaretLeft} size={35} style={styles.navIcon} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setCurrentImageIndex((prev) =>
                      prev === selectedRoom.imageUrl.length - 1 ? 0 : prev + 1
                    );
                  }}
                  style={styles.imageNavButton}
                >
                  <FontAwesomeIcon icon={faCaretRight} size={35} style={styles.navIcon} />
                </TouchableOpacity>
              </View>
            )}
          </View>
          </View>
        )}

        {/* Kép-vége */}


        

      </ScrollView>
       {/* Tartalom-vége */}     
      <View style={styles.bookingBlock}>
        {/* Foglalás */}
        <TouchableOpacity
          style={styles.bookingButton}
          onPress={handleBooking}
        >
          <Text style={styles.bookingButtonText}>Foglalás</Text>
        </TouchableOpacity>
        {/* Foglalás-vége */}
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
    paddingBottom: 100,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  datePickersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    flexWrap: 'nowrap',
  },
  datePickersRowSingle: {
    flexDirection: 'column',
    alignItems: 'center',
    //borderWidth: 1,
    maxWidth: 270,
  },
  dateColumn: {
    alignItems: 'center',
    //width: '48%', 
    maxWidth: 250,
    //borderWidth: 1,
  },
  labelBox: {
    width: '85%',
    alignItems: 'flex-start',
    marginBottom: 1,
  },
  label: {
    fontSize: 21.2,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'left',
  },
  arriveDepartContainer: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    marginTop: 10,
    //paddingTop: 5,
    //paddingHorizontal: 5,
    backgroundColor: '#fff2d5',
    //width: '100%',
    maxWidth: 250,
  },
  arriveDepartContainerOpen: {
    borderWidth: 1.5,
    paddingTop: 5,
    paddingHorizontal: 20,
  },
  arriveDepartContainerInactive: {
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
    fontSize: 17,
  },
  pickerContainer: {
    alignItems: 'center',
    //borderWidth: 1,
    //marginTop: 0,
  },
  datePickerContainer: {
    alignItems: 'center',
    //borderWidth: 1,
    //marginTop: 10,
    maxWidth: 190,
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
    fontWeight: 'bold',
  },
  floorSelectContainer: {
    width: '95%',
    marginTop: 25,
    alignItems: 'flex-start',
  },
  labelBoxSzoba: {
    marginLeft: 10,
  },
  labelSzoba: {
    fontSize: 21.5,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'left',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffd18b',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1.5,
    width: '100%',
    marginTop: 11,
  },
  dropdownButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  dropdownPlaceholderText: {
    color: '#000', 
    fontWeight: 'bold',
    fontSize: 17,
  },
  dropdownList: {
    backgroundColor: '#fff2d5',
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 1.5,
    width: '100%',
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: '105%',
    borderWidth: 0.2,
    //alignItems: 'stretch',
  },
  dropdownItemSelected: {
    backgroundColor: '#ffd18b',
  },
  dropdownText: {
    fontSize: 17,
  },
  roomsBox: {
    flexDirection: 'row',
    flexWrap: 'wrap', 
    marginTop: 20,
  },
  roomButtonsContainer: {
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderWidth: 1,
    borderColor: '#fbe9d0' ,
    gap: 10,
  },
  roomsButton: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginTop: 2,
    marginBottom: 5,
    borderWidth: 1.5,
  },
  roomsButtonText: {
    fontWeight: 'bold',
    //fontSize: 14.5,
  },
  roomDetailsContainer: {
    backgroundColor: '#fff2d5',
    borderRadius: 10,
    padding: 5,
    marginVertical: 0,
    width: "95%",
    borderWidth: 1.2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4.5,
    marginLeft: 2,
  },
  roomDetailsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roomDetailsText: {
    flex: 1,
    //borderWidth:1,
  },
  detailLabel: {
    fontWeight: 'bold',
    marginTop: 5.5,
    marginBottom: 5.5,
    fontSize: 15.2,
  },
  detailValue: {
    fontWeight: 'normal',
  },
  roomIcons: {
    justifyContent: 'space-around',
    alignItems: 'center',
    marginRight: 5,
    marginLeft: 20,
  },
  icon: {
    marginBottom: 10,
  },
  roomDescriptionBlock: {
    marginTop: 0,
    paddingHorizontal: 2,
    //borderWidth: 1,
  },
  descriptionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 3,
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 20,
    paddingHorizontal: 0,
    textAlign: 'center',
  },
  priceBlock: {
    marginTop: 15,
    width: '95%',
    alignItems: 'flex-start',
    //borderWidth: 1,
  },
  priceLabel: {
    fontWeight: 'bold',
    fontSize: 21.1,
    marginBottom: 17,
    marginLeft: 10,
  },
  priceBox: {
    backgroundColor: '#fff2d5',
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  priceText: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  pictureBlock: {
    marginTop: 15,
    width: '95%',
    alignItems: 'flex-start',
    //borderWidth: 1,
  },
  pictureLabel: {
    fontWeight: 'bold',
    fontSize: 23,
    //marginBottom: 11,
    marginLeft: 9,
  },
  imageGalleryContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    //borderWidth: 1,
    alignSelf: 'center'
  },
  roomImage: {
    width: 300,
    height: 200,
    borderRadius: 10,
    borderWidth: 2,
    marginBottom: 12,
    borderColor: '#000',
  },
  imageNavButtons: {
    flexDirection: 'row',
    marginTop: 12,
    //marginBottom: 10,
    gap: 20,
    //borderWidth: 1
  },
  imageNavButton: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: '#fff2d5',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'black',
  },
  navIcon: {
    
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

export default BookingScreen;

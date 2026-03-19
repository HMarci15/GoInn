import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView, Modal } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleLeft } from '@fortawesome/free-regular-svg-icons/faCircleLeft';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { faCalendarXmark } from '@fortawesome/free-regular-svg-icons/faCalendarXmark';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';

type Props = StackScreenProps<RootStackParamList, 'MyBookings'>;

const MyBookingsScreen: React.FC<Props> = ({ navigation }) => {
    const [bookings, setBookings] = useState<any[]>([]);
    //const currentUser = auth().currentUser;
    const [showActive, setShowActive] = useState(false);
    const [showReserved, setShowReserved] = useState(false);
    const [showExpired, setShowExpired] = useState(false);
    const [showCancelled, setShowCancelled] = useState(false);

    const [confirmVisible, setConfirmVisible] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{
      type: 'cancel' | 'deleteExpired' | 'deleteCancelled';
      booking: any | null;
    } | null>(null);



    


   useEffect(() => {
    const user = auth().currentUser;
    if (!user) return;

    const unsubscribe = firestore()
      .collection('bookings')
      .where('userId', '==', user.uid)
      .orderBy('startDate', 'desc') 
      .onSnapshot(async (qs) => {
        type BookingData = {
          id: string;
          roomId: string;
          startDate: Date | null;
          endDate: Date | null;
          status?: string;
          [key: string]: any;
        };

        const raw = qs.docs.map(doc => {
          const d = doc.data();

          const start = d.startDate?.toDate ? d.startDate.toDate() : new Date(d.startDate);
          const end = d.endDate?.toDate ? d.endDate.toDate() : new Date(d.endDate);

          return {
            id: doc.id,
            ...d,
            startDate: isNaN(start?.getTime() ?? NaN) ? null : start,
            endDate: isNaN(end?.getTime() ?? NaN) ? null : end,
          } as BookingData;
        });

        if (raw.length === 0) {
          setBookings([]);
          setShowActive(false);
          return;
        }

        const roomIds = Array.from(new Set(raw.map(b => b.roomId))).filter(Boolean);

        let merged: BookingData[] = raw;
      if (roomIds.length > 0) {
        const roomsSnap = await firestore()
          .collection('rooms')
          .where(firestore.FieldPath.documentId(), 'in', roomIds)
          .get();

        const roomsMap = new Map<string, any>();
        roomsSnap.forEach(doc => roomsMap.set(doc.id, doc.data()));

        merged = raw.map(b => ({
          ...b,
          roomDetails: roomsMap.get(b.roomId) || null,
        }));
      }

      setBookings(merged);

      //aktiv foglalas ell.(lenyitas)
      const hasActive = merged.some(
        (b) => getBookingStatus(b.startDate, b.endDate) === 'Aktív'
      );
      setShowActive(hasActive); 
    });

  return () => unsubscribe();
}, []);

  const [deletedBookings, setDeletedBookings] = useState<any[]>([]);

useEffect(() => {
  const user = auth().currentUser;
  if (!user) {
    setDeletedBookings([]); 
    return;
  }

  const unsub = firestore()
    .collection('deletedbookings')
    .where('userId', '==', user.uid)
    .orderBy('startDate', 'desc')
    .onSnapshot(
      (qs) => {
        if (!qs || !qs.docs) {
          console.warn("No snapshot data from deletedbookings");
          setDeletedBookings([]);
          return;
        }

        const raw = qs.docs.map(doc => {
          const d = doc.data();
          const start = d.startDate?.toDate ? d.startDate.toDate() : new Date(d.startDate);
          const end = d.endDate?.toDate ? d.endDate.toDate() : new Date(d.endDate);
          return {
            id: doc.id,
            ...d,
            startDate: isNaN(start?.getTime() ?? NaN) ? null : start,
            endDate: isNaN(end?.getTime() ?? NaN) ? null : end,
          };
        });

        setDeletedBookings(raw);
      },
      (error) => {
        console.error("Snapshot error from deletedbookings:", error);
        setDeletedBookings([]); 
      }
    );

  return () => unsub();
}, [auth().currentUser?.uid]);



 const pretty = (d: Date | null) => (d ? d.toLocaleDateString('hu-HU') : '—');

 const getBookingStatus = (start: Date | null, end: Date | null): string => {
  if (!start || !end) return 'ismeretlen';

  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const startDay = new Date(start);
  startDay.setHours(0, 0, 0, 0);

  const endDay = new Date(end);
  endDay.setHours(0, 0, 0, 0);

  if (today < startDay) return 'Közelgő';
  if (today > endDay) return 'Lejárt';
  return 'Aktív';
};

const calculateExpectedCost = (start: Date | null, end: Date | null, basePrice: number): number | null => {
  if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  const millisPerDay = 1000 * 60 * 60 * 24;
  const nights = Math.round((end.getTime() - start.getTime()) / millisPerDay);

  return nights > 0 ? nights * basePrice : basePrice;
};

const activeBookings = bookings.filter(
      (b) => getBookingStatus(b.startDate, b.endDate) === 'Aktív'
    );
    const reservedBookings = bookings.filter(
      (b) => getBookingStatus(b.startDate, b.endDate) === 'Közelgő'
    );
    const expiredBookings = bookings.filter(
      (b) => getBookingStatus(b.startDate, b.endDate) === 'Lejárt'
    );

    const handleCancelBooking = async (booking: any) => {
  try {
    await firestore()
      .collection('deletedbookings')
      .doc(booking.id) 
      .set({
        ...booking,
        cancelledAt: new Date(),
      });

    await firestore().collection('bookings').doc(booking.id).delete();
  } catch (error) {
    console.error('Lemondás hiba:', error);
  }
};


const handleDeleteExpired = async (bookingId: string) => {
  try {
    await firestore().collection('bookings').doc(bookingId).delete();
  } catch (error) {
    console.error('Lejárt törlése hiba:', error);
  }
};

const handleDeleteCancelled = async (bookingId: string) => {
  try {
    await firestore().collection('deletedbookings').doc(bookingId).delete();
  } catch (error) {
    console.error('Lemondott törlése hiba:', error);
  }
};

const handleRebook = (navigation: any, item: any) => {
  Toast.show({
    type: "info",
    text1: "Újrafoglalás",
    text2: "Kérlek, válassz új dátumot a foglaláshoz!",
    position: "bottom",
    visibilityTime: 3000,
    autoHide: true,
    bottomOffset: 40,
  });

  navigation.navigate("Booking", {
    prefillData: {
      roomId: item.roomId,
      roomDetails: item.roomDetails,
    },
  });
};




return (
    <View style={styles.container}>
        <View style={styles.topBar}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                <FontAwesomeIcon icon={faCircleLeft} size={40} color="black" />
            </TouchableOpacity>
            <View style={styles.header}><Text style={styles.headerText}>Szobafoglalásaim</Text></View>
            <View style={styles.iconButton} />
        </View>


       {/* Görgethető tartalom */}
    <ScrollView 
      style={{ width: '100%', paddingTop: 5, marginBottom: 80}}
      contentContainerStyle={{ alignItems: 'center', paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
      >

      {/* Aktív */}
<View style={styles.sectionBox}>
  <TouchableOpacity onPress={() => setShowActive(!showActive)} style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>Aktív</Text>
    <FontAwesomeIcon icon={showActive ? faCaretUp : faCaretDown} size={30} color="black" />
  </TouchableOpacity>

{showActive && (
  activeBookings.length === 0 ? (
    <View style={styles.emptyState}>
      <FontAwesomeIcon icon={faCalendarXmark} size={50} color="gray" />
      <Text style={styles.emptyStateText}>Jelenleg nincs aktív foglalása</Text>
    </View>
  ) : (
    activeBookings.map((item) => (
      <View key={item.id} style={styles.bookingCard}>
        <Text style={styles.bookingTitle}>{item.roomDetails?.name || 'Ismeretlen szoba'}</Text>
      <Text style={styles.bookingText}>{(item.roomDetails?.floor ?? '—') + 1}. emelet • {item.roomDetails?.type ?? '—'}</Text>
      <Text style={styles.bookingText}>
        {pretty(item.startDate)} - {pretty(item.endDate)}
      </Text>
      <Text style={styles.bookingText}>
        Alap ár: {
          calculateExpectedCost(item.startDate, item.endDate, item.roomDetails?.basePrice ?? 0)?.toLocaleString('hu-HU')
          ?? '—'
        } Ft
      </Text>
      </View>
    ))
  )
)}

</View>

{/* Közelgő */}
<View style={styles.sectionBox}>
  <TouchableOpacity onPress={() => setShowReserved(!showReserved)} style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>Közelgő</Text>
    <FontAwesomeIcon icon={showReserved ? faCaretUp : faCaretDown} size={30} color="black" />
  </TouchableOpacity>

{showReserved  && (
  reservedBookings.length === 0 ? (
    <View style={styles.emptyState}>
      <FontAwesomeIcon icon={faCalendarXmark} size={50} color="gray" />
      <Text style={styles.emptyStateText}>Jelenleg nincs közelgő foglalása</Text>
    </View>
  ) : (
    reservedBookings.map((item) => (
      <View key={item.id} style={styles.bookingCard}>
        <Text style={styles.bookingTitle}>{item.roomDetails?.name || 'Ismeretlen szoba'}</Text>
      <Text style={styles.bookingText}>{(item.roomDetails?.floor ?? '—') + 1}. emelet • {item.roomDetails?.type ?? '—'}</Text>
      <Text style={styles.bookingText}>
        {pretty(item.startDate)} - {pretty(item.endDate)}
      </Text>
      <Text style={styles.bookingText}>
        Alap ár: {
          calculateExpectedCost(item.startDate, item.endDate, item.roomDetails?.basePrice ?? 0)?.toLocaleString('hu-HU')
          ?? '—'
        } Ft
      </Text>
      <TouchableOpacity
  style={styles.deleteButton}
  onPress={() => {
    setConfirmAction({ type: 'cancel', booking: item });
    setConfirmVisible(true);
  }}
>
  <Text style={styles.deleteButtonText}>Lemondás</Text>
</TouchableOpacity>


      </View>
    ))
  )
)}

</View>

{/* Lejárt */}
<View style={styles.sectionBox}>
  <TouchableOpacity onPress={() => setShowExpired(!showExpired)} style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>Lejárt</Text>
    <FontAwesomeIcon icon={showExpired ? faCaretUp : faCaretDown} size={30} color="black" />
  </TouchableOpacity>

{showExpired && (
    expiredBookings.length === 0 ? (
      <View style={styles.emptyState}>
        <FontAwesomeIcon icon={faCalendarXmark} size={50} color="gray" />
        <Text style={styles.emptyStateText}>Jelenleg nincs lejárt foglalása</Text>
      </View>
    ) : (
      expiredBookings.map((item) => (
        <View key={item.id} style={styles.bookingCard}>
          <Text style={styles.bookingTitle}>{item.roomDetails?.name || 'Ismeretlen szoba'}</Text>
      <Text style={styles.bookingText}>{(item.roomDetails?.floor ?? '—') + 1}. emelet • {item.roomDetails?.type ?? '—'}</Text>
      <Text style={styles.bookingText}>
        {pretty(item.startDate)} - {pretty(item.endDate)}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
      <TouchableOpacity
  style={styles.deleteButton}
  onPress={() => {
    setConfirmAction({ type: 'deleteExpired', booking: item });
    setConfirmVisible(true);
  }}
>
  <Text style={styles.deleteButtonText}>Eltávolítás</Text>
</TouchableOpacity>

      <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleRebook(navigation, item)}
      /* onPress={() => {
    Toast.show({
      type: 'info',
      text1: 'Újrafoglalás',
      text2: 'Kérlek, válassz új dátumot a foglaláshoz!',
      position: 'bottom',
      visibilityTime: 3000,
      autoHide: true,
      bottomOffset: 40,
    });

    navigation.navigate('Booking', {
      prefillData: {
        roomId: item.roomId,
        roomDetails: item.roomDetails,
      },
    });
  }} */
    >
      <Text style={styles.deleteButtonText}>Újrafoglalás</Text>
    </TouchableOpacity>
    </View>

        </View>
      ))
    )
  )}

</View>

{/* Lemondott */}
<View style={styles.sectionBox}>
  <TouchableOpacity onPress={() => setShowCancelled(!showCancelled)} style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>Lemondott</Text>
    <FontAwesomeIcon icon={showCancelled ? faCaretUp : faCaretDown} size={30} color="black" />
  </TouchableOpacity>


{showCancelled && (
    deletedBookings.length === 0 ? (
      <View style={styles.emptyState}>
        <FontAwesomeIcon icon={faCalendarXmark} size={50} color="gray" />
        <Text style={styles.emptyStateText}>Jelenleg nincs lemondott foglalása</Text>
      </View>
    ) : (
      deletedBookings.map((item) => (
        <View key={item.id} style={styles.bookingCard}>
          <Text style={styles.bookingTitle}>{item.roomDetails?.name || 'Ismeretlen szoba'}</Text>
      <Text>{(item.roomDetails?.floor ?? '—') + 1}. emelet • {item.roomDetails?.type ?? '—'}</Text>
      <Text>
        {pretty(item.startDate)} - {pretty(item.endDate)}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
      <TouchableOpacity
  style={styles.deleteButton}
  onPress={() => {
    setConfirmAction({ type: 'deleteCancelled', booking: item });
    setConfirmVisible(true);
  }}
>
  <Text style={styles.deleteButtonText}>Eltávolítás</Text>
</TouchableOpacity>


      <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleRebook(navigation, item)}
      /* onPress={() => {
    Toast.show({
      type: 'info',
      text1: 'Újrafoglalás',
      text2: 'Kérlek, válassz új dátumot a foglaláshoz!',
      position: 'bottom',
      visibilityTime: 3000,
      autoHide: true,
      bottomOffset: 40,
    });

    navigation.navigate('Booking', {
      prefillData: {
        roomId: item.roomId,
        roomDetails: item.roomDetails,
      },
    });
  }} */
    >
      <Text style={styles.deleteButtonText}>Újrafoglalás</Text>
    </TouchableOpacity>
        </View>
        </View>
      ))
    )
  )}

</View>




    </ScrollView>
{/* Foglalás */}
{<View style={styles.newBookingBlock}>
        
        <TouchableOpacity
          style={styles.newBookingButton}
          onPress={() => navigation.navigate('Booking', {})}
        >
          <Text style={styles.newBookingButtonText}>Új foglalás indítása</Text>
        </TouchableOpacity>
        
      </View>}
    {/* Foglalás-vége */}

    <Modal
  transparent
  visible={confirmVisible}
  animationType="slide"
  onRequestClose={() => setConfirmVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>
      <Text style={styles.modalTitle}>Megerősítés</Text>
      <Text style={styles.modalText}>
        {confirmAction?.type === 'cancel' && 'Biztosan lemondod ezt a foglalást?'}
        {confirmAction?.type === 'deleteExpired' && 'Biztosan eltávolítod a lejárt foglalást?'}
        {confirmAction?.type === 'deleteCancelled' && 'Biztosan eltávolítod a lemondott foglalást?'}
      </Text>

      <View style={styles.modalButtons}>
        <TouchableOpacity
          style={[styles.modalButton, styles.cancelButton]}
          onPress={() => setConfirmVisible(false)}
        >
          <Text style={styles.modalButtonTextNo}>Mégse</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modalButton, styles.confirmButton]}
          onPress={async () => {
            if (confirmAction?.booking) {
              if (confirmAction.type === 'cancel') {
                await handleCancelBooking(confirmAction.booking);
              } else if (confirmAction.type === 'deleteExpired') {
                await handleDeleteExpired(confirmAction.booking.id);
              } else if (confirmAction.type === 'deleteCancelled') {
                await handleDeleteCancelled(confirmAction.booking.id);
              }
            }
            setConfirmVisible(false);
            setConfirmAction(null);
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
    //borderWidth: 1,
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
    //borderWidth: 1,
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
  sectionBox: {
    backgroundColor: '#fff2d5',
    padding: 10,
    marginVertical: 10,
    width: '90%',
    borderRadius: 10,
    borderColor: '#000000',
    borderWidth: 1.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  emptyStateText: {
    marginTop: 8,
    fontSize: 16,
    color: 'gray',
  },
  bookingCard: {
    width: '100%',
    backgroundColor: '#fbe9d0',
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    //elevation: 3,
  },
   bookingTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bookingText: {
    fontSize: 14,
    fontWeight: "black",
    marginBottom: 3,
  },
  deleteButton: {
    marginTop: 8, 
    marginLeft: 7.5,
    alignSelf: 'flex-end', 
    padding: 8, 
    backgroundColor: '#ffd18b', 
    borderRadius: 6,
    borderWidth: 1.5,
  },
  deleteButtonText: {
    color: '#000', 
    fontWeight: 'bold'
  },
  newBookingBlock: {
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
  newBookingButton: {
    backgroundColor: '#ffd18b',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderWidth: 1.5,
    marginVertical: 10,
  },
  newBookingButtonText: {
    fontWeight: 'bold',
    fontSize: 17
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
export default MyBookingsScreen;
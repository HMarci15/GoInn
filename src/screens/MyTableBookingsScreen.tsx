import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator, Modal  } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleLeft } from '@fortawesome/free-regular-svg-icons/faCircleLeft';
import {faCircleInfo} from '@fortawesome/free-solid-svg-icons/faCircleInfo';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { faCalendarXmark } from '@fortawesome/free-regular-svg-icons/faCalendarXmark';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';

type Props = StackScreenProps<RootStackParamList, 'MyTableBookings'>;

type TableBookingDoc = {
  id: string;
  userId: string;
  date: string; //yyyy-mm-dd
  mealType: 'breakfast' | 'lunch' | 'dinner';
  time: string; //hh:mm
  tableSize?: number | null;
  specialRequest?: string;
  status?: string;        
  createdAt?: any;
};

const MyTableBookingsScreen: React.FC<Props> = ({ navigation }) => {
    const [loading, setLoading] = useState(true);

  const [showActive, setShowActive] = useState(false);
  const [showReserved, setShowReserved] = useState(false);
  const [showExpired, setShowExpired] = useState(false);
  const [showCancelled, setShowCancelled] = useState(false);

  const [bookings, setBookings] = useState<TableBookingDoc[]>([]);
  const [deletedBookings, setDeletedBookings] = useState<TableBookingDoc[]>([]);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
  type: 'cancel' | 'deleteExpired' | 'deleteCancelled';
  booking: TableBookingDoc | null;
} | null>(null);

  const user = auth().currentUser;

  const prettyDate = (dStr: string) => {
    try {
      const [y, m, d] = dStr.split('-').map(Number);
      const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
      return dt.toLocaleDateString('hu-HU');
    } catch {
      return dStr || '—';
    }
  };

  const hmToMinutes = (hm: string | null | undefined) => {
    if (!hm) return null;
    const [h, m] = hm.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m;
    }

  const getStatus = (dStr: string) => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  if (dStr === todayStr) return 'Mai';
  if (dStr > todayStr) return 'Jövőbeli';
  return 'Lejárt';
};


  useEffect(() => {
    if (!user) return;

    const unsub = firestore()
      .collection('tablebookings')
      .where('userId', '==', user.uid)
      .orderBy('date', 'desc')
      .onSnapshot(
        (qs) => {
          const rows: TableBookingDoc[] = qs.docs.map(doc => {
            const d = doc.data() as any;
            return {
              id: doc.id,
              ...d,
            } as TableBookingDoc;
          });
          setBookings(rows);
          setLoading(false);
          //foglalas ell. (lenyitas)
        const hasToday = rows.some(b => getStatus(b.date) === 'Mai');
        setShowActive(hasToday); 
        },
        (err) => {
          console.error('tablebookings snapshot error:', err);
          setBookings([]);
          setLoading(false);
          setShowActive(false); 
        }
      );

    return () => unsub();
  }, [user?.uid]);

  useEffect(() => {
    if (!user) {
      setDeletedBookings([]);
      return;
    }

    const unsub = firestore()
      .collection('deletedtablebookings')
      .where('userId', '==', user.uid)
      .orderBy('date', 'desc')
      .onSnapshot(
        (qs) => {
          const rows: TableBookingDoc[] = qs.docs.map(doc => {
            const d = doc.data() as any;
            return {
              id: doc.id,
              ...d,
            } as TableBookingDoc;
          });
          setDeletedBookings(rows);
        },
        (err) => {
          console.error('deletedtablebookings snapshot error:', err);
          setDeletedBookings([]);
        }
      );

    return () => unsub();
  }, [user?.uid]);

  const todayBookings = useMemo(
    () => bookings.filter(b => getStatus(b.date) === 'Mai'),
    [bookings]
  );
  const futureBookings = useMemo(
    () => bookings.filter(b => getStatus(b.date) === 'Jövőbeli'),
    [bookings]
  );
  const expiredBookings = useMemo(
    () => bookings.filter(b => getStatus(b.date) === 'Lejárt'),
    [bookings]
  );


  const handleCancel = async (item: TableBookingDoc) => {
    try {
      await firestore()
        .collection('deletedtablebookings')
        .doc(item.id)
        .set({
          ...item,
          cancelledAt: new Date(),
        });

      await firestore().collection('tablebookings').doc(item.id).delete();
    } catch (e) {
      console.error('Asztalfoglalás lemondása hiba:', e);
    }
  };

  const handleDeleteExpired = async (id: string) => {
    try {
      await firestore().collection('tablebookings').doc(id).delete();
    } catch (e) {
      console.error('Lejárt asztalfoglalás törlése hiba:', e);
    }
  };

  const handleDeleteCancelled = async (id: string) => {
    try {
      await firestore().collection('deletedtablebookings').doc(id).delete();
    } catch (e) {
      console.error('Lemondott asztalfoglalás törlése hiba:', e);
    }
  };

  const rebook = (item: TableBookingDoc) => {
    navigation.navigate('TableBooking', {
      prefillData: {
        date: item.date,
        mealType: item.mealType,
        // time: item.time, 
        tableSize: item.tableSize ?? undefined,
        specialRequest: item.specialRequest ?? '',
      },
    } as any);
  };

  const handleRebookTable = (navigation: any, item: TableBookingDoc) => {
  Toast.show({
    type: "info",
    text1: "Újrafoglalás",
    text2: "Kérlek, válassz új dátumot az asztalfoglaláshoz!",
    position: "bottom",
    visibilityTime: 3000,
    autoHide: true,
    bottomOffset: 40,
  });

  navigation.navigate("TableBooking", {
    prefillData: {
      tableSize: item.tableSize ?? null,
      specialRequest: item.specialRequest ?? "",
    },
  });
};

  

  return (
    <View style={styles.container}>
      
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faCircleLeft} size={40} color="black" />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.headerText}>Asztalfoglalásaim</Text>
        </View>
        <View style={styles.iconButton} />
      </View>

      <View style={styles.infoBox}>
              <FontAwesomeIcon icon={faCircleInfo} size={20} color="black" style={{ marginRight: 6 }} />
              <Text style={styles.infoText}>A mai foglalások nem mondhatók le az alkalmazásban. Kérjük, szükség esetén közvetlenül az éttermet értesítse.</Text>
            </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 200 }}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <ScrollView
          style={{ width: '100%', paddingTop: 5, marginBottom: 80 }}
          contentContainerStyle={{ alignItems: 'center', paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >

        

          {/* Mai */}
          <View style={styles.sectionBox}>
            <TouchableOpacity onPress={() => setShowActive(!showActive)} style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mai</Text>
              <FontAwesomeIcon icon={showActive ? faCaretUp : faCaretDown} size={30} color="black" />
            </TouchableOpacity>

            {showActive && (
              todayBookings.length === 0 ? (
                <View style={styles.emptyState}>
                  <FontAwesomeIcon icon={faCalendarXmark} size={50} color="gray" />
                  <Text style={styles.emptyStateText}>Ma nincs asztalfoglalása</Text>
                </View>
              ) : (
                todayBookings.map(item => (
                  <View key={item.id} style={styles.bookingCard}>
                    <Text style={styles.bookingTitle}>
                      {item.mealType === 'breakfast' ? 'Reggeli' : item.mealType === 'lunch' ? 'Ebéd' : 'Vacsora'} • {item.time}
                    </Text>
                    <Text style={styles.bookingText}>{prettyDate(item.date)} • {item.tableSize ? `${item.tableSize} fő` : '—'}</Text>
                    {item.specialRequest && item.specialRequest.trim() !== '' && (
                      <Text style={styles.bookingText}>
                        Megjegyzés: {item.specialRequest}
                      </Text>
                    )}
                  </View>
                ))
              )
            )}
          </View>

          {/* Jövőbeli / Közelgő */}
          <View style={styles.sectionBox}>
            <TouchableOpacity onPress={() => setShowReserved(!showReserved)} style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Közelgő</Text>
              <FontAwesomeIcon icon={showReserved ? faCaretUp : faCaretDown} size={30} color="black" />
            </TouchableOpacity>

            {showReserved && (
              futureBookings.length === 0 ? (
                <View style={styles.emptyState}>
                  <FontAwesomeIcon icon={faCalendarXmark} size={50} color="gray" />
                  <Text style={styles.emptyStateText}>Nincs közelgő asztalfoglalása</Text>
                </View>
              ) : (
                futureBookings.map(item => (
                  <View key={item.id} style={styles.bookingCard}>
                    <Text style={styles.bookingTitle}>
                      {item.mealType === 'breakfast' ? 'Reggeli' : item.mealType === 'lunch' ? 'Ebéd' : 'Vacsora'} • {item.time}
                    </Text>
                    <Text style={styles.bookingText}>{prettyDate(item.date)} • {item.tableSize ? `${item.tableSize} fő` : '—'}</Text>
                    {item.specialRequest && item.specialRequest.trim() !== '' && (
                      <Text style={styles.bookingText}>
                        Megjegyzés: {item.specialRequest}
                      </Text>
                    )}
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
                  <Text style={styles.emptyStateText}>Nincs lejárt asztalfoglalása</Text>
                </View>
              ) : (
                expiredBookings.map(item => (
                  <View key={item.id} style={styles.bookingCard}>
                    <Text style={styles.bookingTitle}>
                      {item.mealType === 'breakfast' ? 'Reggeli' : item.mealType === 'lunch' ? 'Ebéd' : 'Vacsora'} • {item.time}
                    </Text>
                    <Text style={styles.bookingText}>{prettyDate(item.date)} • {item.tableSize ? `${item.tableSize} fő` : '—'}</Text>
                    {item.specialRequest && item.specialRequest.trim() !== '' && (
                      <Text style={styles.bookingText}>
                        Megjegyzés: {item.specialRequest}
                      </Text>
                    )}
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
                        onPress={() => handleRebookTable(navigation, item)}
                        /* onPress={() =>
                          navigation.navigate('TableBooking', {
                            prefillData: {
                              tableSize: item.tableSize ?? null,
                              specialRequest: item.specialRequest ?? ''
                            }
                          })
                        } */
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
                  <Text style={styles.emptyStateText}>Nincs lemondott asztalfoglalása</Text>
                </View>
              ) : (
                deletedBookings.map(item => (
                  <View key={item.id} style={styles.bookingCard}>
                    <Text style={styles.bookingTitle}>
                      {item.mealType === 'breakfast' ? 'Reggeli' : item.mealType === 'lunch' ? 'Ebéd' : 'Vacsora'} • {item.time}
                    </Text>
                    <Text style={styles.bookingText}>{prettyDate(item.date)} • {item.tableSize ? `${item.tableSize} fő` : '—'}</Text>
                    {item.specialRequest && item.specialRequest.trim() !== '' && (
                      <Text style={styles.bookingText}>
                        Megjegyzés: {item.specialRequest}
                      </Text>
                    )}
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
                        onPress={() => handleRebookTable(navigation, item)}
                        /* onPress={() =>
                          navigation.navigate('TableBooking', {
                            prefillData: {
                              tableSize: item.tableSize ?? null,
                              specialRequest: item.specialRequest ?? ''
                            }
                          })
                        } */
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
      )}

      {/* Új foglalás */}
      <View style={styles.newBookingBlock}>
        <TouchableOpacity
          style={styles.newBookingButton}
          onPress={() => navigation.navigate('TableBooking')}
        >
          <Text style={styles.newBookingButtonText}>Új foglalás indítása</Text>
        </TouchableOpacity>
      </View>

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
                await handleCancel(confirmAction.booking);
              } else if (confirmAction.type === 'deleteExpired') {
                await handleDeleteExpired(confirmAction.booking.id);
              } else if (confirmAction.type === 'deleteCancelled') {
                await handleDeleteCancelled(confirmAction.booking.id);
              }
            }
            setConfirmVisible(false);
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff2d5',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#000',
    width: '90%',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    fontStyle: 'italic',
    flex: 1,
    flexWrap: 'wrap',
    marginLeft: 5,
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

export default MyTableBookingsScreen;

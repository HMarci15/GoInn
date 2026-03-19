import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView, Modal } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import firestore from '@react-native-firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleLeft } from '@fortawesome/free-regular-svg-icons/faCircleLeft';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons/faCircleUser';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faHistory } from '@fortawesome/free-solid-svg-icons/faHistory';
import { faCalendarXmark } from '@fortawesome/free-regular-svg-icons/faCalendarXmark';
import auth from '@react-native-firebase/auth';

type Props = StackScreenProps<RootStackParamList, 'MyIssues'>;

type Report = {
  id: string;
  description: string;
  photoUri: string;
  room: string;
  timestamp: any;
  userId: string;
  userName: string;
};

const MyIssuesScreen: React.FC<Props> = ({ navigation }) => {
  const [activeReports, setActiveReports] = useState<Report[]>([]);
  const [deletedReports, setDeletedReports] = useState<Report[]>([]);
  const [showActive, setShowActive] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmAction, setConfirmAction] = useState<null | {
    type: 'withdraw' | 'delete';
    report: Report | null;
  }>(null);


  const fetchReports = async () => {
    const currentUser = auth().currentUser;
    if (!currentUser) return;

    const [activeSnap, deletedSnap] = await Promise.all([
      firestore()
        .collection('reports')
        .where('userId', '==', currentUser.uid)
        .orderBy('timestamp', 'desc')
        .get(),
      firestore()
        .collection('deletedreports')
        .where('userId', '==', currentUser.uid)
        .orderBy('timestamp', 'desc')
        .get()
    ]);

    const active = activeSnap.docs.map(
    doc => ({ id: doc.id, ...doc.data() } as Report)
  );
  const deleted = deletedSnap.docs.map(
    doc => ({ id: doc.id, ...doc.data() } as Report)
  );

  setActiveReports(active);
  setDeletedReports(deleted);

  // aktiv ell. (lenyitas)
  setShowActive(active.length > 0);
};

  useEffect(() => {
    fetchReports();
  }, []);

  const handleWithdrawReport = async (report: Report) => {
    try {
      await firestore().collection('deletedreports').doc(report.id).set(report);
      await firestore().collection('reports').doc(report.id).delete();
      setActiveReports(prev => prev.filter(r => r.id !== report.id));
      setDeletedReports(prev => [report, ...prev]);
    } catch (error) {
      console.error('Hiba a visszavonáskor:', error);
      //Alert.alert('Hiba', 'Nem sikerült visszavonni a bejelentést.');
    }
  };

  const handleDeleteFromDeleted = async (reportId: string) => {
  try {
    await firestore().collection('deletedreports').doc(reportId).delete();
    setDeletedReports(prev => prev.filter(r => r.id !== reportId));
  } catch (error) {
    console.error('Hiba az eltávolítás során:', error);
    //Alert.alert('Hiba', 'Nem sikerült eltávolítani a bejelentést.');
  }
};


  return (
  <View style={styles.container}>
    <View style={styles.topBar}>
      <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
        <FontAwesomeIcon icon={faCircleLeft} size={40} color="black" />
      </TouchableOpacity>
      <View style={styles.header}><Text style={styles.headerText}>Bejelentett hibák</Text></View>
      <View style={styles.iconButton} />
    </View>

    <ScrollView
      style={{ width: '100%', paddingTop: 5, marginBottom: 80 }}
      contentContainerStyle={{ alignItems: 'center', paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >

      {/* Aktív bejelentések */}
        <View style={styles.sectionBox}>
          <TouchableOpacity onPress={() => setShowActive(!showActive)} style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Aktív bejelentések</Text>
            <FontAwesomeIcon icon={showActive ? faCaretUp : faCaretDown} size={30} color="black" />
          </TouchableOpacity>

          {showActive && (
            activeReports.length === 0 ? (
              <View style={styles.emptyState}>
                <FontAwesomeIcon icon={faCalendarXmark} size={50} color="gray" />
                <Text style={styles.emptyStateText}>Jelenleg nincs aktív bejelentésed</Text>
              </View>
            ) : (
              activeReports.map(item => (
                <View key={item.id} style={styles.issueCard}>
                  <Text style={styles.issueTitle}>{item.room}</Text>
                  <Text style={styles.issueText}>{item.description}</Text>
                  <Text style={styles.issueText}>
                    {new Date(item.timestamp.toDate()).toLocaleString('hu-HU')}
                  </Text>
                  <TouchableOpacity
  style={styles.deleteButton}
  onPress={() => {
    setConfirmAction({ type: 'withdraw', report: item });
    setConfirmVisible(true);
  }}
>
  <Text style={styles.deleteButtonText}>Visszavonás</Text>
</TouchableOpacity>

                </View>
              ))
            )
          )}
        </View>

        {/* Lemondott bejelentések */}
        <View style={styles.sectionBox}>
          <TouchableOpacity onPress={() => setShowDeleted(!showDeleted)} style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lemondott bejelentések</Text>
            <FontAwesomeIcon icon={showDeleted ? faCaretUp : faCaretDown} size={30} color="black" />
          </TouchableOpacity>

          {showDeleted && (
            deletedReports.length === 0 ? (
              <View style={styles.emptyState}>
                <FontAwesomeIcon icon={faCalendarXmark} size={50} color="gray" />
                <Text style={styles.emptyStateText}>Jelenleg nincs lemondott bejelentésed</Text>
              </View>
            ) : (
              deletedReports.map(item => (
                <View key={item.id} style={styles.issueCard}>
                  <Text style={styles.issueTitle}>{item.room}</Text>
                  <Text style={styles.issueText}>{item.description}</Text>
                  <Text style={styles.issueText}>
                    {new Date(item.timestamp.toDate()).toLocaleString('hu-HU')}
                  </Text>
                  <TouchableOpacity
  style={styles.deleteButton}
  onPress={() => {
    setConfirmAction({ type: 'delete', report: item });
    setConfirmVisible(true);
  }}
>
  <Text style={styles.deleteButtonText}>Eltávolítás</Text>
</TouchableOpacity>

                </View>
              ))

            )
          )}
        </View>


      

    </ScrollView>

    {<View style={styles.newIssueBlock}>
            
            <TouchableOpacity
              style={styles.newIssueButton}
              onPress={() => navigation.navigate('Issue', {
                photoPath: undefined,
                tempRoom: undefined,
                tempDescription: undefined,
              })}>
              <Text style={styles.newIssueButtonText}>Új bejelentés</Text>
            </TouchableOpacity>
            
          </View>}

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
        {confirmAction?.type === 'withdraw' && 'Biztosan visszavonod ezt a bejelentést?'}
        {confirmAction?.type === 'delete' && 'Biztosan eltávolítod ezt a bejelentést?'}
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
            if (confirmAction?.report) {
              if (confirmAction.type === 'withdraw') {
                await handleWithdrawReport(confirmAction.report);
              } else if (confirmAction.type === 'delete') {
                await handleDeleteFromDeleted(confirmAction.report.id);
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
  issueCard: {
    width: '100%',
    backgroundColor: '#fbe9d0',
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
  },
  issueTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  issueText: {
    fontSize: 14,
    fontWeight: "black",
    marginBottom: 3,
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
  newIssueBlock: {
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
  newIssueButton: {
    backgroundColor: '#ffd18b',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderWidth: 1.5,
    marginVertical: 10,
  },
  newIssueButtonText: {
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

export default MyIssuesScreen;

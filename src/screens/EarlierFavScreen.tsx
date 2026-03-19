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
import { faCompass } from '@fortawesome/free-regular-svg-icons/faCompass';
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faHistory } from '@fortawesome/free-solid-svg-icons/faHistory';
import auth from '@react-native-firebase/auth';

type Props = StackScreenProps<RootStackParamList, 'EarlierFav'>;

const EarlierFavScreen: React.FC<Props> = ({ navigation }) => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [confirmVisible, setConfirmVisible] = useState(false);
const [confirmAction, setConfirmAction] = useState<null | {
  type: 'fav' | 'history' | 'favAll' | 'historyAll';
  routeId?: string;
}>(null);


    


  useEffect(() => {
    fetchRoutes();
  }, []);

  // firestore lekeres
  const fetchRoutes = async () => {
    const user = auth().currentUser;
    if (user) {
      try {
        const favoriteRoutes = await firestore()
          .collection('users')
          .doc(user.uid)
          .collection('routes')
          .doc('favoriteRoutes')
          .get();
        const historyRoutes = await firestore()
          .collection('users')
          .doc(user.uid)
          .collection('routes')
          .doc('history')
          .get();

        setFavorites((favoriteRoutes.data()?.routes || []).slice().reverse());
        setHistory((historyRoutes.data()?.routes || []).slice().reverse());
      } catch (error) {
        console.error('Hiba a Firestore lekérésnél:', error);
      }
    }
  };

  const handleNavigate = (startId: string, endId: string) => {
    navigation.navigate('Target', { startId, endId });
  };

  const handleDeleteFromFavorites = async (routeId: string) => {
    const user = auth().currentUser;
    if (!user) return;

    const newFavorites = favorites.filter((route) => route.route_id !== routeId);
    setFavorites(newFavorites);

    await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('routes')
      .doc('favoriteRoutes')
      .update({ routes: newFavorites });
  };

  const handleDeleteFromHistory = async (routeId: string) => {
    const user = auth().currentUser;
    if (!user) return;

    const newHistory = history.filter((route) => route.route_id !== routeId);
    setHistory(newHistory);

    await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('routes')
      .doc('history')
      .update({ routes: newHistory });
  };

  const handleDeleteAllFavorites = async () => {
  const user = auth().currentUser;
  if (!user) return;
  setFavorites([]);
  await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('routes')
    .doc('favoriteRoutes')
    .update({ routes: [] });
};

const handleDeleteAllHistory = async () => {
  const user = auth().currentUser;
  if (!user) return;
  setHistory([]);
  await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('routes')
    .doc('history')
    .update({ routes: [] });
};


  return (
  <View style={styles.container}>
    <View style={styles.topBar}>
      <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
        <FontAwesomeIcon icon={faCircleLeft} size={40} color="black" />
      </TouchableOpacity>
      <View style={styles.header}><Text style={styles.headerText}>Útvonalaim</Text></View>
      <View style={styles.iconButton} />
    </View>

    <ScrollView
      style={{ width: '100%' }}
      contentContainerStyle={{ alignItems: 'center', paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >

      <View style={styles.sectionBox}>
        <View style={styles.sectionHeader}>
        <TouchableOpacity onPress={() => setShowFavorites(!showFavorites)} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.sectionTitle}>Kedvenc Útvonalak</Text>
        </TouchableOpacity>

        <View style={styles.delCaretBox}>

        {favorites.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setConfirmAction({ type: 'favAll' });
              setConfirmVisible(true);
            }}
            style={styles.deleteAllButton}
          >
            <FontAwesomeIcon icon={faTrash} size={22} color="black" />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => setShowFavorites(!showFavorites)} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesomeIcon icon={showFavorites ? faCaretUp : faCaretDown} size={30} color="black" />
        </TouchableOpacity>

        </View>
      </View>

        {showFavorites && favorites.map((item) => (
          <View key={item.route_id} style={styles.routeItem}>
            <Text style={styles.routeText}>{item.route_name}</Text>
            <View style={styles.delNavBox}>
              <TouchableOpacity
                onPress={() => {
                  setConfirmAction({ type: 'fav', routeId: item.route_id });
                  setConfirmVisible(true);
                }}
                style={styles.trashButton}
              >
                <FontAwesomeIcon icon={faTrash} size={20} color="black" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleNavigate(item.start_id, item.end_id)}
                style={styles.navigateButton}>
                <FontAwesomeIcon icon={faCompass} size={25} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.sectionBox}>
        <View style={styles.sectionHeader}>
          <TouchableOpacity 
            onPress={() => setShowHistory(!showHistory)} 
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Text style={styles.sectionTitle}>Korábbi Útvonalak</Text>
          </TouchableOpacity>

          <View style={styles.delCaretBox}>

          {history.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setConfirmAction({ type: 'historyAll' });
                setConfirmVisible(true);
              }}
              style={styles.deleteAllButton}
            >
              <FontAwesomeIcon icon={faTrash} size={22} color="black" />
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            onPress={() => setShowHistory(!showHistory)} 
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <FontAwesomeIcon icon={showHistory ? faCaretUp : faCaretDown} size={30} color="black" />
          </TouchableOpacity>

          </View>

        </View>

        {showHistory && history.map((item) => (
          <View key={item.route_id} style={styles.routeItem}>
            <Text style={styles.routeText}>{item.route_name}</Text>
            <View style={styles.delNavBox}>
              <TouchableOpacity
                onPress={() => {
                  setConfirmAction({ type: 'history', routeId: item.route_id });
                  setConfirmVisible(true);
                }}
                style={styles.trashButton}
              >
                <FontAwesomeIcon icon={faTrash} size={20} color="black" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleNavigate(item.start_id, item.end_id)}
                style={styles.navigateButton}>
                <FontAwesomeIcon icon={faCompass} size={25} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

    </ScrollView>

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
        {confirmAction?.type === 'fav' && 'Biztosan törlöd ezt a kedvenc útvonalat?'}
        {confirmAction?.type === 'history' && 'Biztosan törlöd ezt a korábbi útvonalat?'}
        {confirmAction?.type === 'favAll' && 'Biztosan törlöd az összes kedvenc útvonalat?'}
        {confirmAction?.type === 'historyAll' && 'Biztosan törlöd az összes korábbi útvonalat?'}
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
            if (confirmAction) {
              if (confirmAction.type === 'fav') {
                await handleDeleteFromFavorites(confirmAction.routeId!);
              } else if (confirmAction.type === 'history') {
                await handleDeleteFromHistory(confirmAction.routeId!);
              } else if (confirmAction.type === 'favAll') {
                await handleDeleteAllFavorites();
              } else if (confirmAction.type === 'historyAll') {
                await handleDeleteAllHistory();
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
    /* shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4, */
    //elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    marginBottom: 5,
    //borderWidth: 1,
  }, 
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 10,
    //borderWidth: 1,
  },
  toggleIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  delCaretBox: {
    flexDirection: 'row',
    //marginLeft: 80,
  },
  deleteAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff2d5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    //borderWidth: 1.5,
    borderRadius: 8,
    //marginLeft: 80,
    marginRight: 5,
  },
  deleteAllText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  routeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fbe9d0',
    marginBottom: 10,
    borderWidth: 1.2,
    borderRadius: 8,
  },
  routeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  delNavBox: {
    flexDirection: 'row',
    //borderWidth: 1,
    alignItems: 'center',
  },
  navigateButton: {
    backgroundColor: '#ffd18b',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderRadius: 5,
  },
  trashButton: {
    marginRight: 9,
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

export default EarlierFavScreen;

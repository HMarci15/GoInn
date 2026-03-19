import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  TextInput,
  Image,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleLeft } from '@fortawesome/free-regular-svg-icons/faCircleLeft';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons/faCircleUser';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown';
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart';
import { graphData, VertexData } from '../store/graphData';
import { calculateAStarPath } from '../algorithms/astar';
import { useUserPreferences } from '../context/UserPreferencesContext';
//import Floor1Map from '../assets/svg/hotelelso3.svg'; 
import Svg, { Polyline } from 'react-native-svg'
import { Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';


const floorMaps: { [key: number]: any } = {
  0: require('../assets/svg/hotelelso3.svg').default,
  1: require('../assets/svg/hotelmasodik1.svg').default,
  2: require('../assets/svg/hotelharmadik1.svg').default,
};


type Props = StackScreenProps<RootStackParamList, 'Target'>;

const TargetScreen: React.FC<Props> = ({ navigation, route }) => {
  const { startId, endId } = route.params;   // qr-kodbol erkezo kezdo node
  const { mobilityImpaired } = useUserPreferences();
  

  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [path, setPath] = useState<string[]>([]);
  const [currentFloor, setCurrentFloor] = useState(0);
  const [roomQuery, setRoomQuery] = useState('');
  const [filteredRooms, setFilteredRooms] = useState<VertexData[]>([]);
  const isFocused = useIsFocused();


  const CurrentFloorMap = floorMaps[currentFloor] ?? floorMaps[0];

  useEffect(() => {
    const startNode = graphData.vertices.find(v => v.id === startId);
    if (startNode && typeof startNode.floor === 'number') {
      setCurrentFloor(startNode.floor);
    } else {
      setCurrentFloor(0);
    }
  }, [startId]);


   useEffect(() => {
    if (endId) {
      calculateRoute(startId, endId);
    }
  }, [startId, endId]);

  //beallitasok utan ujraszamol
useEffect(() => {
  if (selectedTarget && isFocused) {
    calculateRoute(startId, selectedTarget);
  }
}, [mobilityImpaired, isFocused]);




  /* useEffect(() => {
    return () => {
      setPath([]); 
    };
  }, []); */

  const saveToHistory = async (path: string[]) => {
  const user = auth().currentUser;
  if (!user) return;

  const startNode = graphData.vertices.find(v => v.id === path[0]);
  const endNode = graphData.vertices.find(v => v.id === path[path.length - 1]);

  if (!startNode || !endNode) return;

  const route = {
    route_id: `${startNode.id}_${endNode.id}`,
    start_id: startNode.id,
    end_id: endNode.id,
    route_name: `${startNode.objectName ?? startNode.id} → ${endNode.objectName ?? endNode.id}`
  };

  const historyDocRef = firestore()
    .collection('users')
    .doc(user.uid)
    .collection('routes')
    .doc('history');

  const historyDoc = await historyDocRef.get();
  const existing = historyDoc.data()?.routes || [];

  const alreadyExists = existing.some((r: any) => r.route_id === route.route_id);
  if (alreadyExists) return;

  await historyDocRef.set({ routes: [...existing, route] });
};

  const calculateRoute = (startId: string, endId: string) => {
    if (!endId) {
      Toast.show({
        type: 'info',
        text1: 'Nincs célpont kiválasztva',
        text2: 'Kérlek, válassz ki egy célpontot a listából.',
        position: 'bottom',
        visibilityTime: 3000,
        autoHide: true,
        bottomOffset: 40,
      });
      return;
    }


      //ell.: kezdo es celpont ne legyen ugyanaz
      if (startId === endId) {
        Toast.show({
          type: 'info',
          text1: 'Érvénytelen célpont',
          text2: 'A kezdőpont és a cél nem lehet ugyanaz.',
          position: 'bottom',
          visibilityTime: 3000,
          autoHide: true,
          bottomOffset: 40,
        });
        return;
      }

    const isId = graphData.vertices.some(v => v.id === endId);
    let candidates: VertexData[] = [];

    if (isId) {
      const found = graphData.vertices.find(v => v.id === endId);
      if (found) candidates = [found];
    } else {
      candidates = graphData.vertices.filter(v => v.objectName === endId);
    }

    if (candidates.length === 0) return;

    const fromNode = graphData.vertices.find(v => v.id === startId);
    const toNode = candidates[0]; // az elso talalat eleg
    //nodeok buntetese
    const penalizedNodeIds = ["nodefoly_kozep", "nodefoly_lepcso_f0"/* , "nodefoly_lepcso_f1" */];
    const originalPenalties: { [id: string]: number } = {};
    //emeletvaltas
    if (fromNode && toNode) {
      let isDifferent = fromNode.floor !== toNode.floor;

      if (isDifferent && (toNode.objectName?.toLowerCase().includes("mosdó"))) {
        const sameFloorCandidate = graphData.vertices.find(
          v => v.objectName === toNode.objectName && v.floor === fromNode.floor
        );
        if (sameFloorCandidate) {
          isDifferent = false;
        }
      }

      if (isDifferent) {
        Toast.show({
          type: 'info',
          text1: 'Emeletváltás szükséges',
          text2: `A cél a(z) ${toNode.floor + 1}. emeleten található`,
          position: 'bottom',
          visibilityTime: 4000,
          autoHide: true,
          bottomOffset: 40,
        });

        penalizedNodeIds.forEach(id => {
          const node = graphData.vertices.find(v => v.id === id);
          if (node) {
            originalPenalties[id] = node.penalty ?? 0;
            node.penalty = 35;
          }
        });
      }
    }




    let shortestPath: string[] = [];
    let shortestLength = Infinity;

    const avoidTypes = mobilityImpaired ? ['stairs'] : [];

    for (const candidate of candidates) {
      const path = calculateAStarPath(startId, candidate.id, { avoidTypes });
      if (path.length > 0 && path.length < shortestLength) {
        shortestPath = path;
        shortestLength = path.length;
      }
    }

    //setPath(shortestPath);
    if (shortestPath.length > 1) {
      saveToHistory(shortestPath);
      setPath(shortestPath);
    }

    penalizedNodeIds.forEach(id => {
  const node = graphData.vertices.find(v => v.id === id);
  if (node && originalPenalties.hasOwnProperty(id)) {
    node.penalty = originalPenalties[id];
  }
});

  };


  const uniqueTargets = Array.from(
    new Set(
      graphData.vertices
        .filter(v =>
        v.objectName &&
        !v.objectName.toLowerCase().startsWith('szoba') &&
        !v.objectName.toLowerCase().includes('foly') &&
        !v.objectName.toLowerCase().includes('lift') &&
        !v.objectName.toLowerCase().includes('lépcső')
      )
      .map(v => v.objectName ?? '')
    )
  ).sort((a, b) => a.localeCompare(b, 'hu')); 


  const visiblePath = path
    .map(id => graphData.vertices.find(v => v.id === id))
    .filter(v => v && v.floor === currentFloor);

  const points = visiblePath.map(v => `${v!.cx},${v!.cy}`).join(' ');
  

  const handleRoomInput = (text: string) => {
    setRoomQuery(text);
    const query = text.trim().toLowerCase();
    if (query.length === 0) {
      setFilteredRooms([]);
      return;
    }

    const matches = graphData.vertices.filter(v =>
      v.objectName?.toLowerCase().startsWith('szoba') &&
      v.objectName.toLowerCase().includes(query)
    );

    matches.sort((a, b) => {
      const numA = parseInt(a.objectName?.match(/\d+/)?.[0] ?? '0');
      const numB = parseInt(b.objectName?.match(/\d+/)?.[0] ?? '0');
      return numA - numB;
    });

    setFilteredRooms(matches);
  };

  const saveCurrentRouteAsFavorite = async () => {
  const user = auth().currentUser;
  if (!user || path.length < 2) return;

  const startNode = graphData.vertices.find(v => v.id === path[0]);
  const endNode = graphData.vertices.find(v => v.id === path[path.length - 1]);

  if (!startNode || !endNode) return;

  const route = {
    route_id: `${startNode.id}_${endNode.id}`,
    start_id: startNode.id,
    end_id: endNode.id,
    route_name: `${startNode.objectName ?? startNode.id} → ${endNode.objectName ?? endNode.id}`
  };

  const favDocRef = firestore()
    .collection('users')
    .doc(user.uid)
    .collection('routes')
    .doc('favoriteRoutes');

  const favDoc = await favDocRef.get();
  const existing = favDoc.data()?.routes || [];

  //dupla mentes elkerulese
  const alreadyExists = existing.some((r: any) => r.route_id === route.route_id);
  if (alreadyExists) {
    Toast.show({
      type: 'info',
      text1: 'Már a kedvencek között van',
      position: 'bottom',
      visibilityTime: 3000,
      autoHide: true,
      bottomOffset: 40,
    });
    return;
  }

  await favDocRef.set({ routes: [...existing, route] });
  Toast.show({
    type: 'success',
    text1: 'Kedvencekhez adva!',
    text2: route.route_name,
    position: 'bottom',
    visibilityTime: 3000,
    autoHide: true,
    bottomOffset: 40,
  });
};

  const windowWidth = Dimensions.get('window').width;
  const renderHeight = 300;
  const svgOriginalWidth = 297;
  const svgOriginalHeight = 215;

  const widthScale = windowWidth / svgOriginalWidth;
  const heightScale = renderHeight / svgOriginalHeight;

  return (
    <View style={styles.container}>
      {/* Felső navigáció */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Location')}>
          <FontAwesomeIcon icon={faCircleLeft} size={40} color="black" />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.headerText}>Cél kiválasztása</Text>
        </View>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('Profile')}>
          <FontAwesomeIcon icon={faCircleUser} size={40} color="black" />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 5}}>
        <TouchableOpacity
          onPress={() => setCurrentFloor(f => Math.max(0, f - 1))}
          style={styles.floorButton}>
          <FontAwesomeIcon icon={faArrowDown} size={25} color="black" />
        </TouchableOpacity>
        <Text style={{ marginHorizontal: 15, fontSize: 20, textAlignVertical: 'center', fontWeight: 'bold' }}>{currentFloor + 1}. Emelet</Text>
        <TouchableOpacity
          onPress={() => setCurrentFloor(f => Math.min(2, f + 1))}
          style={styles.floorButton}>
          <FontAwesomeIcon icon={faArrowUp} size={25} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        <CurrentFloorMap width="100%" height={300} />
        <View style={styles.mapOverlay}>
          <Svg
            viewBox="0 0 297 215"
            preserveAspectRatio="xMidYMid meet"
            width="100%"
            height={300}
            style={StyleSheet.absoluteFill}>
            {visiblePath.length > 1 && (
              <Polyline
                points={points}
                fill="none"
                stroke="#000000"
                strokeWidth={1.2}
                strokeDasharray={[4, 2]}
              />
            )}
          </Svg>
        </View>
      </View>
      
      <FlatList
        data={uniqueTargets}
        keyExtractor={(name) => name!}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.buttonList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.locationButton,
              selectedTarget === item && styles.selectedButton,
            ]}
            onPress={() => {
              setSelectedTarget(item);
              setRoomQuery(''); 
              setFilteredRooms([]); 
            }}
          >
            <Text style={styles.buttonText}>{item}</Text>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Szobaszám..."
          value={roomQuery}
          onChangeText={handleRoomInput}
        />
        {filteredRooms.length > 0 && (
          <FlatList
            data={filteredRooms}
            keyExtractor={item => item.id}
            style={styles.searchResults}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => {
                  setSelectedTarget(item.id);
                  setRoomQuery(item.objectName ?? '');
                  setFilteredRooms([]);
                }}>
                <Text style={styles.textResults}>{item.objectName}</Text>
              </TouchableOpacity>
            )}
            //nestedScrollEnabled={true} // belso scroll
            //keyboardShouldPersistTaps="handled" 
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.calculateButton} onPress={() => calculateRoute(startId, selectedTarget || '')}>
         <Text style={styles.calculateText}>Mutasd az utat</Text>
        </TouchableOpacity>

        <View style={styles.favoriteBox}>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={saveCurrentRouteAsFavorite}>
           <FontAwesomeIcon icon={faHeart} size={22} color="red" />
        </TouchableOpacity>
        </View>
      </View>

      {/* {path.length > 0 && (
        <View style={styles.pathBox}>
          <Text style={styles.pathTitle}>Útvonal (node ID-k):</Text>
          <Text style={styles.pathText}>{path.join(' → ')}</Text>
        </View>
      )} */}
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
    //borderWidth: 1.4,
    borderColor: '#000000',
    paddingVertical: 4,
    marginBottom: 2.5,
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
  floorButton: {
    backgroundColor: '#ffd18b',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#000000',
    marginHorizontal: 10,
  },
  mapContainer: {
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2.5,
    position: 'relative',
    //borderWidth: 1.4,
    //borderBottomWidth: 1.5,
  },  
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  buttonList: {
    width: '90%',
    marginTop: 10,
    marginBottom: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  locationButton: {
    width: '47%',
    backgroundColor: '#ffd18b',
    padding: 12,
    borderRadius: 30,
    borderWidth: 1.5,
    marginVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 70,
  },
  selectedButton: {
    backgroundColor: '#ffdcb9',
    borderColor: '#000',
    borderRadius: 30,
    borderWidth: 1.5,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchContainer: {
    width: '85%',
    padding: 5,
    borderWidth: 1.5,
    borderColor: '#000000',
    borderRadius: 25,
    backgroundColor: '#ffd18b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  searchInput: {
    width: '90%',
    height: 45,
    backgroundColor: '#fbe9d0',
    borderWidth: 1.5,
    borderColor: '#000000',
    borderRadius: 20,
    fontWeight: '500',
    fontSize: 17,
    color: '#000',
    paddingHorizontal: 12,
  },
  searchResults: {
    maxHeight: 200,
    width: '90%',
    backgroundColor: '#ffd18b',
    borderRadius: 10,
    //borderWidth: 1.5,
    borderColor: '#ccc',
    marginTop: 8,
    //paddingVertical: 4,
    zIndex: 10,
    paddingBottom: 10,
  },
  resultItem: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginVertical: 2,
    borderRadius: 15,
    borderWidth: 1.5,
    backgroundColor: '#fbe9d0',
  },
  textResults: {
    fontWeight:'bold',
    fontSize: 17,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    //justifyContent: 'center',
    //alignItems: 'center',
    marginBottom: 10,
    marginLeft: 55,
    //borderWidth: 1,
    //gap: 15, 
  },
  calculateButton: {
    backgroundColor: '#ffd18b',
    padding: 10,
    borderRadius: 25,
    borderWidth: 1.5,
    marginBottom: 0,
  },
  calculateText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  favoriteBox: {
    backgroundColor: '#ffd18b',
    padding: 10,
    borderRadius: 25,
    borderWidth: 1.5,
    marginLeft: 10,
  },
  favoriteButton: {
    
  },
  pathBox: {
    backgroundColor: '#fff8eb',
    padding: 10,
    marginTop: 10,
    width: '90%',
    borderRadius: 10,
    borderWidth: 1,
  },
  pathTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pathText: {
    fontSize: 14,
  },
});

export default TargetScreen;
